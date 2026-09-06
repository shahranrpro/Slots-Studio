"use client";

import React, { useState } from "react";
import { type ContentOutput } from "@/lib/content/types";
import { Dialog, DialogHeader, DialogFooter } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContentEditor } from "./ContentEditor";
import {
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileCheck,
  Download,
} from "lucide-react";

export interface ContentResultDetailProps {
  output: ContentOutput | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (output: ContentOutput) => void;
  onReject: (output: ContentOutput) => void;
  onSaveToAssets: (output: ContentOutput) => void;
  onSaveContent: (outputId: string, updatedContent: string) => Promise<void>;
  onRefine: (output: ContentOutput, notes: string) => Promise<void>;
}

export function ContentResultDetail({
  output,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onSaveToAssets,
  onSaveContent,
  onRefine,
}: ContentResultDetailProps) {
  const [copied, setCopied] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementNotes, setRefinementNotes] = useState("");
  const [showRefineInput, setShowRefineInput] = useState(false);

  if (!output) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(output.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementNotes.trim()) return;

    setIsRefining(true);
    try {
      await onRefine(output, refinementNotes.trim());
      setRefinementNotes("");
      setShowRefineInput(false);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="xl">
      <DialogHeader className="border-b border-[var(--border)] pb-3">
        <div className="flex items-center justify-between w-full pr-6">
          <div className="flex items-center gap-2.5">
            <Badge variant="accent" dot>
              {output.contentType.replace("_", " ")}
            </Badge>
            <span className="font-mono text-xs text-[var(--accent)] font-bold bg-[var(--surface-3)] px-2 py-0.5 rounded border border-[var(--border)]">
              v{output.version}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {output.savedAssetId && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <FileCheck className="h-3 w-3" />
                <span>SAVED TO ASSETS</span>
              </span>
            )}
            <Badge
              variant={
                output.status === "APPROVED"
                  ? "success"
                  : output.status === "REJECTED"
                  ? "danger"
                  : "outline"
              }
            >
              {output.status}
            </Badge>
          </div>
        </div>
        <h3 className="text-base font-display font-bold mt-2 text-[var(--text-primary)]">
          {output.title}
        </h3>
      </DialogHeader>

      <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
        {/* Editor / Preview Component */}
        <ContentEditor output={output} onSaveContent={onSaveContent} />

        {/* Refinement Section */}
        {showRefineInput ? (
          <form
            onSubmit={handleRefineSubmit}
            className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-2)] p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                DIRECTIVE REFINEMENT (v{output.version + 1})
              </label>
              <button
                type="button"
                onClick={() => setShowRefineInput(false)}
                className="text-[10px] font-mono text-[var(--text-muted)] hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <textarea
              value={refinementNotes}
              onChange={(e) => setRefinementNotes(e.target.value)}
              placeholder="e.g. Make the opening hook punchier and emphasize water-repellent durability..."
              rows={2}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)] p-2 text-xs font-mono text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none resize-none"
              autoFocus
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isRefining}
              disabled={!refinementNotes.trim()}
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              Generate Refinement v{output.version + 1}
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[var(--text-primary)]">Iterate & Refine</span>
              <p className="text-[11px] text-[var(--text-muted)]">
                Provide custom feedback directives to produce a versioned candidate without losing history.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowRefineInput(true)}
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              Refine Candidate
            </Button>
          </div>
        )}

        {/* Provenance & Generation Metadata */}
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-3 text-[11px] font-mono space-y-1.5 text-[var(--text-secondary)]">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Tone / Audience:</span>
            <span className="text-[var(--text-primary)] font-bold">
              {output.tone} • {output.audience.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Job Trace:</span>
            <span className="text-[var(--accent)]">{output.jobId}</span>
          </div>
          {output.parentId && (
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Parent Version:</span>
              <span>{output.parentId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Created At:</span>
            <span>{new Date(output.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <DialogFooter className="border-t border-[var(--border)] pt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={
              copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )
            }
          >
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export .md
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {output.status !== "APPROVED" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onApprove(output)}
              className="text-emerald-400 hover:text-emerald-300"
              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            >
              Approve
            </Button>
          )}

          {output.status !== "REJECTED" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onReject(output)}
              className="text-red-400 hover:text-red-300"
              leftIcon={<XCircle className="h-3.5 w-3.5" />}
            >
              Reject
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onSaveToAssets(output)}
            leftIcon={<FileCheck className="h-3.5 w-3.5" />}
          >
            {output.savedAssetId ? "Saved in Assets" : "Save as Asset"}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
