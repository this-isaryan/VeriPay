import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_NAME = "bert-base-uncased"

_tokenizer = None
_model = None

def load_model():
    global _tokenizer, _model

    if _tokenizer is None or _model is None:
        print("Loading AI model...")
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
        _model.eval()
        print("Model loaded successfully")

def get_model():
    if _tokenizer is None or _model is None:
        raise RuntimeError("Model not loaded. Startup event failed.")
    return _tokenizer, _model
