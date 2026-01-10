from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from models.vendor import Vendor
from schemas.vendor import VendorCreate, VendorResponse
from dependencies import get_db

router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"]
)


@router.post(
    "/",
    response_model=VendorResponse,
    status_code=status.HTTP_201_CREATED
)
def register_vendor(
    vendor: VendorCreate,
    db: Session = Depends(get_db)
):
    existing_vendor = (
        db.query(Vendor)
        .filter(Vendor.public_key_fingerprint == vendor.public_key_fingerprint)
        .first()
    )

    if existing_vendor:
        raise HTTPException(
            status_code=400,
            detail="Vendor with this public key fingerprint already exists"
        )

    new_vendor = Vendor(
        vendor_name=vendor.vendor_name,
        public_key_fingerprint=vendor.public_key_fingerprint
    )

    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)

    return new_vendor
