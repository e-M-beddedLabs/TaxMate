import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  DollarSign,
  BarChart3,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, StatCard, Select } from "../components/ui"
import { formatCurrency, getDateRange } from "../utils/format"
import { getDashboardSummary } from "../services/reports"
import { getDashboardData } from "../services/dashboard"
import type { PeriodType } from "../types"

const periodOptions = [
  { value: "month", label: "This Month" },
  { value: "prev_month", label: "Previous Month" },
  { value: "fy", label: "Financial Year" },
  { value: "ytd", label: "Year to Date" },
  { value: "custom", label: "Custom Range" },
]

const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card p-3 border rounded shadow-lg text-sm">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize">{entry.name}:</span>
            <span className="font-mono font-medium">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>("month")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [summary, setSummary] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
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

      // Parallel fetch: Summary (filtered) AND Chart Data (filtered)
      try {
        const [summaryData, dashboardData] = await Promise.all([
          getDashboardSummary(params),
          getDashboardData(params.period === "custom" ? {
            start_date: params.start_date,
            end_date: params.end_date
          } : undefined),
          // Note: Logic for other periods (month, fy) handling? 
          // If period is 'month', user might want daily breakdown, but getDashboardData returns monthly trend.
          // For now, let's just support custom range filtering as requested. 
          // If 'month' is selected, we might want to show previous months too for context?
          // The user request was specific to "custom range".
        ])

        setSummary(summaryData)
        setChartData(dashboardData.monthly_trend)
      } catch (e) {
        console.error("Failed to load dashboard data", e)
      } finally {
        setLoading(false)
      }
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={20} className="text-primary-500" />
            Monthly Trends
          </h3>
        </div>

        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Legend iconType="circle" />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="tax"
                  name="Tax"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-light-muted">
              No data available for chart
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
