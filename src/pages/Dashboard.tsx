import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  DollarSign,
  BarChart3,
} from "lucide-react"
import { Card, StatCard, Select } from "../components/ui"
import { formatCurrency, getDateRange } from "../utils/format"
import { getDashboardSummary } from "../services/reports"
import type { PeriodType } from "../types"

const periodOptions = [
  { value: "month", label: "This Month" },
  { value: "prev_month", label: "Previous Month" },
  { value: "fy", label: "Financial Year" },
  { value: "ytd", label: "Year to Date" },
  { value: "custom", label: "Custom Range" },
]

const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d)

export const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>("month")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

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

      const data = await getDashboardSummary(params)
      setSummary(data)
      setLoading(false)
    }

    if (
      period !== "custom" ||
      (isValidDate(customStart) && isValidDate(customEnd))
    ) {
      load()
    }
  }, [period, customStart, customEnd])

  if (loading || !summary) {
    return <div className="p-6">Loading dashboard…</div>
  }

  const dateRange =
    period === "custom" && isValidDate(customStart) && isValidDate(customEnd)
      ? { start: customStart, end: customEnd }
      : getDateRange(period)

  const netIncome = summary.total_income - summary.total_expense

  return (
    <motion.div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-light-muted dark:text-dark-muted">
            Overview of your financial activity
          </p>
        </div>

        {/* 🔒 FIXED SELECT */}
        <div className="w-full sm:w-48 shrink-0">
          <Select
            options={periodOptions}
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodType)}
            className="h-11 leading-[44px]"
          />
        </div>
      </div>

      {/* Custom Range */}
      {period === "custom" && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label">Start Date</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => {
                setCustomStart(e.target.value)
                setCustomEnd("")
              }}
              className="input h-11"
            />
          </div>

          <div className="flex-1">
            <label className="label">End Date</label>
            <input
              type="date"
              value={customEnd}
              min={customStart || undefined}
              disabled={!customStart}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="input h-11"
            />
          </div>
        </div>
      )}

      <p className="text-sm text-light-muted dark:text-dark-muted">
        Showing data from <b>{dateRange.start}</b> to <b>{dateRange.end}</b>
      </p>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.total_income)}
          icon={<TrendingUp size={22} />}
          color="success"
        />
        <StatCard
          title="Total Expense"
          value={formatCurrency(summary.total_expense)}
          icon={<TrendingDown size={22} />}
          color="danger"
        />
        <StatCard
          title="Estimated Tax"
          value={formatCurrency(summary.estimated_tax)}
          icon={<Calculator size={22} />}
          color="secondary"
        />
        <StatCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          icon={<DollarSign size={22} />}
          color="primary"
        />
      </div>

      <Card>
        <div className="h-64 flex items-center justify-center border rounded-xl">
          <div className="text-center">
            <BarChart3 size={48} className="opacity-40 mx-auto mb-2" />
            <p className="text-sm text-light-muted">Charts coming next</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
