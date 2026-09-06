"use client";

import React, { useState, useRef, useEffect, forwardRef, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean | string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = "Select an option...",
    error,
    disabled = false,
    className,
    id,
    "aria-label": ariaLabel,
  },
  ref
) {
  const [internalValue, setInternalValue] = useState<string>(value ?? defaultValue ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const listboxId = id ? `${id}-listbox` : `select-listbox-${autoId}`;

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);
  const hasError = Boolean(error);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string, optionDisabled?: boolean) => {
    if (optionDisabled) return;
    setInternalValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(options.findIndex((opt) => opt.value === currentValue) || 0);
      } else if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => (prev + 1) % options.length);
      }
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    } else if ((e.key === "Enter" || e.key === " ") && isOpen && focusedIndex >= 0) {
      e.preventDefault();
      const targetOption = options[focusedIndex];
      if (targetOption && !targetOption.disabled) {
        handleSelect(targetOption.value, targetOption.disabled);
      }
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        ref={ref}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-invalid={hasError ? "true" : undefined}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-3.5 text-sm text-[var(--text-primary)] transition-all duration-150 select-none cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--surface-2)]",
          hasError
            ? "border-red-500/80 focus-visible:outline-red-500"
            : "border-[var(--border-strong)] hover:border-[var(--border-strong)]"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-[var(--text-muted)]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-150",
            isOpen && "rotate-180 text-[var(--accent)]"
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-1 shadow-lg backdrop-blur-md focus:outline-none"
        >
          {options.map((option, idx) => {
            const isSelected = option.value === currentValue;
            const isFocused = idx === focusedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => handleSelect(option.value, option.disabled)}
                className={cn(
                  "relative flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-xs font-medium transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                  isFocused && "bg-[var(--surface-2)] text-[var(--text-primary)]",
                  option.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});
