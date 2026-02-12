import React from "react"
import { ChevronDown } from "lucide-react"

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={`
            w-full bg-surface border border-white/10 rounded-xl px-4 py-3 pr-10
            text-text-primary appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-highlight/20 focus:border-highlight/50
            transition-all duration-200
            hover:border-white/20
            ${error ? 'border-red-500/50 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#111] text-text-primary">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted group-hover:text-text-primary transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400 ml-1">{error}</p>
      )}
    </div>
  )
}

export { Select };
