import { api } from "../services/client"

export interface ReportSummary {
  total_income: number
  total_expense: number
  estimated_tax: number
}

export async function getDashboardSummary(params: {
  period?: string
  start_date?: string
  end_date?: string
}): Promise<ReportSummary> {
  const query = new URLSearchParams()

  if (params.period) query.append("period", params.period)
  if (params.start_date) query.append("start_date", params.start_date)
  if (params.end_date) query.append("end_date", params.end_date)

  const qs = query.toString()
  return api(`/reports/summary${qs ? `?${qs}` : ""}`)
}
