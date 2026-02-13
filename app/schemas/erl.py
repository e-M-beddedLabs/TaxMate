from pydantic import BaseModel
from typing import List, Optional

class CategoryExpense(BaseModel):
    category: str
    amount: float
    percentage: float

class ERLInsights(BaseModel):
    total_income: float
    total_expenses: float
    net_savings: float
    savings_rate: float  # Percentage
    
    tax_efficiency: float # Percentage of income going to tax
    projected_tax: float

    top_expense_categories: List[CategoryExpense]
    
    monthly_burn_rate: float
    financial_health_score: int # 0-100 score based on rules
