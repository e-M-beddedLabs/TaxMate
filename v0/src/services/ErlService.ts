import { api } from "./client"

export interface CategoryExpense {
    category: str
    amount: number
    percentage: number
}

export interface ERLInsights {
    total_income: number
    total_expenses: number
    net_savings: number
    savings_rate: number
    tax_efficiency: number
    projected_tax: number
    top_expense_categories: CategoryExpense[]
    monthly_burn_rate: number
    financial_health_score: number
}

export const getErlInsights = async (): Promise<ERLInsights> => {
    const response = await api.get<ERLInsights>("/erl/insights")
    return response.data
}
