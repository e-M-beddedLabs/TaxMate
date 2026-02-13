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

    # ❌ Invalidate cache so reports are fresh
    from app.services.dashboard_cache import invalidate_dashboard_cache
    invalidate_dashboard_cache(current_user.id)

    return db_record


from typing import Optional
from datetime import date, timedelta

@router.get("/", response_model=list[TaxRecordResponse])
def list_records(
    period: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Build query with date filtering
    query = db.query(TaxRecord).filter(TaxRecord.user_id == current_user.id)
    
    # Apply period-based filtering
    if period:
        today = date.today()
        
        if period == "month":
            start_date = date(today.year, today.month, 1)
            end_date = today
        elif period == "prev_month":
            first_this_month = date(today.year, today.month, 1)
            last_prev_month = first_this_month - timedelta(days=1)
            start_date = date(last_prev_month.year, last_prev_month.month, 1)
            end_date = last_prev_month
        elif period == "fy":
            if today.month >= 4:
                start_date = date(today.year, 4, 1)
                end_date = date(today.year + 1, 3, 31)
            else:
                start_date = date(today.year - 1, 4, 1)
                end_date = date(today.year, 3, 31)
        elif period == "ytd":
            start_date = date(today.year, 1, 1)
            end_date = today
        elif period == "custom":
            pass  # Use provided start_date and end_date
    
    # Apply date filters to query
    if start_date:
        query = query.filter(TaxRecord.date >= start_date)
    if end_date:
        query = query.filter(TaxRecord.date <= end_date)
    
    records = query.all()

    # 🔧 BACKFILL legacy records (created before tax logic existed)
    for r in records:
        if r.tax_amount is None or r.total_amount is None:
            compute_tax_for_record(r)

    db.commit()
    return records