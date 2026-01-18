from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from backend.conn_db import Base

class Invoice(Base):
    __tablename__ = "invoices"

    invoice_id = Column(Integer, primary_key=True, index=True)

    # File identity
    file_path = Column(String, nullable=False)
    file_hash = Column(String, nullable=False, unique=True)

    # Integrity / crypto
    is_signed = Column(Boolean, nullable=False, default=False)
    crypto_valid = Column(Boolean, nullable=True)
    signer_fingerprint = Column(String, nullable=True)

    # Status lifecycle
    status = Column(String, default="uploaded", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
