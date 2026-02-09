import { api } from "./client"
import type { CSVUploadPreview, CSVImportResult } from "../types"

export async function previewCsv(file: File): Promise<CSVUploadPreview> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await api.post("/uploads/csv/preview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return res.data
}

export async function insertCsv(records: any[]): Promise<CSVImportResult> {
  const res = await api.post("/uploads/csv/insert", records)
  return res.data
}
