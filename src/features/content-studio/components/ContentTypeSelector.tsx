"use client";

import React from "react";
import { type ContentType, type ContentOutput } from "@/lib/content/types";
import {
  FileText,
  AlignLeft,
  ListOrdered,
  Share2,
  BookOpen,
  Megaphone,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentTypeSelectorProps {
  selectedType: ContentType;
  onSelectType: (type: ContentType) => void;
  outputs: ContentOutput[];
}

const CONTENT_TYPES_CONFIG: {
  id: ContentType;
  label: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: "PRODUCT_DESCRIPTION",
    label: "Product Description",
    code: "01",
    icon: FileText,
    description: "E-commerce hero product overview and styling highlights",
  },
  {
    id: "SHORT_DESCRIPTION",
    label: "Short Description",
    code: "02",
    icon: AlignLeft,
    description: "Punchy 1-2 sentence catalog and card preview copy",
  },
  {
    id: "FEATURE_BULLETS",
    label: "Feature Bullets",
    code: "03",
    icon: ListOrdered,
    description: "5 engineering-grade bullet points on fit and textiles",
  },
  {
    id: "SOCIAL_CAPTION",
    label: "Social Caption",
    code: "04",
    icon: Share2,
    description: "Multi-channel post copy with call-to-action & hashtags",
  },
  {
    id: "PRODUCT_STORY",
    label: "Product Story",
    code: "05",
    icon: BookOpen,
    description: "Editorial brand narrative exploring design origins and ethos",
  },
  {
    id: "CAMPAIGN_COPY",
    label: "Campaign Copy",
    code: "06",
    icon: Megaphone,
    description: "Synchronized digital ad headlines and marketing hooks",
  },
  {
    id: "TECHNICAL_COPY",
    label: "Technical Specs",
    code: "07",
    icon: Cpu,
    description: "Precision technical spec sheet and garment care protocols",
  },
];

export function ContentTypeSelector({
  selectedType,
  onSelectType,
  outputs,
}: ContentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
          CONTENT FORMATS
        </h2>
        <span className="text-[10px] font-mono text-[var(--accent)] font-semibold">
          7 ENGINE MODES
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {CONTENT_TYPES_CONFIG.map((item) => {
          const Icon = item.icon;
          const isSelected = item.id === selectedType;
          const count = outputs.filter((o) => o.contentType === item.id).length;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectType(item.id)}
              className={cn(
                "group flex flex-col justify-between p-3 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer relative overflow-hidden select-none",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--surface-3)] shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
              )}
            >
              {/* Active Lime Accent Bar */}
              {isSelected && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
              )}

              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] transition-colors",
                    isSelected
                      ? "bg-[var(--accent)] text-black font-bold"
                      : "bg-[var(--surface-2)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span
                  className={cn(
                    "font-mono text-[9px] font-bold px-1.5 py-0.5 rounded",
                    count > 0
                      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                      : "text-[var(--text-muted)]"
                  )}
                >
                  {count > 0 ? count : item.code}
                </span>
              </div>

              <div>
                <span
                  className={cn(
                    "text-xs font-bold block truncate leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
