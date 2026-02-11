import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Button, Card, Select } from "../components/ui"
import { getDashboardSummary } from "../services/reports"
import { formatCurrency, formatDate, getDateRange } from "../utils/format"

const periodOptions = [
  { value: "month", label: "This Month" },
  { value: "prev_month", label: "Previous Month" },
  { value: "fy", label: "Financial Year" },
  { value: "ytd", label: "Year to Date" },
  { value: "custom", label: "Custom Range" },
]

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState("month")
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setPeriod(value)
    setShowCustomRange(value === "custom")
  }

  useEffect(() => {
    async function load() {
      setLoading(true)

      const params =
        period === "custom" && customStart && customEnd
          ? { start_date: customStart, end_date: customEnd }
          : { period }

      const data = await getDashboardSummary(params)
      setSummary(data)
      setLoading(false)
    }

    if (period !== "custom" || (customStart && customEnd)) {
      load()
    }
  }, [period, customStart, customEnd])

  if (loading || !summary) {
    return <div className="p-6">Loading reports…</div>
  }

  const dateRange =
    period === "custom"
      ? { start: customStart, end: customEnd }
      : getDateRange(period)

  const net = summary.total_income - summary.total_expense

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-light-muted">Financial summaries</p>
        </div>

        <Select
          options={periodOptions}
          value={period}
          onChange={handlePeriodChange}
          className="w-48"
        />
      </div>

      {showCustomRange && (
        <div className="flex gap-4">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={customEnd}
            min={customStart}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="input"
          />
        </div>
      )}

      <Card className="flex items-center gap-3">
        <Calendar size={18} />
        <span className="text-sm">
          {formatDate(dateRange.start)} – {formatDate(dateRange.end)}
        </span>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <TrendingUp />
          <p>Total Income</p>
          <p className="text-xl font-bold text-green-500">
            {formatCurrency(summary.total_income)}
          </p>
        </Card>

        <Card>
          <TrendingDown />
          <p>Total Expense</p>
          <p className="text-xl font-bold text-red-500">
            {formatCurrency(summary.total_expense)}
          </p>
        </Card>

        <Card>
          <DollarSign />
          <p>Net Amount</p>
          <p className="text-xl font-bold">{formatCurrency(net)}</p>
        </Card>

        <Card>
          <p>Estimated Tax</p>
          <p className="text-xl font-bold text-amber-500">
            {formatCurrency(summary.estimated_tax)}
          </p>
        </Card>
      </div>

      <Card className="text-center">
        <Button variant="secondary" disabled>
          Export (Coming Soon)
        </Button>
      </Card>
    </div>
  )
}
