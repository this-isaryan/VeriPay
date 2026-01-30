import re
from typing import Optional, Tuple

from PyPDF2 import PdfReader

AMOUNT_RE = re.compile(r"(?<!\d)(?:\$?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})|\$?\s?\d+\.\d{2})(?!\d)")

TOTAL_KEYWORDS = ("total", "amount due", "balance due", "invoice total")
SUBTOTAL_KEYWORDS = ("subtotal",)
TAX_KEYWORDS = ("tax", "hst", "gst", "vat")


def _parse_amount(raw: str) -> Optional[float]:
    cleaned = raw.replace("$", "").replace(",", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return None


def _extract_text_and_fonts(pdf_path: str) -> Tuple[str, list[str]]:
    reader = PdfReader(pdf_path)
    text_parts = []
    fonts = set()

    for page in reader.pages:
        try:
            text_parts.append(page.extract_text() or "")
        except Exception:
            text_parts.append("")

        resources = page.get("/Resources")
        try:
            resources_obj = resources.get_object() if resources else None
        except Exception:
            resources_obj = resources

        if resources_obj and "/Font" in resources_obj:
            font_dict = resources_obj["/Font"]
            try:
                font_keys = font_dict.keys()
            except Exception:
                try:
                    font_keys = font_dict.get_object().keys()
                except Exception:
                    font_keys = []
            for key in font_keys:
                fonts.add(str(key))

    return "\n".join(text_parts).strip(), sorted(fonts)


def run_rules_checks(pdf_path: str) -> dict:
    text, fonts = _extract_text_and_fonts(pdf_path)
    words = [word for word in text.split() if word.strip()]
    word_count = len(words)

    if not text:
        return {
            "status": "no_text",
            "word_count": word_count,
            "font_count": len(fonts),
            "fonts": fonts,
            "message": "No text extracted from PDF."
        }

    subtotal = None
    tax = None
    total = None
    line_item_sum = 0.0
    line_item_count = 0

    for line in text.splitlines():
        if not line.strip():
            continue
        amounts = [_parse_amount(m.group(0)) for m in AMOUNT_RE.finditer(line)]
        amounts = [amount for amount in amounts if amount is not None]
        if not amounts:
            continue

        lowered = line.lower()
        last_amount = amounts[-1]

        if any(keyword in lowered for keyword in TOTAL_KEYWORDS):
            total = last_amount
            continue

        if any(keyword in lowered for keyword in SUBTOTAL_KEYWORDS):
            subtotal = last_amount
            continue

        if any(keyword in lowered for keyword in TAX_KEYWORDS):
            tax = last_amount
            continue

        line_item_sum += last_amount
        line_item_count += 1

    checks = {}
    if subtotal is not None and line_item_count:
        checks["subtotal_matches_items"] = abs(subtotal - line_item_sum) < 0.01
        checks["subtotal_delta"] = round(subtotal - line_item_sum, 2)
    else:
        checks["subtotal_matches_items"] = None
        checks["subtotal_delta"] = None

    if total is not None and subtotal is not None:
        expected_total = subtotal + (tax or 0.0)
        checks["total_matches_subtotal_tax"] = abs(total - expected_total) < 0.01
        checks["total_delta"] = round(total - expected_total, 2)
    else:
        checks["total_matches_subtotal_tax"] = None
        checks["total_delta"] = None

    if line_item_count == 0 and subtotal is None and total is None:
        status = "insufficient_amounts"
    else:
        status = "ok"

    return {
        "status": status,
        "word_count": word_count,
        "font_count": len(fonts),
        "fonts": fonts,
        "line_item_count": line_item_count,
        "line_item_sum": round(line_item_sum, 2) if line_item_count else None,
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "checks": checks
    }