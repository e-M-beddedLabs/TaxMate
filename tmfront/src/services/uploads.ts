import { api } from "./client"
import type { CSVUploadPreview, CSVImportResult } from "../types"

export async function previewCsv(file: File): Promise<CSVUploadPreview> {
  const formData = new FormData()
  formData.append("file", file)

  // Use headers explicitly if needed, but client.ts now handles FormData auto-detection
  return api("/uploads/csv/preview", {
    method: "POST",
    body: formData,
  })
}

export async function insertCsv(records: any[]): Promise<CSVImportResult> {
  return api("/uploads/csv/insert", {
    method: "POST",
    body: JSON.stringify(records),
  })
}

export async function uploadInvoices(files: File[]): Promise<any> {
  const formData = new FormData()
  files.forEach(file => formData.append("files", file))

  // Note: The backend expects multipart/form-data. 
  // Usually fetch/axios sets boundary automatically if we pass FormData.
  // But our client wrapper might need adjustment if it forces JSON. 
  // Let's check api wrapper again. It checks headers...

  // In client.ts:
  /*
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",  <-- This overrides FormData boundary!
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  */
  // We need to unset Content-Type for FormData to work (let browser set it with boundary)

  return api("/uploads/invoice/upload", {
    method: "POST",
    body: formData,
    headers: {
      // "Content-Type": undefined // This might not work in TS types if strict
      // We can pass a special flag or just rely on overriding. 
      // If client.ts spreads options.headers AFTER default, we can set it to undefined?
      // But headers is Record<string, string>.

      // Wait, previewCsv used: "Content-Type": "multipart/form-data".
      // If we manually set multipart/form-data without boundary, it fails.
      // Let's check previewCsv implementation in Step 109.
      /*
         const res = await api.post("/uploads/csv/preview", formData, {
              headers: {
              "Content-Type": "multipart/form-data",
              },
          })
      */
      // If that worked, then client.ts might handle it? 
      // Actually, setting "multipart/form-data" manually usually BREAKS it because boundary is missing.
      // I should probably fix `client.ts` to NOT set Content-Type if body is FormData.
    }
  } as any)
}
