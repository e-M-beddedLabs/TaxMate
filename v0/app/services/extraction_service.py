import re

def extract_amounts(text: str):
    amounts = re.findall(r"\d+\.\d{2}", text)
    amounts = list(map(float, amounts))

    if not amounts:
        return None, None, None, 0.0

    total = max(amounts)
    gst = round(total * 0.18, 2)
    taxable = total - gst

    confidence = 0.85
    return taxable, gst, total, confidence