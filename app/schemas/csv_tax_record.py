from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class CSVTaxRecord(BaseModel):
    source: str = Field(default="csv")
    date: date
    description: Optional[str] = None
    category: Optional[str] = None
    transaction_type: str  # income | expense
    taxable_amount: float
    tax_type: str  # GST | NONE