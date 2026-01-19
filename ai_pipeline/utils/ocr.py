import pytesseract
from PIL import Image

def extract_image_content(file_path: str) -> dict:
    image = Image.open(file_path)

    text = pytesseract.image_to_string(image)

    return {
        "text": text.strip(),
        "signature_present": False,
        "signature_metadata": None
    }
