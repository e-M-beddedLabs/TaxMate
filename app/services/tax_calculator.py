from typing import List
from app.models.tax_record import TaxRecord

GST_RATE = 0.18  # v0 fixed rule


def compute_tax_for_record(record: TaxRecord) -> None:
    """
    Mutates the record in-place.
    Ensures tax_amount and total_amount are NEVER None.
    """
    taxable = record.taxable_amount or 0.0

    if record.tax_type == "GST":
        record.tax_amount = round(taxable * GST_RATE, 2)
    else:
        record.tax_amount = 0.0

    record.total_amount = round(taxable + record.tax_amount, 2)


def compute_summary(records: List[TaxRecord]) -> dict:
    total_income = 0.0
    total_expense = 0.0
    estimated_tax = 0.0

    for r in records:
        if r.transaction_type == "income":
            total_income += r.taxable_amount or 0.0
        elif r.transaction_type == "expense":
            total_expense += r.taxable_amount or 0.0

        if r.tax_amount:
            estimated_tax += r.tax_amount

    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "estimated_tax": round(estimated_tax, 2),
    }