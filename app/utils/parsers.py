from datetime import date

def safe_date(value):
    if isinstance(value, date):
        return value
    try:
        return date.fromisoformat(value)
    except Exception:
        return None