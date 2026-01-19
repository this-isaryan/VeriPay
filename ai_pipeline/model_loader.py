import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_NAME = "bert-base-uncased"

tokenizer = None
model = None

def load_model():
    global tokenizer, model

    if model is None or tokenizer is None:
        print("Loading AI model...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
        model.eval()
        print("Model loaded successfully")

    return tokenizer, model