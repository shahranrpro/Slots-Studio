"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  Images,
  Activity,
  Box,
  Eye,
  FileText,
  Megaphone,
  Scissors,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useAppearance } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  title: string;
  category: "Overview" | "Workspace" | "Studios" | "System" | "Appearance";
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  onSelect: () => void;
}

export interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const router = useRouter();
  const { setAppearance } = useAppearance();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Global Cmd/Ctrl + K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const allCommands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-dashboard",
        title: "Go to Dashboard",
        category: "Overview",
        icon: LayoutDashboard,
        onSelect: () => {
          router.push("/app");
          onClose();
        },
      },
      {
        id: "nav-projects",
        title: "Go to Projects",
        category: "Workspace",
        icon: FolderKanban,
        onSelect: () => {
          router.push("/app/projects");
          onClose();
        },
      },
      {
        id: "nav-assets",
        title: "Go to Assets",
        category: "Workspace",
        icon: Images,
        onSelect: () => {
          router.push("/app/assets");
          onClose();
        },
      },
      {
        id: "nav-jobs",
        title: "Go to Jobs",
        category: "Workspace",
        icon: Activity,
        onSelect: () => {
          router.push("/app/jobs");
          onClose();
        },
      },
      {
        id: "studio-product",
        title: "Open Product Studio",
        category: "Studios",
        icon: Box,
        badge: "01",
        onSelect: () => {
          router.push("/app/studio/product");
          onClose();
        },
      },
      {
        id: "studio-visual",
        title: "Open Visual Studio",
        category: "Studios",
        icon: Eye,
        badge: "02",
        onSelect: () => {
          router.push("/app/studio/visual");
          onClose();
        },
      },
      {
        id: "studio-content",
        title: "Open Content Studio",
        category: "Studios",
        icon: FileText,
        badge: "03",
        onSelect: () => {
          router.push("/app/studio/content");
          onClose();
        },
      },
      {
        id: "studio-campaign",
        title: "Open Campaign Studio",
        category: "Studios",
        icon: Megaphone,
        badge: "04",
        onSelect: () => {
          router.push("/app/studio/campaign");
          onClose();
        },
      },
      {
        id: "studio-production",
        title: "Open Production Studio",
        category: "Studios",
        icon: Scissors,
        badge: "05",
        onSelect: () => {
          router.push("/app/studio/production");
          onClose();
        },
      },
      {
        id: "sys-settings",
        title: "Workspace Settings",
        category: "System",
        icon: Settings,
        onSelect: () => {
          router.push("/app/settings");
          onClose();
        },
      },
      {
        id: "sys-help",
        title: "Documentation & Help",
        category: "System",
        icon: HelpCircle,
        onSelect: () => {
          router.push("/app/help");
          onClose();
        },
      },
      {
        id: "theme-default",
        title: "Appearance: System Default",
        category: "Appearance",
        icon: Monitor,
        onSelect: () => {
          setAppearance("system");
          onClose();
        },
      },
      {
        id: "theme-light",
        title: "Appearance: Light Mode",
        category: "Appearance",
        icon: Sun,
        onSelect: () => {
          setAppearance("light");
          onClose();
        },
      },
      {
        id: "theme-dark",
        title: "Appearance: Dark Mode",
        category: "Appearance",
        icon: Moon,
        onSelect: () => {
          setAppearance("dark");
          onClose();
        },
      },
    ],
    [router, onClose, setAppearance]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase().trim();
    return allCommands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].onSelect();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen || !isMounted) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Menu"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Command Palette Card */}
      <div className="relative w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface-1)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5 bg-[var(--surface-2)]">
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            placeholder="Type a command, studio, or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-[var(--border)] bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Command Items List */}
        <div
          id="command-list"
          role="listbox"
          className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[380px]"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] font-mono">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => cmd.onSelect()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between w-full rounded-[var(--radius-md)] px-3 py-2.5 text-xs transition-colors cursor-pointer select-none text-left",
                    isSelected
                      ? "bg-[var(--accent)] text-black font-semibold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{cmd.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-mono",
                          isSelected
                            ? "bg-black text-white"
                            : "bg-[var(--surface-3)] text-[var(--text-muted)]"
                        )}
                      >
                        {cmd.badge}
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-mono uppercase tracking-wider",
                        isSelected ? "text-black/80" : "text-[var(--text-muted)]"
                      )}
                    >
                      {cmd.category}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 bg-[var(--surface-2)] text-[10px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[var(--accent)] font-semibold uppercase">Slots Studio Quick Navigation</span>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
