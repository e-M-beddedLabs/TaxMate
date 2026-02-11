import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Image as ImageIcon,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react"
import { Button, Card, Select } from "../components/ui"
import { previewCsv, insertCsv, uploadInvoices } from "../services/uploads"
import { cn } from "../utils/format"
import type { CSVUploadPreview, InvoiceUploadResult } from "../types"

type UploadType = "csv" | "invoice"
type UploadState = "idle" | "preview" | "uploading" | "complete"

export const Upload: React.FC = () => {
  const [uploadType, setUploadType] = useState<UploadType>("csv")
  const [state, setState] = useState<UploadState>("idle")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // CSV state
  const [csvPreview, setCsvPreview] = useState<CSVUploadPreview | null>(null)
  const [csvFileName, setCsvFileName] = useState("")

  // Invoice state
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([])
  const [invoiceResult, setInvoiceResult] = useState<InvoiceUploadResult | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (uploadType === "csv") {
      if (files[0]) handleCsvFile(files[0])
    } else {
      handleInvoiceFiles(files)
    }
  }, [uploadType])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (uploadType === "csv") {
      if (files[0]) handleCsvFile(files[0])
    } else {
      handleInvoiceFiles(files)
    }
  }

  const handleCsvFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    setCsvFileName(file.name)
    setState("uploading")

    try {
      const result = await previewCsv(file)
      setCsvPreview(result)
      setState("preview")
    } catch (err) {
      alert("Failed to preview CSV")
      setState("idle")
    }
  }

  const handleInvoiceFiles = (files: File[]) => {
    const imageFiles = files.filter((f) =>
      f.type.startsWith("image/")
    )

    if (imageFiles.length === 0) {
      alert("Please upload image files")
      return
    }

    setInvoiceFiles(imageFiles)
    setState("preview")
  }

  const handleCsvImport = async () => {
    if (!csvPreview) return

    setState("uploading")

    try {
      await insertCsv(csvPreview.valid_rows)
      setState("complete")
    } catch (err) {
      alert("CSV import failed")
      setState("preview")
    }
  }

  const handleInvoiceUpload = async () => {
    setState("uploading")

    try {
      const result = await uploadInvoices(invoiceFiles)
      setInvoiceResult(result)
      setState("complete")
    } catch (err) {
      alert("Invoice upload failed")
      setState("preview")
    }
  }

  const handleReset = () => {
    setState("idle")
    setCsvFileName("")
    setCsvPreview(null)
    setInvoiceFiles([])
    setInvoiceResult(null)
  }

  const accept = uploadType === "csv" ? ".csv" : "image/*"
  const multiple = uploadType === "invoice"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Records</h1>
        <p className="text-light-muted dark:text-dark-muted">
          Import records from CSV files or invoice images
        </p>
      </div>

      {state === "idle" && (
        <>
          <Card>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Upload Type</span>
                <Select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as UploadType)}
                  options={[
                    { value: "csv", label: "CSV File" },
                    { value: "invoice", label: "Invoice Images" },
                  ]}
                  className="mt-1"
                />
              </label>
            </div>
          </Card>

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
                  {uploadType === "csv" ? (
                    <FileText size={32} />
                  ) : (
                    <ImageIcon size={32} />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Drop your {uploadType === "csv" ? "CSV file" : "images"} here
                </h3>
                <p className="text-sm text-light-muted mb-4">
                  or click to browse
                  {uploadType === "invoice" && " (multiple files supported)"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File{multiple && "s"}
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* CSV Preview */}
      {state === "preview" && uploadType === "csv" && csvPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} />
              <div>
                <p className="font-medium">{csvFileName}</p>
                <p className="text-sm text-light-muted">
                  {csvPreview.total_rows} rows found
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
                {csvPreview.valid_rows.length}
              </p>
              <p className="text-sm text-light-muted">Valid rows</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-red-500">
                {csvPreview.error_rows.length}
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
              onClick={handleCsvImport}
              disabled={csvPreview.valid_rows.length === 0}
              className="flex-1"
            >
              Import {csvPreview.valid_rows.length} Records
            </Button>
          </div>
        </motion.div>
      )}

      {/* Invoice Preview */}
      {state === "preview" && uploadType === "invoice" && invoiceFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{invoiceFiles.length} files selected</p>
                <p className="text-sm text-light-muted">Ready to process with OCR</p>
              </div>
              <Button variant="ghost" onClick={handleReset}>
                <X size={18} />
              </Button>
            </div>
          </Card>

          <div className="space-y-2">
            {invoiceFiles.map((file, idx) => (
              <Card key={idx} className="flex items-center gap-3">
                <ImageIcon size={18} />
                <span className="text-sm">{file.name}</span>
              </Card>
            ))}
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
              onClick={handleInvoiceUpload}
              className="flex-1"
            >
              Process {invoiceFiles.length} Invoice{invoiceFiles.length > 1 ? "s" : ""}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Uploading State */}
      {state === "uploading" && (
        <Card className="text-center py-12">
          <Loader2 size={48} className="mx-auto animate-spin" />
          <p className="mt-4">
            {uploadType === "csv" ? "Importing records…" : "Processing invoices…"}
          </p>
        </Card>
      )}

      {/* Complete State */}
      {state === "complete" && (
        <Card className="text-center py-12">
          <CheckCircle size={48} className="mx-auto text-green-500" />
          <h3 className="text-xl font-bold mt-4">Upload Complete</h3>

          {uploadType === "csv" && (
            <p className="text-light-muted mt-2">
              Successfully imported records from CSV
            </p>
          )}

          {uploadType === "invoice" && invoiceResult && (
            <div className="mt-4">
              <p className="text-light-muted">
                Processed {invoiceResult.total_files} files
              </p>
              <div className="flex justify-center gap-6 mt-2">
                <span className="text-green-500">
                  {invoiceResult.successful} successful
                </span>
                {invoiceResult.failed > 0 && (
                  <span className="text-red-500">
                    {invoiceResult.failed} failed
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={handleReset}>
              Upload More
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
