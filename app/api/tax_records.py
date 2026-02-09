from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user
from app.schemas.tax_record import TaxRecordCreate, TaxRecordResponse
from app.crud.tax_record import get_user_tax_records
from app.models.user import User
from app.services.tax_calculator import compute_tax_for_record
from app.models.tax_record import TaxRecord

# ✅ THIS WAS MISSING
router = APIRouter(prefix="/records", tags=["Tax Records"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TaxRecordResponse)
def create_record(
    record: TaxRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_record = TaxRecord(
        **record.dict(),
        user_id=current_user.id,
    )

    # compute tax BEFORE saving
    compute_tax_for_record(db_record)

    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return db_record


@router.get("/", response_model=list[TaxRecordResponse])
def list_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = get_user_tax_records(db, current_user.id)

    # 🔧 BACKFILL legacy records (created before tax logic existed)
    for r in records:
        if r.tax_amount is None or r.total_amount is None:
            compute_tax_for_record(r)

    db.commit()
    return records