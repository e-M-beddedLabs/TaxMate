from datetime import date
from pydantic import BaseModel, validator
from typing import Optional


class TaxRecordBase(BaseModel):
    source: str
    date: date
    description: str
    category: str
    transaction_type: str  # income | expense

    taxable_amount: float

    # ✅ NEW (primary)
    tax_rate: Optional[float] = None   # percentage, e.g. 5, 12, 18

    # ⚠️ legacy (kept for backward compatibility)
    tax_type: Optional[str] = None    # GST | NONE (deprecated)

    @validator("transaction_type")
    def validate_transaction_type(cls, v):
        if v not in {"income", "expense"}:
            raise ValueError("transaction_type must be income or expense")
        return v

    @validator("tax_rate")
    def validate_tax_rate(cls, v):
        if v is None:
            return 0.0
        if v < 0 or v > 100:
            raise ValueError("tax_rate must be between 0 and 100")
        return v

    @validator("taxable_amount")
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("taxable_amount must be > 0")
        return v




class TaxRecordCreate(TaxRecordBase):
    pass


class TaxRecordResponse(TaxRecordBase):
    id: int
    tax_amount: float
    total_amount: float
    confidence_score: float

    class Config:
        orm_mode = True