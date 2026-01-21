import torch
from ai_pipeline.model_loader import get_model

def run_inference(text: str):
    tokenizer, model = get_model()

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        prediction = int(torch.argmax(logits, dim=1).item())
        confidence = float(torch.softmax(logits, dim=1).max().item())

    return prediction, confidence
