from pydantic import BaseModel
from typing import Dict, List


class DashboardSummary(BaseModel):
    total_income: float
    total_expense: float
    estimated_tax: float


class CategoryBreakdown(BaseModel):
    income: Dict[str, float]
    expense: Dict[str, float]


class MonthlyTrendPoint(BaseModel):
    month: str  # YYYY-MM
    income: float
    expense: float
    tax: float


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    categories: CategoryBreakdown
    monthly_trend: List[MonthlyTrendPoint]