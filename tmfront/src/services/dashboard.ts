import { api } from "../services/client"

export interface DashboardData {
  summary: {
    total_income: number
    total_expense: number
    estimated_tax: number
  }
  categories: {
    income: Record<string, number>
    expense: Record<string, number>
  }
  monthly_trend: Array<{
    month: string
    income: number
    expense: number
    tax: number
  }>
}

export async function getDashboardData(params?: {
  start_date?: string
  end_date?: string
}) {
  const query = new URLSearchParams()
  if (params?.start_date) query.append("start_date", params.start_date)
  if (params?.end_date) query.append("end_date", params.end_date)

  const qs = query.toString()
  return api<DashboardData>(`/dashboard/${qs ? `?${qs}` : ""}`)
}
