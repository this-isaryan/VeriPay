import time
import torch
from ai_pipeline.model_loader import tokenizer, model

def run_inference(text: str):
    start = time.time()

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=1).item()

    print(f"Inference time: {time.time() - start:.3f}s")
    return prediction