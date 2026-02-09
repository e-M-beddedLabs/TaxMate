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
        "error_rows": len(errors),
        "records": records,
        "errors": errors,
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
    current_user: User = Depends(get_current_user),
):
    """Upload and process invoice images using OCR"""
    from app.services.ocr_service import extract_text_from_image
    from PIL import Image
    import re
    
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    results = []
    
    for file in files:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            results.append({
                "filename": file.filename,
                "status": "error",
                "error": "Only image files are supported"
            })
            continue
        
        try:
            # Read image
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            
            # Extract text using OCR
            text = extract_text_from_image(image)
            
            # Basic parsing of invoice data
            # This is a simple implementation - you can enhance this based on your invoice format
            invoice_data = {
                "filename": file.filename,
                "status": "success",
                "extracted_text": text,
                "parsed_data": parse_invoice_text(text)
            }
            
            results.append(invoice_data)
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e)
            })
    
    return {
        "total_files": len(files),
        "successful": len([r for r in results if r["status"] == "success"]),
        "failed": len([r for r in results if r["status"] == "error"]),
        "results": results
    }


def parse_invoice_text(text: str) -> dict:
    """
    Parse invoice text to extract structured data
    This is a basic implementation - enhance based on your invoice format
    """
    import re
    from datetime import datetime
    
    parsed = {
        "date": None,
        "description": None,
        "amount": None,
        "category": "Misc"
    }
    
    # Try to find date (various formats)
    date_patterns = [
        r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',  # DD/MM/YYYY or MM/DD/YYYY
        r'\d{4}[/-]\d{1,2}[/-]\d{1,2}',     # YYYY/MM/DD
    ]
    
    for pattern in date_patterns:
        date_match = re.search(pattern, text)
        if date_match:
            parsed["date"] = date_match.group()
            break
    
    # Try to find amount (currency symbols + numbers)
    amount_patterns = [
        r'(?:Rs\.?|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)',  # Indian Rupee
        r'(?:\$|USD)\s*(\d+(?:,\d+)*(?:\.\d{2})?)',    # USD
        r'(?:Total|Amount)[:\s]*(\d+(?:,\d+)*(?:\.\d{2})?)',  # Generic total
    ]
    
    for pattern in amount_patterns:
        amount_match = re.search(pattern, text, re.IGNORECASE)
        if amount_match:
            amount_str = amount_match.group(1).replace(',', '')
            parsed["amount"] = float(amount_str)
            break
    
    # Extract first meaningful line as description
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        parsed["description"] = lines[0][:100]  # First line, max 100 chars
    
    return parsed