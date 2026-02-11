import React from "react"
import { motion } from "framer-motion"

interface DateRange {
  start_date: string
  end_date: string
}

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (range: DateRange) => void
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <div className="flex-1">
        <label className="label">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            const newStart = e.target.value
            onChange({
              start_date: newStart,
              end_date: "", // force reselect end date
            })
          }}
          className="input"
        />
      </div>

      <div className="flex-1">
        <label className="label">End Date</label>
        <input
          type="date"
          value={endDate}
          min={startDate || undefined}
          disabled={!startDate}
          onChange={(e) =>
            onChange({
              start_date: startDate,
              end_date: e.target.value,
            })
          }
          className="input"
        />
      </div>
    </motion.div>
  )
}
