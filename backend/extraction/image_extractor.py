import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_image_content(file_path: str) -> dict:
    image = Image.open(file_path)

    text = pytesseract.image_to_string(image)

    return {
        "text": text.strip(),
        "signature_present": False,
        "signature_metadata": None
    }
