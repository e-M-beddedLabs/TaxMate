from datetime import date, datetime
import re

def safe_date(value):
    if isinstance(value, date):
        return value
    try:
        return date.fromisoformat(value)
    except Exception:
        return None

from typing import Optional

def parse_date(date_str: str) -> Optional[date]:
    """
    Parses a date string into a datetime.date object.
    Supports multiple formats:
    - YYYY-MM-DD
    - DD-MM-YYYY
    - MM/DD/YYYY
    - YYYY/MM/DD
    - DD-Mon-YYYY (e.g., 31-Dec-2023)
    - Dates with time components
    """
    if not date_str:
        return None

    date_str = date_str.strip()

    # Valid formats for date parsing
    # Formats that might contain spaces
    complex_formats = ["%B %d, %Y", "%b %d, %Y"]
    # Formats that typically don't contain spaces (or where strict matching is preferred)
    simple_formats = [
        "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%d/%m/%Y", "%Y/%m/%d",
        "%d-%b-%Y", "%d-%B-%Y"
    ]
    
    all_formats = simple_formats + complex_formats

    # 1. Try to parse the full string against all formats (handles "December 31, 2023")
    for fmt in all_formats:
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue

    # 2. If that fails, try to strip time components (e.g., "2023-12-31 10:00:00")
    # T-separator (ISO 8601)
    if "T" in date_str:
        try:
            return datetime.strptime(date_str.split("T")[0], "%Y-%m-%d").date()
        except ValueError:
            pass
            
    # Space separator (only for formats that DON'T contain spaces themselves)
    # This assumes that if we are splitting by space, the date part must match one of the simple_formats
    if " " in date_str:
        first_part = date_str.split(" ")[0]
        for fmt in simple_formats:
            try:
                return datetime.strptime(first_part, fmt).date()
            except ValueError:
                continue
            
    return None