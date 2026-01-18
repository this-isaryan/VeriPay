import sys
import pickle
import json
import numpy as np
from typing import Dict, Any

from advanced.pipeline_layoutlm import process_invoice_layoutlm
from interpretation.explanation import compute_z_score, generate_explanations
from interpretation.risk_policy import interpret_risk

MODEL_PATH = "saved_models/anomaly_model.pkl"
STATS_PATH = "saved_models/embedding_stats.json"


# -------------------------------
# Core callable function (NEW)
# -------------------------------
def analyze_invoice_file(invoice_path: str) -> Dict[str, Any]:
    """
    Analyze a single invoice PDF and return structured results.
    This function is SAFE to call from FastAPI.
    """

    # ---- Load trained model ----
    with open(MODEL_PATH, "rb") as f:
        detector = pickle.load(f)

    # ---- Load embedding statistics ----
    with open(STATS_PATH, "r") as f:
        stats = json.load(f)

    # ---- Extract embedding ----
    embedding = process_invoice_layoutlm(invoice_path)

    # ---- Anomaly scoring ----
    raw_score = detector.score(dict(enumerate(embedding)))
    normalized_score = 1 / (1 + np.exp(-raw_score))

    # ---- Distance from centroid ----
    centroid = np.array(stats["centroid"])
    distance = np.linalg.norm(embedding - centroid)

    # ---- Z-score ----
    distance_z = compute_z_score(
        distance,
        stats["mean_distance"],
        stats["std_distance"]
    )

    # ---- Risk interpretation ----
    risk, review_required = interpret_risk(normalized_score)

    # Policy override
    if distance_z >= 2.5:
        risk = "HIGH"
        review_required = True

    # ---- Explanation ----
    explanations = generate_explanations(distance_z, normalized_score)

    return {
        "anomaly_score": round(float(normalized_score), 3),
        "risk_level": risk,
        "review_required": review_required,
        "metrics": {
            "embedding_distance": round(float(distance), 2),
            "distance_z_score": round(float(distance_z), 2)
        },
        "explanations": explanations
    }


# -------------------------------
# CLI entry point (UNCHANGED BEHAVIOR)
# -------------------------------
def main():
    if len(sys.argv) != 2:
        print("Usage: python -m deployment.analyze_invoice <invoice.pdf>")
        sys.exit(1)

    invoice_path = sys.argv[1]
    result = analyze_invoice_file(invoice_path)

    print("\nAI Invoice Review Result")
    print("------------------------")
    print(f"Invoice: {invoice_path}")
    print(f"Anomaly score: {result['anomaly_score']}")
    print(f"Risk level: {result['risk_level']}")
    print(f"Review required: {result['review_required']}")
    print(f"Embedding distance: {result['metrics']['embedding_distance']}")
    print(f"Distance z-score: {result['metrics']['distance_z_score']}")
    print("Explanation:")
    for e in result["explanations"]:
        print(f" - {e}")


if __name__ == "__main__":
    main()
