from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os

from ai_pipeline.deployment.analyze_invoice import analyze_invoice_file

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.post("/analyze")
async def analyze_invoice(file: UploadFile = File(...)):
    # --- Validate file ---
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF invoices are supported")

    # --- Save to temp file ---
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            contents = await file.read()
            tmp.write(contents)
            temp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save uploaded file")

    # --- Run AI analysis ---
    try:
        result = analyze_invoice_file(temp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return JSONResponse(content=result)