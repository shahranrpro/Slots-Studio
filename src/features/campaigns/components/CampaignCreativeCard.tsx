"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type CampaignOutput } from "@/lib/campaigns/types";
import { Eye, Check, X, Bookmark, Copy, CheckCheck } from "lucide-react";

export interface CampaignCreativeCardProps {
  output: CampaignOutput;
  onInspect: (output: CampaignOutput) => void;
  onApprove: (outputId: string) => Promise<void>;
  onReject: (outputId: string) => Promise<void>;
  onSaveToAssets: (outputId: string) => Promise<void>;
}

const CHANNEL_COLORS: Record<string, string> = {
  INSTAGRAM: "#E1306C",
  TIKTOK: "#00F2FE",
  PAID_SOCIAL: "#1877F2",
  WEBSITE: "#B7FF00",
  EMAIL: "#FFA500",
  PRINT: "#FFFFFF",
};

export function CampaignCreativeCard({
  output,
  onInspect,
  onApprove,
  onReject,
  onSaveToAssets,
}: CampaignCreativeCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${output.headline}\n${output.subheadline}\nCTA: ${output.ctaText}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaving(true);
    try {
      await onSaveToAssets(output.id);
    } finally {
      setIsSaving(false);
    }
  };

  const channelColor = CHANNEL_COLORS[output.channel] || "#FFFFFF";

  // Aspect ratio container styles
  let aspectContainerClass = "aspect-square";
  if (output.aspectRatio === "4:5") aspectContainerClass = "aspect-[4/5]";
  else if (output.aspectRatio === "9:16") aspectContainerClass = "aspect-[9/16]";
  else if (output.aspectRatio === "16:9") aspectContainerClass = "aspect-[16/9]";

  return (
    <Card
      variant="subtle"
      className={`group border transition-all duration-200 overflow-hidden flex flex-col ${
        output.status === "APPROVED"
          ? "border-[var(--accent)]/60 bg-[var(--surface-2)]"
          : output.status === "REJECTED"
          ? "border-red-500/30 bg-red-950/5 opacity-60"
          : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)]"
      }`}
    >
      {/* Visual Artwork Box with SVG Render */}
      <div
        className={`relative w-full ${aspectContainerClass} bg-black/90 cursor-pointer overflow-hidden border-b border-[var(--border)] flex items-center justify-center`}
        onClick={() => onInspect(output)}
      >
        <div
          className="w-full h-full pointer-events-none"
          dangerouslySetInnerHTML={{ __html: output.previewSvg }}
        />

        {/* Hover Inspect Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>
            Inspect & Edit
          </Button>
        </div>

        {/* Floating Channel & Format Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white bg-black/80 backdrop-blur-sm border border-white/20 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: channelColor }} />
            {output.channel}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-[var(--accent)] bg-black/80 backdrop-blur-sm border border-[var(--accent)]/30">
            {output.aspectRatio}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          <Badge
            variant={
              output.status === "APPROVED"
                ? "success"
                : output.status === "REJECTED"
                ? "danger"
                : "accent"
            }
          >
            {output.status}
          </Badge>
        </div>
      </div>

      {/* Copy Details & Review Controls */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between text-xs">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-sm text-[var(--text-primary)] line-clamp-1">
            {output.headline}
          </h3>
          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {output.subheadline}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              leftIcon={isCopied ? <CheckCheck className="h-3 w-3 text-[var(--accent)]" /> : <Copy className="h-3 w-3" />}
              className="h-7 px-2 text-[10px]"
            >
              {isCopied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onInspect(output)}
              leftIcon={<Eye className="h-3 w-3" />}
              className="h-7 px-2 text-[10px]"
            >
              Inspect
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {output.status !== "APPROVED" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(output.id);
                }}
                className="h-7 w-7 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
                title="Approve deliverable"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            )}

            {output.status !== "REJECTED" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(output.id);
                }}
                className="h-7 w-7 rounded-[var(--radius-sm)] bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                title="Reject deliverable"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            <Button
              variant="outline"
              size="sm"
              isLoading={isSaving}
              onClick={handleSave}
              leftIcon={<Bookmark className="h-3 w-3 text-[var(--accent)]" />}
              className="h-7 px-2 text-[10px]"
              title="Save to shared Assets Library"
            >
              {output.savedAssetId ? "Saved" : "Save Asset"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
