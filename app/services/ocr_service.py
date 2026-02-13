import pytesseract
from PIL import Image

def extract_text(image_path: str) -> str:
    try:
        image = Image.open(image_path)
        return extract_text_from_image(image)
    except Exception as e:
        raise RuntimeError(f"Failed to open image: {e}")

def extract_text_from_image(image: Image.Image) -> str:
    """Extract text from PIL Image object"""
    try:
        # Verify tesseract is in path (optional but helpful debugging)
        # shutil.which("tesseract")
        return pytesseract.image_to_string(image)
    except pytesseract.TesseractNotFoundError:
        raise RuntimeError("Tesseract OCR is not installed or not in PATH.")
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed: {e}")