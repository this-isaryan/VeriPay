from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.dependencies import get_db
from backend.models.invoice import Invoice
from backend.models.analysis_result import AnalysisResult
from ai_pipeline.inference import run_inference

router = APIRouter(
    prefix="/invoices",
    tags=["Invoice Analysis"]
)

@router.post("/{invoice_id}/analyze")
def analyze_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(
        Invoice.invoice_id == invoice_id
    ).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    prediction, confidence = run_inference(invoice.file_path)

    result = AnalysisResult(
        invoice_id=invoice.invoice_id,
        prediction=prediction,
        confidence=confidence,
        model_version="bert-v1"
    )

    invoice.status = "analyzed"

    db.add(result)
    db.commit()

    return {
        "invoice_id": invoice.invoice_id,
        "prediction": prediction,
        "confidence": confidence
    }