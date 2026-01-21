from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey
from datetime import datetime
from backend.conn_db import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)

    invoice_id = Column(Integer, ForeignKey("invoices.invoice_id"), nullable=False)

    prediction = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=True)

    model_version = Column(String, default="bert-v1")
    created_at = Column(DateTime, default=datetime.utcnow)