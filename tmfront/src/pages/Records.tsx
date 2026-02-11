import React, { useEffect, useState, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, Button, Select } from "../components/ui"
import { formatCurrency } from "../utils/format"
import { getRecords } from "../services/records"
import type { PeriodType } from "../types"
import { X } from "lucide-react"

const periodOptions = [
  { value: "month", label: "This Month" },
  { value: "prev_month", label: "Previous Month" },
  { value: "fy", label: "Financial Year" },
  { value: "ytd", label: "Year to Date" },
  { value: "custom", label: "Custom Range" },
]

const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d)

export const Records: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const [records, setRecords] = useState<any[]>([])
  const [period, setPeriod] = useState<PeriodType>("month")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  useEffect(() => {
    let params: any = { period }

    if (
      period === "custom" &&
      isValidDate(customStart) &&
      isValidDate(customEnd)
    ) {
      params = {
        period,
        start_date: customStart,
        end_date: customEnd,
      }
    }

    getRecords(params).then(setRecords)
  }, [period, customStart, customEnd])

  // Filter records based on search query
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records

    const query = searchQuery.toLowerCase()
    return records.filter((r) => {
      return (
        r.description?.toLowerCase().includes(query) ||
        r.category?.toLowerCase().includes(query) ||
        r.transaction_type?.toLowerCase().includes(query) ||
        r.total_amount?.toString().includes(query) ||
        r.taxable_amount?.toString().includes(query)
      )
    })
  }, [records, searchQuery])

  const clearSearch = () => {
    setSearchParams({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Records</h1>
          {searchQuery && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-light-muted dark:text-dark-muted">
                Search results for: <span className="font-medium text-light-text dark:text-dark-text">"{searchQuery}"</span>
              </span>
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-light-bg dark:bg-dark-bg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                <X size={12} />
                Clear
              </button>
            </div>
          )}
        </div>


        <div className="flex items-center gap-3">
          {/* Period select (locked sizing + alignment) */}
          <div className="w-48">
            <Select
              options={periodOptions}
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodType)}
              className="h-11 leading-none flex items-center"
            />
          </div>

          {/* Custom date range inputs */}
          {period === "custom" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="input h-11 px-3 text-sm"
                placeholder="Start date"
              />
              <span className="text-light-muted dark:text-dark-muted">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="input h-11 px-3 text-sm"
                placeholder="End date"
              />
            </div>
          )}

          {/* Add Record button (working navigation) */}
          <Button
            variant="primary"
            className="h-11 px-5"
            onClick={() => navigate("/records/add")}
          >
            Add Record
          </Button>
        </div>
      </div>

      {/* Records table */}
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-light-bg dark:bg-dark-bg">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r) => (
              <tr
                key={r.id}
                className="border-t border-light-border dark:border-dark-border"
              >
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.description}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.transaction_type === "income"
                        ? "px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600"
                        : "px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-600"
                    }
                  >
                    {r.transaction_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(r.total_amount)}
                </td>
              </tr>
            ))}

            {filteredRecords.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-light-muted dark:text-dark-muted"
                >
                  {searchQuery
                    ? `No records found matching "${searchQuery}"`
                    : "No records found for this period"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
