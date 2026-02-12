import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button, Input, Select, Card } from "../components/ui"
import { createRecord } from "../services/records"
import { formatCurrency } from "../utils/format"
import type { RecordCreate } from "../types"

const taxTypeOptions = [
  { value: "GST_5", label: "GST (5%)" },
  { value: "GST_12", label: "GST (12%)" },
  { value: "GST_18", label: "GST (18%)" },
  { value: "GST_28", label: "GST (28%)" },
  { value: "NONE", label: "Exempt (0%)" },
  { value: "CUSTOM", label: "Custom Rate" },
]

const transactionTypeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
]

const categoryOptions = [
  { value: "Sales", label: "Sales" },
  { value: "Services", label: "Services" },
  { value: "Office", label: "Office" },
  { value: "Travel", label: "Travel" },
  { value: "Misc", label: "Misc" },
]

export const AddRecord: React.FC = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<RecordCreate>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "Sales",
    transaction_type: "income",
    taxable_amount: 0,
    tax_type: "GST", // Default generic type
    tax_rate: 18,    // Default rate
  })

  // Local state for UI selection
  const [selectedTaxOption, setSelectedTaxOption] = useState("GST_18")
  const [customRate, setCustomRate] = useState<string>("")

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Calculate tax amount for preview
  const taxAmount = React.useMemo(() => {
    let rate = 0
    if (selectedTaxOption === "CUSTOM") {
      rate = Number(customRate) || 0
    } else if (selectedTaxOption.startsWith("GST_")) {
      rate = Number(selectedTaxOption.split("_")[1])
    }
    // "NONE" means 0
    return Math.round(form.taxable_amount * (rate / 100))
  }, [selectedTaxOption, customRate, form.taxable_amount])


  const totalAmount = form.taxable_amount + taxAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.description.trim()) {
      setError("Description is required")
      return
    }

    if (form.taxable_amount <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    // Determine final tax rate and type
    let finalRate = 0
    let finalType = "GST" // Default classification

    if (selectedTaxOption === "NONE") {
      finalRate = 0
      finalType = "NONE"
    } else if (selectedTaxOption === "CUSTOM") {
      finalRate = Number(customRate) || 0
      finalType = "GST" // Treat custom as GST/Tax for now
    } else {
      // GST_5, GST_12 etc
      finalRate = Number(selectedTaxOption.split("_")[1])
      finalType = "GST"
    }

    setIsLoading(true)

    try {
      await createRecord({
        ...form,
        tax_type: finalType as any,
        tax_rate: finalRate,
      })
      setSuccess(true)
      setTimeout(() => navigate("/records"), 1200)
    } catch (err: any) {
      setError(err?.message || "Failed to add record")
    } finally {
      setIsLoading(false)
    }
  }


  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Record Added</h2>
          <p className="text-light-muted">Redirecting to records…</p>
        </motion.div>
      </div>
    )
  }


  return (
    <div className="max-w-2xl mx-auto">
      {/* ... (Header remains same) */}
      <div className="mb-6">
        <Link to="/records" className="inline-flex items-center gap-2 mb-4">
          <ArrowLeft size={18} />
          Back to records
        </Link>
        <h1 className="text-2xl font-bold">Add Record</h1>
        <p className="text-light-muted">Manually add an income or expense</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (Error display remains same) */}
          {error && (
            <div className="p-3 rounded bg-red-500/10 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input"
                required
              />
            </div>

            <Select
              label="Transaction Type"
              options={transactionTypeOptions}
              value={form.transaction_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  transaction_type: e.target.value as "income" | "expense",
                })
              }
            />
          </div>

          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Taxable Amount"
              type="number"
              min={0}
              value={form.taxable_amount || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  taxable_amount: Number(e.target.value) || 0,
                })
              }
              required
            />

            <div className="space-y-2">
              <Select
                label="Tax Slab"
                options={taxTypeOptions}
                value={selectedTaxOption}
                onChange={(e) => setSelectedTaxOption(e.target.value)}
              />
              {selectedTaxOption === "CUSTOM" && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <Input
                    label=""
                    placeholder="Rate %"
                    type="number"
                    min="0"
                    max="100"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="h-10"
                  />
                  <span className="text-sm font-medium pt-2">%</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border">
            <div className="flex justify-between text-sm">
              <span>Taxable</span>
              <span>{formatCurrency(form.taxable_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/records")}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex-1"
            >
              Add Record
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
