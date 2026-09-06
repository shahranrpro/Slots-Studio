"use client";

import React from "react";
import { type ContentType, type ContentTemplate, CONTENT_TEMPLATES } from "@/lib/content/types";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentTemplateSelectorProps {
  contentType: ContentType;
  selectedTemplateId?: string;
  onSelectTemplate: (template: ContentTemplate) => void;
}

export function ContentTemplateSelector({
  contentType,
  selectedTemplateId,
  onSelectTemplate,
}: ContentTemplateSelectorProps) {
  const relevantTemplates = CONTENT_TEMPLATES.filter(
    (t) => t.contentType === contentType
  );

  if (relevantTemplates.length === 0) return null;

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
          ENGINE TEMPLATES
        </label>
        <span className="text-[10px] font-mono text-[var(--accent)]">
          {relevantTemplates.length} READY
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {relevantTemplates.map((template) => {
          const isSelected = template.id === selectedTemplateId;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template)}
              className={cn(
                "group flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--surface-3)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)]"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] mt-0.5",
                  isSelected
                    ? "bg-[var(--accent)] text-black"
                    : "bg-[var(--surface-1)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] border border-[var(--border)]"
                )}
              >
                {isSelected ? (
                  <Check className="h-3 w-3 stroke-[3]" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
              </div>

              <div className="space-y-0.5 min-w-0">
                <h4
                  className={cn(
                    "text-xs font-bold truncate",
                    isSelected ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                  )}
                >
                  {template.name}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-tight">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
