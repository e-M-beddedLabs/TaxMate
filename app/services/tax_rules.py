from typing import Tuple


# ---------- GST RULES (v0) ----------
GST_RATE = 0.18


def compute_gst(taxable_amount: float) -> float:
    return round(taxable_amount * GST_RATE, 2)


# ---------- INCOME TAX SLABS (India – v0 simplified) ----------
# Assumption: Old regime, individual, no deductions

INCOME_TAX_SLABS = [
    (250000, 0.0),
    (500000, 0.05),
    (1000000, 0.20),
    (float("inf"), 0.30),
]


def compute_income_tax(total_income: float) -> float:
    tax = 0.0
    previous_limit = 0.0

    for limit, rate in INCOME_TAX_SLABS:
        if total_income <= previous_limit:
            break

        taxable = min(total_income, limit) - previous_limit
        tax += taxable * rate
        previous_limit = limit

    return round(tax, 2)