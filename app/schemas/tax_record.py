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
    tax_type: str  # GST | NONE


    @validator("transaction_type")
    def validate_transaction_type(cls, v):
        if v not in {"income", "expense"}:
            raise ValueError("transaction_type must be income or expense")
        return v


    @validator("tax_type")
    def validate_tax_type(cls, v):
        if v not in {"GST", "NONE"}:
            raise ValueError("tax_type must be GST or NONE")
        return v


    @validator("taxable_amount")
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("taxable_amount must be > 0")
        return v


    @validator("date")
    def validate_date(cls, v):
        if v > date.today():
            raise ValueError("date cannot be in the future")
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