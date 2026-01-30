import json
import pickle
from pathlib import Path
import sys
import shutil
import os
import platform
import numpy as np


def ensure_poppler_available():
    system = platform.system().lower()

    if system == "windows":
        poppler_path = Path(r"C:\poppler\poppler-25.12.0\Library\bin")
        if not poppler_path.exists():
            raise RuntimeError("Poppler not found on Windows.")
        os.environ["PATH"] += f";{poppler_path}"
    else:
        from shutil import which
        if which("pdftoppm") is None:
            raise RuntimeError("Poppler not found.")


AI_PIPELINE_DIR = Path(__file__).resolve().parents[2] / "ai_pipeline"
MODEL_PATH = AI_PIPELINE_DIR / "saved_models" / "anomaly_model.pkl"
STATS_PATH = AI_PIPELINE_DIR / "saved_models" / "embedding_stats.json"

if str(AI_PIPELINE_DIR) not in sys.path:
    sys.path.append(str(AI_PIPELINE_DIR))


def run_ai_analysis(invoice_path: str) -> dict:
    tesseract_path = shutil.which("tesseract")
    if not tesseract_path:
        return {"status": "error", "message": "Tesseract not installed"}

    try:
        ensure_poppler_available()
    except RuntimeError as exc:
        return {"status": "error", "message": str(exc)}

    if not MODEL_PATH.exists() or not STATS_PATH.exists():
        return {"status": "error", "message": "Model files missing"}

    import pytesseract
    from advanced.pipeline_layoutlm import process_invoice_layoutlm
    from interpretation.explanation import compute_z_score, generate_explanations
    from interpretation.risk_policy import interpret_risk

    pytesseract.pytesseract.tesseract_cmd = tesseract_path

    with open(MODEL_PATH, "rb") as f:
        detector = pickle.load(f)

    with open(STATS_PATH, "r") as f:
        stats = json.load(f)

    embedding = process_invoice_layoutlm(invoice_path)

    raw_score = detector.score(dict(enumerate(embedding)))
    normalized_score = 1 / (1 + np.exp(-raw_score))

    centroid = np.array(stats["centroid"])
    distance = float(np.linalg.norm(embedding - centroid))

    distance_z = compute_z_score(
        distance,
        stats["mean_distance"],
        stats["std_distance"]
    )

    risk, review_required = interpret_risk(normalized_score)

    explanations = generate_explanations(distance_z, normalized_score)

    return {
        "status": "ok",
        "anomaly_score": round(float(normalized_score), 3),
        "risk_level": risk,
        "review_required": review_required,
        "embedding_distance": round(distance, 2),
        "distance_z_score": round(distance_z, 2),
        "explanations": explanations
    }
