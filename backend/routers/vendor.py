from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from cryptography import x509
from cryptography.hazmat.backends import default_backend
import hashlib
from cryptography.hazmat.primitives import serialization

from models.vendor import Vendor
from dependencies import get_db
from dependencies import get_current_user
from models.user import User

router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def register_vendor(
    user: User = Depends(get_current_user),
    vendor_name: str = Form(...),
    certificate: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    cert_bytes = await certificate.read()

    try:
        cert = x509.load_pem_x509_certificate(cert_bytes, default_backend())
    except ValueError:
        try:
            cert = x509.load_der_x509_certificate(cert_bytes, default_backend())
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid certificate file")

    fingerprint = hashlib.sha256(
    cert.public_bytes(serialization.Encoding.DER)).hexdigest()

    existing = db.query(Vendor).filter(
        Vendor.public_key_fingerprint == fingerprint
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Vendor with this certificate already exists"
        )

    vendor = Vendor(
        vendor_name=vendor_name,
        public_key_fingerprint=fingerprint,
        status="active"
    )

    db.add(vendor)
    db.commit()
    db.refresh(vendor)

    return {
        "vendor_id": vendor.vendor_id,
        "vendor_name": vendor.vendor_name,
        "status": vendor.status
    }
