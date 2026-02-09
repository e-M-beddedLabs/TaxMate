from typing import List
from app.models.tax_record import TaxRecord


def compute_tax_for_record(record: TaxRecord) -> None:
    """
    Mutates the record in-place.

    Rules:
    1. tax_rate is the single source of truth
    2. legacy tax_type is used ONLY as a fallback
    3. tax_rate is always persisted (never None)
    """

    taxable = record.taxable_amount or 0.0

    # ✅ determine tax rate (once)
    if record.tax_rate is None:
        if record.tax_type == "GST":
            record.tax_rate = 18.0
        else:
            record.tax_rate = 0.0

    # ✅ compute tax
    record.tax_amount = round((taxable * record.tax_rate) / 100, 2)
    record.total_amount = round(taxable + record.tax_amount, 2)


def compute_summary(records: List[TaxRecord]) -> dict:
    total_income = 0.0
    total_expense = 0.0
    estimated_tax = 0.0

    for r in records:
        taxable = r.taxable_amount or 0.0
        tax = r.tax_amount or 0.0

        if r.transaction_type == "income":
            total_income += taxable
        elif r.transaction_type == "expense":
            total_expense += taxable

        estimated_tax += tax

    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "estimated_tax": round(estimated_tax, 2),
    }