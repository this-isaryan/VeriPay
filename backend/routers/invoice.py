from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import uuid

from sqlalchemy.orm import Session
from sqlalchemy import func

from extraction.pdf_extractor import extract_pdf_content
from extraction.image_extractor import extract_image_content
from integrity.integrity_service import evaluate_integrity
from integrity.vendor_identity_service import verify_vendor_identity
from utils.hashing import compute_sha256
from models.invoice import Invoice
from models.vendor import Vendor
from dependencies import get_db


router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)

ALLOWED_MIME_TYPES = {
    "application/pdf": "pdf",
    "image/png": "image",
    "image/jpeg": "image",
    "image/jpg": "image"
}

INVOICE_DIR = "invoices"
os.makedirs(INVOICE_DIR, exist_ok=True)


@router.post("/upload")
async def upload_invoice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1️⃣ Basic sanity check
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a name")

    # 2️⃣ MIME validation
    content_type = file.content_type
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    file_category = ALLOWED_MIME_TYPES[content_type]

    # 3️⃣ Extension check
    extension = os.path.splitext(file.filename)[1].lower()
    if file_category == "pdf" and extension != ".pdf":
        raise HTTPException(status_code=400, detail="Expected PDF")

    if file_category == "image" and extension not in [".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail="Expected image")

    # 4️⃣ Read file bytes
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file")

    # 🔐 STEP 1 — Compute SHA-256
    file_hash = compute_sha256(contents)

    # 🔐 STEP 1 — Reject duplicates
    existing = db.query(Invoice).filter(Invoice.file_hash == file_hash).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Duplicate invoice detected (same file already uploaded)"
        )

    # 5️⃣ Store file
    safe_filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(INVOICE_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    # 6️⃣ Extract content
    if file_category == "pdf":
        extracted = extract_pdf_content(file_path)
    else:
        extracted = extract_image_content(file_path)

    # 7️⃣ Integrity evaluation (cryptography only)
    integrity = await evaluate_integrity(
        file_path=file_path,
        file_type=file_category
    )

    # 🔐 STEP 3 — Vendor cryptographic identity (FINGERPRINT FIRST)
    vendor = None
    fingerprint = integrity.get("signer_fingerprint")

    if fingerprint:
        vendor = db.query(Vendor).filter(
            Vendor.public_key_fingerprint == fingerprint
        ).first()

    # 🧾 STEP 2 — Issuer consistency check (OPTIONAL, advisory only)
    issuer_mismatch = False
    extracted_issuer = None

    text = extracted.get("text")
    if vendor and text:
        for line in text.splitlines():
            lowered = line.lower()
            if lowered.startswith(("issuer:", "supplier:", "vendor:", "from:", "billed by:")):
                extracted_issuer = line.split(":", 1)[1].strip()
                if extracted_issuer.lower() != vendor.vendor_name.lower():
                    issuer_mismatch = True
                break

    integrity["issuer_extracted"] = extracted_issuer
    integrity["issuer_mismatch"] = issuer_mismatch

    # 🔐 Final vendor crypto status
    vendor_crypto_status = verify_vendor_identity(
        signature_status=integrity.get("signature_status"),
        signer_fingerprint=fingerprint,
        vendor=vendor
    )

    integrity["vendor_crypto_status"] = vendor_crypto_status

    # 8️⃣ Persist invoice record
    invoice = Invoice(
        file_path=file_path,
        file_hash=file_hash,
        is_signed=integrity.get("is_signed", False),
        crypto_valid=integrity.get("crypto_valid"),
        signer_fingerprint=fingerprint,
        status="uploaded"
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # 9️⃣ Response
    return {
        "status": "stored",
        "invoice_id": invoice.invoice_id,
        "file_hash": file_hash,
        "file_type": file_category,
        "integrity": integrity
    }
