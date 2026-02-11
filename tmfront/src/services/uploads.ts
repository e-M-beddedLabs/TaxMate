import { api } from "./client"
import type { CSVUploadPreview, CSVImportResult } from "../types"

const API_BASE = import.meta.env.VITE_API_URL || "https://taxmate-backend-2uv6.onrender.com"

export async function previewCsv(file: File): Promise<CSVUploadPreview> {
  const formData = new FormData()
  formData.append("file", file)

  const token = localStorage.getItem("token")
  const response = await fetch(`${API_BASE}/uploads/csv/preview`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to preview CSV")
  }

  return response.json()
}

export async function insertCsv(records: any[]): Promise<CSVImportResult> {
  return api("/uploads/csv/insert", {
    method: "POST",
    body: JSON.stringify(records),
  })
}

export interface InvoiceUploadResult {
  total_files: number
  successful: number
  failed: number
  results: Array<{
    filename: string
    status: "success" | "error"
    extracted_text?: string
    parsed_data?: {
      date: string | null
      description: string | null
      amount: number | null
      category: string
    }
    error?: string
  }>
}

export async function uploadInvoices(
  files: File[]
): Promise<InvoiceUploadResult> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append("files", file)
  })

  const token = localStorage.getItem("token")
  const response = await fetch(`${API_BASE}/uploads/invoice/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload invoices")
  }

  return response.json()
}
