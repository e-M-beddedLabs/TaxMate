from sqlalchemy.orm import Session
from app.models.tax_record import TaxRecord
from app.services.tax_rules import compute_income_tax


def build_tax_summary(db: Session, user_id: int) -> dict:
    records = (
        db.query(TaxRecord)
        .filter(TaxRecord.user_id == user_id)
        .all()
    )

    total_income = 0.0
    total_expense = 0.0
    gst_paid = 0.0

    for r in records:
        if r.transaction_type == "income":
            total_income += r.taxable_amount

        elif r.transaction_type == "expense":
            total_expense += r.taxable_amount

        if r.tax_type == "GST" and r.tax_amount:
            gst_paid += r.tax_amount

    income_tax_estimate = compute_income_tax(total_income)

    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "gst_paid": round(gst_paid, 2),
        "estimated_income_tax": income_tax_estimate,
        "estimated_total_tax": round(gst_paid + income_tax_estimate, 2),
    }