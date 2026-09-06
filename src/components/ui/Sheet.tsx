"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

export type SheetSide = "top" | "right" | "bottom" | "left";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: SheetSide;
  children: React.ReactNode;
  className?: string;
}

const SIDE_MAP: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 border-b border-[var(--border-strong)] max-h-[80vh]",
  bottom: "inset-x-0 bottom-0 border-t border-[var(--border-strong)] max-h-[80vh] rounded-t-[var(--radius-xl)]",
  left: "inset-y-0 left-0 h-full border-r border-[var(--border-strong)] w-full max-w-xs sm:max-w-md",
  right: "inset-y-0 right-0 h-full border-l border-[var(--border-strong)] w-full max-w-xs sm:max-w-md",
};

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  side = "right",
  children,
  className,
}: SheetProps) {
  const [isMounted, setIsMounted] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Lock body scroll while preserving current scroll position
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus drawer on open
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.[0]?.focus();

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      // Focus trapping
      if (e.key === "Tab" && sheetRef.current) {
        const focusable = Array.from(
          sheetRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) return null;

  const content = (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Full Viewport Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Viewport-relative Sheet Drawer Panel */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
        aria-describedby={description ? "sheet-description" : undefined}
        className={cn(
          "fixed z-50 flex flex-col bg-[var(--surface-1)] p-6 shadow-2xl transition-transform duration-200 overflow-y-auto",
          SIDE_MAP[side],
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4 shrink-0">
          <div>
            {title && (
              <h2
                id="sheet-title"
                className="font-display text-base font-bold tracking-tight text-[var(--text-primary)]"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="sheet-description"
                className="mt-0.5 text-xs text-[var(--text-secondary)]"
              >
                {description}
              </p>
            )}
          </div>

          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Close drawer"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
