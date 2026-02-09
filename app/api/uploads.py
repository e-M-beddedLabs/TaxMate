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