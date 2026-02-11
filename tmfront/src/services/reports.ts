import { api } from "../services/client"

const API_BASE = import.meta.env.VITE_API_URL || "https://taxmate-backend-2uv6.onrender.com"

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

export async function exportReportCSV(params: {
  period?: string
  start_date?: string
  end_date?: string
}): Promise<void> {
  const query = new URLSearchParams()

  if (params.period) query.append("period", params.period)
  if (params.start_date) query.append("start_date", params.start_date)
  if (params.end_date) query.append("end_date", params.end_date)

  const qs = query.toString()
  const url = `/reports/export${qs ? `?${qs}` : ""}`

  // Fetch the CSV file
  const token = localStorage.getItem("token")
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to export report")
  }

  // Create a blob and trigger download
  const blob = await response.blob()
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = downloadUrl

  // Extract filename from Content-Disposition header or use default
  const contentDisposition = response.headers.get("Content-Disposition")
  const filename = contentDisposition
    ? contentDisposition.split("filename=")[1].replace(/"/g, "")
    : "financial_report.csv"

  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}
