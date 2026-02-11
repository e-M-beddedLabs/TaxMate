from pydantic import BaseModel


class TaxSummaryResponse(BaseModel):
    total_income: float
    total_expense: float
    gst_paid: float
    estimated_income_tax: float
    estimated_total_tax: float