"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  options: {
    value: string
    label: string
  }[]
  disabled?: boolean
}

export function SegmentedControl({
  value,
  onValueChange,
  options,
  disabled,
  className,
  ...props
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "bg-muted rounded-lg p-0.5 flex w-fit",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          onClick={() => !disabled && onValueChange(option.value)}
          disabled={disabled}
          className={cn(
            "rounded px-4 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
            disabled && "cursor-not-allowed"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
} 