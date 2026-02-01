import pytesseract
from PIL import Image
import shutil


# Resolve tesseract binary dynamically (cross-platform)
tesseract_path = shutil.which("tesseract")

if not tesseract_path:
    raise RuntimeError(
        "Tesseract OCR is not installed or not in PATH. "
        "Install it using:\n"
        "  macOS: brew install tesseract\n"
        "  Ubuntu: sudo apt install tesseract-ocr\n"
        "  Windows: https://github.com/UB-Mannheim/tesseract/wiki"
    )

pytesseract.pytesseract.tesseract_cmd = tesseract_path


def extract_image_content(file_path: str) -> dict:
    image = Image.open(file_path)

    text = pytesseract.image_to_string(image)

    return {
        "text": text.strip(),
        "signature_present": False,
        "signature_metadata": None,
    }
