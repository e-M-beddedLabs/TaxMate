from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.tax_record import TaxRecord
from app.schemas.erl import ERLInsights, CategoryExpense
from typing import List
import time

# Simple in-memory cache: {user_id: (timestamp, data)}
_erl_cache = {}
CACHE_TTL = 300  # 5 minutes

def calculate_economic_metrics(db: Session, user_id: int) -> ERLInsights:
    # Check cache
    if user_id in _erl_cache:
        timestamp, data = _erl_cache[user_id]
        if time.time() - timestamp < CACHE_TTL:
            return data

    # 1. Fetch all records for the user
    records = db.query(TaxRecord).filter(TaxRecord.user_id == user_id).all()
    
    total_income = 0.0
    total_expenses = 0.0
    total_tax = 0.0
    category_map = {}

    for r in records:
        if r.transaction_type == "income":
            total_income += r.taxable_amount
        elif r.transaction_type == "expense":
            total_expenses += r.taxable_amount
            
            # Category tracking
            cat = r.category or "Uncategorized"
            category_map[cat] = category_map.get(cat, 0.0) + r.taxable_amount
            
        # Tax is tracked separately usually, but let's assume tax_amount is populated
        total_tax += r.tax_amount

    # 2. Derived metrics
    net_savings = total_income - total_expenses - total_tax
    
    savings_rate = 0.0
    if total_income > 0:
        savings_rate = (net_savings / total_income) * 100

    tax_efficiency = 0.0
    if total_income > 0:
        tax_efficiency = (total_tax / total_income) * 100
        
    # 3. Top Expenses
    sorted_cats = sorted(category_map.items(), key=lambda x: x[1], reverse=True)
    top_categories = []
    for cat, amount in sorted_cats[:5]: # Top 5
        percentage = 0.0
        if total_expenses > 0:
            percentage = (amount / total_expenses) * 100
        top_categories.append(CategoryExpense(category=cat, amount=amount, percentage=percentage))

    # 4. Burn Rate (Monthly Average)
    # Simple approximation: total expenses / distinct months
    # For now, let's just use total / 12 if we have data spanning a year, or just average per record month?
    # Better: Count distinct YYYY-MM
    months = set()
    for r in records:
        months.add(r.date.strftime("%Y-%m"))
    
    num_months = len(months) if months else 1
    monthly_burn_rate = total_expenses / num_months

    # 5. Financial Health Score (Rule-based)
    # Rules: 
    # - Savings rate > 20% -> +40
    # - Tax efficiency < 30% -> +20
    # - Burn rate < Income/month -> +40
    score = 0
    if savings_rate > 20:
        score += 40
    elif savings_rate > 10:
        score += 20
        
    if tax_efficiency < 30: # Assuming lower tax is better for user efficiency (legal minimization)
        score += 20
        
    avg_income = total_income / num_months
    if monthly_burn_rate < avg_income:
        score += 40
    elif monthly_burn_rate < avg_income * 1.1: # Slightly over
        score += 10

    insights = ERLInsights(
        total_income=total_income,
        total_expenses=total_expenses,
        net_savings=net_savings,
        savings_rate=round(savings_rate, 2),
        tax_efficiency=round(tax_efficiency, 2),
        projected_tax=total_tax, # Simple projection based on actuals
        top_expense_categories=top_categories,
        monthly_burn_rate=round(monthly_burn_rate, 2),
        financial_health_score=min(100, max(0, score))
    )
    
    # Update cache
    _erl_cache[user_id] = (time.time(), insights)
    return insights
