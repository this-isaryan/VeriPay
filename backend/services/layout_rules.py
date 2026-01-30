import re

AMOUNT_RE = re.compile(r"\d{1,3}(?:,\d{3})*(?:\.\d{2})")

def extract_amount_candidates(tokens):
    candidates = []

    for t in tokens:
        match = AMOUNT_RE.search(t["text"])
        if not match:
            continue

        x1, y1, x2, y2 = t["bbox"]

        candidates.append({
            "value": float(match.group(0).replace(",", "")),
            "bbox": t["bbox"],
            "y": y1,
            "x": x1
        })

    return candidates


def classify_totals(candidates):
    # bottom-most, right-most numbers
    candidates.sort(key=lambda c: (c["y"], c["x"]), reverse=True)

    return {
        "total_candidates": candidates[:2],
        "subtotal_candidates": candidates[2:4]
    }
