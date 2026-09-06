"use client";

import React, { createContext, useContext, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextType {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType>({});

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  disabled = false,
  orientation = "vertical",
  className,
  children,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState<string>(value ?? defaultValue ?? "");

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        value: currentValue,
        onChange: handleChange,
        disabled,
      }}
    >
      <div
        role="radiogroup"
        aria-orientation={orientation}
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap items-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  function RadioGroupItem({ value, label, description, disabled, id, className, ...props }, ref) {
    const context = useContext(RadioGroupContext);
    const isChecked = context.value === value;
    const isDisabled = disabled || context.disabled;

    return (
      <label
        htmlFor={id}
        className={cn(
          "group relative flex items-start gap-3 select-none cursor-pointer",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
      >
        <div className="relative flex items-center pt-0.5">
          <input
            ref={ref}
            id={id}
            type="radio"
            name={context.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={() => context.onChange?.(value)}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-150",
              "border-[var(--border-strong)] bg-[var(--surface-1)]",
              "peer-checked:border-[var(--accent)] peer-checked:bg-[var(--surface-1)]",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]",
              "group-hover:border-[var(--text-secondary)]"
            )}
          >
            {isChecked && (
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-medium text-[var(--text-primary)] leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="mt-0.5 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);
