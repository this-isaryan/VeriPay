from fastapi import APIRouter
from ai_pipeline.inference import run_inference

router = APIRouter()

@router.post("/predict")
def predict(text: str):
    result = run_inference(text)
    return {"prediction": result}
