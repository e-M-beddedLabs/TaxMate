from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.core.database import SessionLocal
from app.core.security import get_current_user
from app.models.tax_record import TaxRecord
from app.services.tax_calculator import compute_summary

router = APIRouter(prefix="/reports", tags=["Reports"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def financial_year_range(today: date):
    if today.month >= 4:
        return date(today.year, 4, 1), date(today.year + 1, 3, 31)
    return date(today.year - 1, 4, 1), date(today.year, 3, 31)


@router.get("/summary")
def get_summary(
    period: str | None = Query(default=None),
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    today = date.today()

    # 🔑 Period logic
    if period:
        if period == "month":
            start_date = date(today.year, today.month, 1)
            end_date = today

        elif period == "prev_month":
            first_this_month = date(today.year, today.month, 1)
            last_prev_month = first_this_month - timedelta(days=1)
            start_date = date(last_prev_month.year, last_prev_month.month, 1)
            end_date = last_prev_month

        elif period == "fy":
            start_date, end_date = financial_year_range(today)

        elif period == "ytd":
            start_date = date(today.year, 1, 1)
            end_date = today

        else:
            raise HTTPException(status_code=400, detail="Invalid period")

    query = db.query(TaxRecord).filter(
        TaxRecord.user_id == current_user.id
    )

    if start_date:
        query = query.filter(TaxRecord.date >= start_date)

    if end_date:
        query = query.filter(TaxRecord.date <= end_date)

    return compute_summary(query.all())