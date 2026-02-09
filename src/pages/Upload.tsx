import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Upload as UploadIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react"
import { Button, Card } from "../components/ui"
import { previewCsv, insertCsv } from "../services/uploads"
import { formatCurrency, cn } from "../utils/format"
import type { CSVUploadPreview, CSVImportResult } from "../types"

type UploadState = "idle" | "preview" | "importing" | "complete"

export const Upload: React.FC = () => {
  const [state, setState] = useState<UploadState>("idle")
  const [fileName, setFileName] = useState("")
  const [preview, setPreview] = useState<CSVUploadPreview | null>(null)
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    setFileName(file.name)
    setState("idle")

    try {
      const result = await previewCsv(file)
      setPreview(result)
      setState("preview")
    } catch (err) {
      alert("Failed to preview CSV")
      setState("idle")
    }
  }

  const handleImport = async () => {
    if (!preview) return

    setState("importing")

    try {
      const result = await insertCsv(preview.valid_rows)
      setImportResult(result)
      setState("complete")
    } catch (err) {
      alert("CSV import failed")
      setState("preview")
    }
  }

  const handleReset = () => {
    setState("idle")
    setFileName("")
    setPreview(null)
    setImportResult(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload CSV</h1>
        <p className="text-light-muted dark:text-dark-muted">
          Bulk import records from a CSV file
        </p>
      </div>

      {state === "idle" && (
        <Card>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 transition-colors",
              dragActive
                ? "border-primary-500 bg-primary-500/5"
                : "border-light-border dark:border-dark-border"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                <UploadIcon size={32} />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Drop your CSV file here
              </h3>
              <p className="text-sm text-light-muted mb-4">
                or click to browse
              </p>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button variant="primary">Select File</Button>
              </label>
            </div>
          </div>
        </Card>
      )}

      {state === "preview" && preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} />
              <div>
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-light-muted">
                  {preview.total_rows} rows found
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleReset}>
              <X size={18} />
            </Button>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <p className="text-2xl font-bold text-green-500">
                {preview.valid_rows.length}
              </p>
              <p className="text-sm text-light-muted">Valid rows</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-red-500">
                {preview.error_rows.length}
              </p>
              <p className="text-sm text-light-muted">Error rows</p>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={preview.valid_rows.length === 0}
              className="flex-1"
            >
              Import {preview.valid_rows.length} Records
            </Button>
          </div>
        </motion.div>
      )}

      {state === "importing" && (
        <Card className="text-center py-12">
          <Loader2 size={48} className="mx-auto animate-spin" />
          <p className="mt-4">Importing records…</p>
        </Card>
      )}

      {state === "complete" && importResult && (
        <Card className="text-center py-12">
          <CheckCircle size={48} className="mx-auto text-green-500" />
          <h3 className="text-xl font-bold mt-4">Import Complete</h3>
          <p className="text-light-muted mt-2">
            Imported {importResult.imported_count} records
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={handleReset}>
              Upload Another
            </Button>
            <Button
              variant="primary"
              onClick={() => (location.href = "/records")}
            >
              View Records
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
