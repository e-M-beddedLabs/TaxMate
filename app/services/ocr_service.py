import pytesseract
from PIL import Image

def extract_text(image_path: str) -> str:
    try:
        image = Image.open(image_path)
        return pytesseract.image_to_string(image)
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""

def extract_text_from_image(image: Image.Image) -> str:
    """Extract text from PIL Image object"""
    try:
        return pytesseract.image_to_string(image)
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""