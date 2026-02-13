from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import csv
import io
from datetime import datetime
from fastapi import BackgroundTasks


from app.core.database import SessionLocal
from app.core.security import get_current_user
from app.schemas.tax_record import TaxRecordCreate
from app.services.csv_import_service import parse_csv_rows
from app.models.user import User

router = APIRouter(prefix="/uploads", tags=["Uploads"])

MAX_CSV_ROWS = 1000
MAX_ERROR_RATIO = 0.2


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/csv/preview")
def preview_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(content))

    records = []
    errors = []

    for idx, row in enumerate(reader, start=1):
        try:
            record = TaxRecordCreate(
                source="csv",
                date=datetime.strptime(row["date"], "%Y-%m-%d").date(),
                description=row["description"],
                category=row["category"],
                transaction_type=row["transaction_type"],
                taxable_amount=float(row["taxable_amount"]),
                tax_type=row.get("tax_type", "NONE"),
            )
            records.append(record)
        except Exception as e:
            errors.append({"row": idx, "error": str(e)})

    parsed_rows = len(records) + len(errors)

    if parsed_rows > MAX_CSV_ROWS:
        raise HTTPException(
            status_code=400,
            detail=f"CSV exceeds max limit of {MAX_CSV_ROWS} rows",
        )

    if parsed_rows > 0 and (len(errors) / parsed_rows) > MAX_ERROR_RATIO:
        raise HTTPException(
            status_code=400,
            detail="Too many invalid rows in CSV",
        )

    return {
        "parsed_rows": parsed_rows,
        "valid_rows": records,
        "error_rows": errors,
    }

'''
@router.post("/csv/insert")
def insert_csv(
    records: list[TaxRecordCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    inserted = parse_csv_rows(db, current_user.id, records)
    return {"inserted": inserted}
    '''

@router.post("/csv/insert")
def insert_csv(
    records: list[TaxRecordCreate],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    background_tasks.add_task(
        parse_csv_rows,
        db,
        current_user.id,
        records,
    )
    return {
        "status": "accepted",
        "message": "CSV processing started in background"
    }


@router.post("/invoice/upload")
async def upload_invoices(
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload and process invoice images using OCR and insert records"""
    from app.services.ocr_service import extract_text_from_image
    from PIL import Image
    
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    results = []
    records_to_insert = []
    
    for file in files:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            results.append({
                "filename": file.filename,
                "status": "error",
                "message": "Only image files are supported"
            })
            continue
        
        try:
            # Read image
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            
            # Extract text using OCR
            # Extract text using OCR in a thread pool
            import asyncio
            from concurrent.futures import ThreadPoolExecutor
            
            loop = asyncio.get_event_loop()
            with ThreadPoolExecutor() as pool:
                text = await loop.run_in_executor(pool, extract_text_from_image, image)
            
            # Parse invoice data
            parsed_data = parse_invoice_text(text)
            
            if parsed_data["amount"] and parsed_data["date"]:
                 # Create TaxRecordCreate object
                 try:
                    record_create = TaxRecordCreate(
                        source=f"invoice_upload_{file.filename}",
                        date=datetime.strptime(parsed_data["date"], "%Y-%m-%d").date(),
                        description=parsed_data["description"] or f"Invoice {file.filename}",
                        category=parsed_data["category"],
                        transaction_type="expense", # Invoices are usually expenses
                        taxable_amount=parsed_data["amount"],
                        tax_type="NONE",
                        tax_rate=0.0
                    )
                    records_to_insert.append(record_create)
                    results.append({
                        "filename": file.filename,
                        "status": "success",
                        "parsed_data": parsed_data
                    })
                 except Exception as e:
                     results.append({
                        "filename": file.filename,
                        "status": "error",
                        "message": f"Validation Error: {str(e)}"
                    })
            else:
                 results.append({
                    "filename": file.filename,
                    "status": "warning",
                    "message": "Could not extract sufficient data (Date/Amount)",
                    "extracted_text_preview": text[:100]
                })

        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "error",
                "message": str(e)
            })
    
    # Insert valid records
    inserted_count = 0
    if records_to_insert:
        inserted_count = parse_csv_rows(db, current_user.id, records_to_insert)

    return {
        "total_files": len(files),
        "successful_parses": len([r for r in results if r["status"] == "success"]),
        "inserted_records": inserted_count,
        "results": results
    }


def parse_invoice_text(text: str) -> dict:
    """
    Parse invoice text to extract structured data
    """
    import re
    from datetime import datetime
    
    parsed = {
        "date": None, # Format YYYY-MM-DD for consistency
        "description": None,
        "amount": None,
        "category": "Office Expense" # Default
    }
    
    # Try to find date (various formats)
    # Return as YYYY-MM-DD
    date_patterns = [
        (r'\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b', '%Y-%m-%d'), # YYYY-MM-DD
        (r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b', '%d-%m-%Y'), # DD-MM-YYYY
        (r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{2})\b', '%d-%m-%y'), # DD-MM-YY
    ]
    
    for pattern, fmt in date_patterns:
        match = re.search(pattern, text)
        if match:
             try:
                dt = datetime.strptime(match.group(), fmt) # Parse raw match
                # Only if match.group() matches fmt. Regex might catch '2023-55-12' which is invalid
                # But strptime handles validity.
                # Re-construct from groups to be safe if regex is loose?
                # Actually, best to just try parsing the match string
                # Wait, regex might match 12/12/2023 but datetime expects specific separators
                # Simple approach: cleanup separators
                date_str = match.group().replace('/', '-')
                if fmt == '%d-%m-%Y':
                    dt = datetime.strptime(date_str, '%d-%m-%Y')
                elif fmt == '%d-%m-%y':
                     dt = datetime.strptime(date_str, '%d-%m-%y')
                else:
                    dt = datetime.strptime(date_str, '%Y-%m-%d')
                
                parsed["date"] = dt.strftime("%Y-%m-%d")
                break
             except ValueError:
                 continue
    
    # If no date found, default to today? Or leave None (fail)
    if not parsed["date"]:
        parsed["date"] = datetime.today().strftime("%Y-%m-%d") # Fallback to today

    # Try to find amount (currency symbols + numbers)
    # Look for largest number that looks like a total?
    amount_patterns = [
        r'(?:total|amount|due|payable)[\s\w]*[:=]?\s*[\$₹Rs\.]?\s*(\d+(?:,\d+)*(?:\.\d{2})?)',
        r'[\$₹Rs]\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)'
    ]
    
    found_amounts = []
    for pattern in amount_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for m in matches:
             try:
                val = float(m.group(1).replace(',', ''))
                found_amounts.append(val)
             except:
                 pass
    
    if found_amounts:
        parsed["amount"] = max(found_amounts) # Assume largest amount found is Total
    
    # Description
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    # Skip lines that look like dates or amounts only
    for line in lines:
        if len(line) > 5 and not re.search(r'^[\d\W]+$', line):
            parsed["description"] = line[:100]
            break
            
    return parsed