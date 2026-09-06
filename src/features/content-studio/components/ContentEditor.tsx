"use client";

import React, { useState, useEffect } from "react";
import { type ContentOutput } from "@/lib/content/types";
import { Button } from "@/components/ui/Button";
import {
  Bold,
  Italic,
  List,
  Heading,
  Eye,
  Edit3,
  Save,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentEditorProps {
  output: ContentOutput;
  onSaveContent: (outputId: string, updatedContent: string) => Promise<void>;
}

export function ContentEditor({ output, onSaveContent }: ContentEditorProps) {
  const [content, setContent] = useState(output.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setContent(output.content);
  }, [output.content, output.id]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const readingTimeSeconds = Math.max(5, Math.ceil((wordCount / 200) * 60));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveContent(output.id, content);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const insertFormat = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("content-editor-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden space-y-0">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs select-none">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer",
              !isEditing
                ? "bg-[var(--surface-3)] text-[var(--accent)] font-bold border border-[var(--border)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Rendered View</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer",
              isEditing
                ? "bg-[var(--surface-3)] text-[var(--accent)] font-bold border border-[var(--border)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Raw Editor</span>
          </button>
        </div>

        {/* Format buttons if in editor mode */}
        {isEditing && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormat("**", "**")}
              className="p-1 rounded hover:bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("*", "*")}
              className="p-1 rounded hover:bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("### ")}
              className="p-1 rounded hover:bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Heading"
            >
              <Heading className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("\n- ")}
              className="p-1 rounded hover:bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Bullet List"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>Saved</span>
            </span>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            className="text-xs h-7"
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        {isEditing ? (
          <textarea
            id="content-editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full bg-transparent font-mono text-xs text-[var(--text-primary)] leading-relaxed focus:outline-none resize-y"
          />
        ) : (
          <div className="font-mono text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line space-y-2 select-text">
            {content}
          </div>
        )}
      </div>

      {/* Footer Metadata */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--surface-2)] text-[10px] font-mono text-[var(--text-muted)] select-none">
        <div className="flex items-center gap-3">
          <span>{wordCount} Words</span>
          <span>{charCount} Characters</span>
          <span>~{readingTimeSeconds}s Read Time</span>
        </div>
        <span className="text-[var(--accent)] font-semibold uppercase">
          {output.metadata.modelLabel}
        </span>
      </div>
    </div>
  );
}
