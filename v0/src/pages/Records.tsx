import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Button, Select } from "../components/ui"
import { formatCurrency } from "../utils/format"
import { getRecords } from "../services/records"
import type { PeriodType } from "../types"

const periodOptions = [
  { value: "month", label: "This Month" },
  { value: "prev_month", label: "Previous Month" },
  { value: "fy", label: "Financial Year" },
  { value: "ytd", label: "Year to Date" },
  { value: "custom", label: "Custom Range" },
]

export const Records: React.FC = () => {
  const navigate = useNavigate()
  const [records, setRecords] = useState<any[]>([])
  const [period, setPeriod] = useState<PeriodType>("month")

  useEffect(() => {
    getRecords({ period }).then(setRecords)
  }, [period])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Records</h1>

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
            {records.map((r) => (
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

            {records.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-light-muted dark:text-dark-muted"
                >
                  No records found for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
