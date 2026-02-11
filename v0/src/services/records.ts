import { api } from "../services/client"
import type { RecordCreate } from "../types"

export async function getRecords(params: {
  period?: string
  start_date?: string
  end_date?: string
}) {
  const query = new URLSearchParams()

  if (params.period) query.append("period", params.period)
  if (params.start_date) query.append("start_date", params.start_date)
  if (params.end_date) query.append("end_date", params.end_date)

  const qs = query.toString()
  return api<any[]>(`/records${qs ? `?${qs}` : ""}`)
}

export async function createRecord(data: RecordCreate) {
  return api("/records", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      source: "manual",
    }),
  })
}
