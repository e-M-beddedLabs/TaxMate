import pytesseract
from PIL import Image

def extract_text(image_path: str) -> str:
    image = Image.open(image_path)
    return pytesseract.image_to_string(image)

def extract_text_from_image(image: Image.Image) -> str:
    """Extract text from PIL Image object"""
    return pytesseract.image_to_string(image)