import React, { useEffect, useState } from "react"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    Activity
} from "lucide-react"
import { Card } from "../components/ui"
import { getErlInsights, type ERLInsights } from "../services/ErlService"
import { formatCurrency, cn } from "../utils/format"

export const ERL: React.FC = () => {
    const [insights, setInsights] = useState<ERLInsights | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        loadInsights()
    }, [])

    const loadInsights = async () => {
        try {
            setLoading(true)
            const data = await getErlInsights()
            setInsights(data)
        } catch (err) {
            setError("Failed to load economic insights")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Loading insights...</div>
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>
    if (!insights) return null

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                    Economic Reality Layer
                </h1>
                <p className="text-light-muted dark:text-dark-muted mt-2">
                    Advanced financial metrics and rule-based analysis of your tax records.
                </p>
            </div>

            {/* Health Score Card */}
            <Card className="bg-gradient-to-br from-primary-500/10 to-primary-700/5 border-primary-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <Activity className="text-primary-500" />
                            Financial Health Score
                        </h2>
                        <p className="text-sm text-light-muted dark:text-dark-muted max-w-md">
                            Derived from your savings rate, tax efficiency, and monthly burn vs income.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className={cn(
                            "text-5xl font-bold mb-1",
                            insights.financial_health_score >= 80 ? "text-green-500" :
                                insights.financial_health_score >= 50 ? "text-yellow-500" : "text-red-500"
                        )}>
                            {insights.financial_health_score}
                        </div>
                        <div className="text-xs uppercase tracking-wider font-medium text-light-muted">
                            / 100 Points
                        </div>
                    </div>
                </div>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Income"
                    value={formatCurrency(insights.total_income)}
                    icon={DollarSign}
                    trend="up"
                    color="text-green-500"
                />
                <MetricCard
                    title="Total Expenses"
                    value={formatCurrency(insights.total_expenses)}
                    icon={TrendingDown}
                    trend="down"
                    color="text-red-500"
                />
                <MetricCard
                    title="Net Savings"
                    value={formatCurrency(insights.net_savings)}
                    icon={TrendingUp}
                    trend={insights.net_savings > 0 ? "up" : "down"}
                    color={insights.net_savings > 0 ? "text-green-500" : "text-red-500"}
                />
                <MetricCard
                    title="Savings Rate"
                    value={`${insights.savings_rate}%`}
                    icon={PieChart}
                    trend="neutral"
                    color="text-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tax Efficiency */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Tax Efficiency</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                            <span className="text-light-muted">Tax Efficiency Rate</span>
                            <span className="font-mono font-bold">{insights.tax_efficiency}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                            <span className="text-light-muted">Projected Tax Liability</span>
                            <span className="font-mono font-bold text-red-500">
                                {formatCurrency(insights.projected_tax)}
                            </span>
                        </div>
                        <p className="text-xs text-light-muted mt-2">
                            * Lower tax efficiency percentage means you are paying less tax relative to your income.
                        </p>
                    </div>
                </Card>

                {/* Burn Rate */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Monthly Burn Rate</h3>
                    <div className="flex items-center justify-center h-full pb-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">
                                {formatCurrency(insights.monthly_burn_rate)}
                            </div>
                            <p className="text-sm text-light-muted">Average Monthly Spend</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Top Expenses */}
            <Card>
                <h3 className="text-lg font-semibold mb-6">Top Expense Categories</h3>
                <div className="space-y-4">
                    {insights.top_expense_categories.map((cat, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{cat.category}</span>
                                <span className="text-light-muted">
                                    {formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="h-2 w-full bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 rounded-full"
                                    style={{ width: `${cat.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {insights.top_expense_categories.length === 0 && (
                        <div className="text-center text-light-muted py-8">
                            No expense data available
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

const MetricCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-light-bg dark:bg-dark-bg">
                <Icon size={20} className="text-light-muted" />
            </div>
            {/* Trend indicator placeholder */}
        </div>
        <div className="mt-2">
            <p className="text-sm text-light-muted dark:text-dark-muted">{title}</p>
            <h3 className={cn("text-2xl font-bold mt-1", color)}>{value}</h3>
        </div>
    </Card>
)
