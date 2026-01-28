from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import uuid

from sqlalchemy.orm import Session

from extraction.pdf_extractor import extract_pdf_content
from extraction.image_extractor import extract_image_content
from integrity.integrity_service import evaluate_integrity
from integrity.vendor_identity_service import verify_vendor_identity
from utils.hashing import compute_sha256
from models.invoice import Invoice
from models.analysis_result import AnalysisResult
from models.vendor import Vendor
from dependencies import get_db
from services.analysis_service import run_ai_analysis
from services.rules_service import run_rules_checks


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

@router.get("/")
def list_invoices(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).order_by(Invoice.invoice_id.desc()).all()
    return [
        {
            "invoice_id": invoice.invoice_id,
            "status": invoice.status,
            "file_hash": invoice.file_hash,
            "is_signed": invoice.is_signed,
            "crypto_valid": invoice.crypto_valid,
            "signer_fingerprint": invoice.signer_fingerprint,
            "created_at": invoice.created_at,
        }
        for invoice in invoices
    ]


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

    # 🔐 STEP 1 — Compute SHA-256 (duplicate detection)
    file_hash = compute_sha256(contents)

    existing = db.query(Invoice).filter(
        Invoice.file_hash == file_hash
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Duplicate invoice detected"
        )

    # 5️⃣ Persist file
    safe_filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(INVOICE_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    # 6️⃣ Extract content (used later by AI, not crypto)
    if file_category == "pdf":
        _ = extract_pdf_content(file_path)
    else:
        _ = extract_image_content(file_path)

    # 🔐 STEP 2 — Cryptographic integrity evaluation
    crypto_raw = await evaluate_integrity(
        file_path=file_path,
        file_type=file_category
    )

    # 🔐 STEP 3 — Vendor cryptographic identity binding (fingerprint-based)
    vendor = None
    fingerprint = crypto_raw.get("signer_fingerprint")

    if fingerprint:
        vendor = db.query(Vendor).filter(
            Vendor.public_key_fingerprint == fingerprint
        ).first()

    vendor_result = verify_vendor_identity(
    signature_integrity=crypto_raw["signature_integrity"],
    certificate_trust=crypto_raw["certificate_trust"],
    signer_fingerprint=fingerprint,
    vendor=vendor
    )

    crypto = {
        **crypto_raw,
        **vendor_result
    }

    # 8️⃣ Persist invoice record
    invoice = Invoice(
        file_path=file_path,
        file_hash=file_hash,
        is_signed=crypto["signature_present"],
        crypto_valid=(crypto["signature_integrity"] == "valid"),
        signer_fingerprint=fingerprint,
        status="uploaded"
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # 9️⃣ Final response (clean, minimal, AI-ready)
    return {
        "status": "stored",
        "invoice_id": invoice.invoice_id,
        "file_hash": file_hash,
        "file_type": file_category,
        "crypto": crypto
    }


@router.post("/{invoice_id}/analyze")
async def analyze_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.invoice_id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    file_path = invoice.file_path
    extension = os.path.splitext(file_path)[1].lower()
    file_type = "pdf" if extension == ".pdf" else "image"

    crypto_raw = await evaluate_integrity(
        file_path=file_path,
        file_type=file_type
    )

    vendor = None
    fingerprint = crypto_raw.get("signer_fingerprint")

    if fingerprint:
        vendor = db.query(Vendor).filter(
            Vendor.public_key_fingerprint == fingerprint
        ).first()

    vendor_result = verify_vendor_identity(
        signature_integrity=crypto_raw["signature_integrity"],
        certificate_trust=crypto_raw["certificate_trust"],
        signer_fingerprint=fingerprint,
        vendor=vendor
    )

    crypto = {
        **crypto_raw,
        **vendor_result
    }

    ai_result = None
    if file_type == "pdf":
        ai_result = run_ai_analysis(file_path)
        rules_result = run_rules_checks(file_path)
    else:
        ai_result = {
            "status": "not_supported",
            "message": "AI analysis is only available for PDF invoices."
        }
        rules_result = {
            "status": "not_supported",
            "message": "Rules analysis is only available for PDF invoices."
        }

    prediction = -1
    confidence = 0.0
    model_version = "layoutlmv3-isolation-forest"

    if ai_result.get("status") == "ok":
        risk = ai_result.get("risk_level")
        if risk == "LOW":
            prediction = 0
        elif risk == "MEDIUM":
            prediction = 1
        elif risk == "HIGH":
            prediction = 2
        confidence = float(ai_result.get("anomaly_score") or confidence)

    analysis = AnalysisResult(
        invoice_id=invoice.invoice_id,
        prediction=prediction,
        confidence=confidence,
        model_version=model_version,
        crypto_json=crypto,
        ai_json=ai_result,
        rules_json=rules_result
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "invoice_id": invoice.invoice_id,
        "file_type": file_type,
        "crypto": crypto,
        "ai": ai_result,
        "rules": rules_result
    }
