from sqlalchemy.orm import Session
from collections import defaultdict
from app.models.tax_record import TaxRecord


def build_dashboard(db: Session, user_id: int) -> dict:
    records = (
        db.query(TaxRecord)
        .filter(TaxRecord.user_id == user_id)
        .all()
    )

    total_income = 0.0
    total_expense = 0.0
    estimated_tax = 0.0

    income_by_category = defaultdict(float)
    expense_by_category = defaultdict(float)

    monthly = defaultdict(lambda: {"income": 0.0, "expense": 0.0, "tax": 0.0})

    for r in records:
        if r.transaction_type == "income":
            total_income += r.taxable_amount
            income_by_category[r.category] += r.taxable_amount
            monthly[r.date.strftime("%Y-%m")]["income"] += r.taxable_amount

        elif r.transaction_type == "expense":
            total_expense += r.taxable_amount
            expense_by_category[r.category] += r.taxable_amount
            monthly[r.date.strftime("%Y-%m")]["expense"] += r.taxable_amount

        if r.tax_amount:
            estimated_tax += r.tax_amount
            monthly[r.date.strftime("%Y-%m")]["tax"] += r.tax_amount

    monthly_trend = [
        {
            "month": m,
            "income": round(v["income"], 2),
            "expense": round(v["expense"], 2),
            "tax": round(v["tax"], 2),
        }
        for m, v in sorted(monthly.items())
    ]

    return {
        "summary": {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "estimated_tax": round(estimated_tax, 2),
        },
        "categories": {
            "income": dict(income_by_category),
            "expense": dict(expense_by_category),
        },
        "monthly_trend": monthly_trend,
    }