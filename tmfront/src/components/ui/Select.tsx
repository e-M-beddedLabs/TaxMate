import React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/format"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="label mb-1">{label}</label>}

      <div className="relative h-11">
        <select
          {...props}
          className={cn(
            // HARD SIZE LOCK (this fixes vertical cut permanently)
            "h-11 w-full leading-[44px]",

            // reset browser + inherited styles
            "appearance-none bg-transparent outline-none",

            // padding
            "pl-3 pr-10",

            // border & radius (DO NOT rely on .input)
            "rounded-lg border border-light-border dark:border-dark-border",

            // text
            "text-sm",

            // focus (no red corners)
            "focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",

            className
          )}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-light-muted"
        />
      </div>
    </div>
  )
}
