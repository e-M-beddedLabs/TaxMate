import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Save, X } from "lucide-react"
import { Button, Input, Select, Card } from "../components/ui"
import Navbar from "../components/ui/Navbar"
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
    tax_type: "GST",
    tax_rate: 18,
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

    let finalRate = 0
    let finalType = "GST"

    if (selectedTaxOption === "NONE") {
      finalRate = 0
      finalType = "NONE"
    } else if (selectedTaxOption === "CUSTOM") {
      finalRate = Number(customRate) || 0
      finalType = "GST"
    } else {
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
      setTimeout(() => navigate("/records"), 1500)
    } catch (err: any) {
      setError(err?.message || "Failed to add record")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
            <CheckCircle className="text-emerald-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-text-primary">Record Added</h2>
          <p className="text-text-secondary">Redirecting to records...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-highlight/30">
      <Navbar />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto pt-32 pb-20 px-4 sm:px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/records" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-2 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to records
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Add New Record
            </h1>
          </div>
        </div>

        <Card className="p-1 border-white/5 bg-white/[0.01]">
          <div className="bg-[#0A0A0A]/50 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-white/5">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />

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
                placeholder="e.g. Website Design Project"
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

              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Taxable Amount"
                  type="number"
                  min={0}
                  placeholder="0.00"
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
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 pt-2">
                      <Input
                        label="Rate %"
                        type="number"
                        min="0"
                        max="100"
                        value={customRate}
                        onChange={(e) => setCustomRate(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Live Calculaton Card */}
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Taxable Amount</span>
                  <span>{formatCurrency(form.taxable_amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Tax ({form.transaction_type === 'income' ? 'GST Collected' : 'GST Paid'})</span>
                  <span className="text-highlight">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between font-bold text-lg text-text-primary">
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/records")}
                  className="flex-1"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="flex-[2]"
                >
                  <Save size={18} className="mr-2" />
                  Save Record
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
