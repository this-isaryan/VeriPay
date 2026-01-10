from pydantic import BaseModel


class VendorCreate(BaseModel):
    vendor_name: str
    public_key_fingerprint: str


class VendorResponse(BaseModel):
    vendor_id: int
    vendor_name: str
    public_key_fingerprint: str
    status: str

    class Config:
        from_attributes = True
