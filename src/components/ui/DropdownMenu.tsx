"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DropdownMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  items: (DropdownMenuItem | "separator")[];
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const actionItems = items.filter((item): item is DropdownMenuItem => item !== "separator");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % actionItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + actionItems.length) % actionItems.length);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < actionItems.length) {
        const item = actionItems[focusedIndex];
        if (!item.disabled) {
          item.onClick?.();
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left" onKeyDown={handleKeyDown}>
      {React.isValidElement(trigger) &&
        React.cloneElement(trigger, {
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            trigger.props.onClick?.(e);
            setIsOpen(!isOpen);
          },
          "aria-haspopup": "menu",
          "aria-expanded": isOpen,
        } as React.HTMLAttributes<HTMLElement>)}

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "absolute z-50 mt-1.5 min-w-[160px] rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-1 shadow-xl focus:outline-none",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {items.map((item, idx) => {
            if (item === "separator") {
              return (
                <div
                  key={`sep-${idx}`}
                  role="separator"
                  className="my-1 border-t border-[var(--border)]"
                />
              );
            }

            const itemIndex = actionItems.findIndex((ai) => ai.id === item.id);
            const isFocused = itemIndex === focusedIndex;

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-xs font-medium transition-colors text-left select-none cursor-pointer",
                  item.danger
                    ? "text-red-400 hover:bg-red-950/40 hover:text-red-300"
                    : isFocused
                    ? "bg-[var(--surface-2)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                  item.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
              >
                {item.icon && <span className="h-4 w-4 shrink-0 text-current">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
