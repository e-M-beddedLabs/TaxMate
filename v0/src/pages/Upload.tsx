import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react"
import { Button, Card } from "../components/ui"
import { previewCsv, insertCsv, uploadInvoices } from "../services/uploads"
import { cn } from "../utils/format"
import type { CSVUploadPreview, CSVImportResult } from "../types"

type UploadState = "idle" | "preview" | "importing" | "complete" | "invoice-complete"

export const Upload: React.FC = () => {
  const [state, setState] = useState<UploadState>("idle")
  const [fileName, setFileName] = useState("")
  const [preview, setPreview] = useState<CSVUploadPreview | null>(null)
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null)
  const [invoiceResult, setInvoiceResult] = useState<any | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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
    console.log("File input changed:", e.target.files)
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  const handleFile = async (file: File) => {
    setFileName(file.name)
    setState("idle")

    if (file.type.startsWith("image/")) {
      handleInvoiceUpload(file)
      return
    }

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file or an Invoice Image")
      return
    }

    try {
      const result: any = await previewCsv(file)
      // Normalize response (handle both old and new backend formats)
      const validRows = result.valid_rows || result.records || []
      const errorRows = result.error_rows || result.errors || []

      setPreview({
        valid_rows: validRows,
        error_rows: errorRows,
        total_rows: result.total_rows || (validRows.length + errorRows.length)
      } as CSVUploadPreview)

      setState("preview")
    } catch (err) {
      alert("Failed to preview CSV")
      setState("idle")
    }
  }

  const handleInvoiceUpload = async (file: File) => {
    setState("importing")
    try {
      const result = await uploadInvoices([file])
      setInvoiceResult(result)
      setState("invoice-complete")
    } catch (err) {
      alert("Invoice upload failed")
      setState("idle")
    }
  }

  const handleImport = async () => {
    if (!preview) return

    setState("importing")

    try {
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
      setInvoiceResult(null)
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Upload Records</h1>
          <p className="text-light-muted dark:text-dark-muted">
            Import from CSV or Upload Invoice Images (OCR)
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
                  Drop CSV or Invoice Image here
                </h3>
                <p className="text-sm text-light-muted mb-4">
                  Supports .csv, .jpg, .png, .jpeg
                </p>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                    Select File
                  </Button>
                </div>
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
            <p className="mt-4">Processing...</p>
          </Card>
        )}

        {state === "complete" && importResult && (
          <Card className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-500" />
            <h3 className="text-xl font-bold mt-4">Import Complete</h3>
            <p className="text-light-muted mt-2">
              Imported {importResult.imported_count} records from CSV
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

        {state === "invoice-complete" && invoiceResult && (
          <Card className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-500" />
            <h3 className="text-xl font-bold mt-4">Invoice Processed</h3>
            <p className="text-light-muted mt-2">
              Scanned {invoiceResult.total_files} files.
              Successfully extracted {invoiceResult.successful_parses}.
            </p>
            <p className="text-primary-600 font-medium mt-1">
              Inserted {invoiceResult.inserted_records} records.
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

            {/* Debug/Details view could go here */}
            <div className="mt-8 text-left max-h-60 overflow-y-auto border-t border-light-border dark:border-dark-border pt-4">
              <h4 className="text-sm font-medium mb-2">Details:</h4>
              {invoiceResult.results.map((r: any, i: number) => (
                <div key={i} className="text-xs text-light-muted mb-1">
                  {r.filename}: {r.status} {r.status === 'success' ? `(Amount: ${r.parsed_data.amount})` : `- ${r.message || r.error}`}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    )
  }
