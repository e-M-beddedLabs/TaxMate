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

        elif period == "custom":
            pass

        else:
            raise HTTPException(status_code=400, detail="Invalid period")

    query = db.query(TaxRecord).filter(
        TaxRecord.user_id == current_user.id
    )

    if start_date:
        query = query.filter(TaxRecord.date >= start_date)

    if end_date:
        query = query.filter(TaxRecord.date <= end_date)

    records = query.all()
    return compute_summary(records)


@router.get("/export")
def export_report(
    period: str | None = Query(default=None),
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Export financial report as CSV"""
    from fastapi.responses import StreamingResponse
    from io import StringIO
    import csv
    
    # Use same date filtering logic as get_summary
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
            pass

        else:
            raise HTTPException(status_code=400, detail="Invalid period")

    # Query records
    query = db.query(TaxRecord).filter(TaxRecord.user_id == current_user.id)

    if start_date:
        query = query.filter(TaxRecord.date >= start_date)
    if end_date:
        query = query.filter(TaxRecord.date <= end_date)

    records = query.order_by(TaxRecord.date).all()

    # Generate CSV
    output = StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "Date",
        "Description",
        "Category",
        "Type",
        "Taxable Amount",
        "Tax Amount",
        "Total Amount"
    ])
    
    # Data rows
    total_taxable = 0
    total_tax = 0
    total_amount = 0
    
    for record in records:
        writer.writerow([
            record.date.strftime("%Y-%m-%d"),
            record.description,
            record.category,
            record.transaction_type.capitalize(),
            f"{record.taxable_amount:.2f}",
            f"{record.tax_amount:.2f}" if record.tax_amount else "0.00",
            f"{record.total_amount:.2f}" if record.total_amount else "0.00"
        ])
        total_taxable += record.taxable_amount
        total_tax += record.tax_amount or 0
        total_amount += record.total_amount or 0
    
    # Summary row
    writer.writerow([])
    writer.writerow([
        "TOTAL",
        "",
        "",
        "",
        f"{total_taxable:.2f}",
        f"{total_tax:.2f}",
        f"{total_amount:.2f}"
    ])
    
    # Prepare response
    output.seek(0)
    filename = f"financial_report_{start_date or 'all'}_{end_date or 'all'}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )