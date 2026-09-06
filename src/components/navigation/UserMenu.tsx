"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu, type DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { Settings, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useAppearance } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";

export interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  className?: string;
}

export function UserMenu({
  userName = "Creator",
  userEmail = "user@slots.studio",
  className,
}: UserMenuProps) {
  const router = useRouter();
  const { appearance, setAppearance } = useAppearance();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setIsLoggingOut(false);
    }
  };

  const cycleTheme = () => {
    if (appearance === "system") setAppearance("light");
    else if (appearance === "light") setAppearance("dark");
    else setAppearance("system");
  };

  const getThemeIcon = () => {
    if (appearance === "light") return <Sun className="h-4 w-4 text-amber-400" />;
    if (appearance === "dark") return <Moon className="h-4 w-4 text-indigo-400" />;
    return <Monitor className="h-4 w-4 text-[var(--accent)]" />;
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const items: (DropdownMenuItem | "separator")[] = [
    {
      id: "header",
      label: (
        <div className="flex flex-col py-0.5">
          <span className="font-bold text-[var(--text-primary)]">{userName}</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[180px]">{userEmail}</span>
        </div>
      ),
      disabled: true,
    },
    "separator",
    {
      id: "settings",
      label: "Account Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push("/app/settings"),
    },
    {
      id: "theme",
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Appearance</span>
          <span className="font-mono text-[10px] uppercase text-[var(--accent)] font-semibold">{appearance}</span>
        </div>
      ),
      icon: getThemeIcon(),
      onClick: cycleTheme,
    },
    "separator",
    {
      id: "logout",
      label: isLoggingOut ? "Signing Out..." : "Sign Out",
      icon: <LogOut className="h-4 w-4" />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const trigger = (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-1 pr-2.5 text-xs transition-all duration-150 hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer select-none",
        className
      )}
      aria-label={`User menu for ${userName}`}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-black font-bold font-mono text-[11px]">
        {initials || "SS"}
      </div>
      <span className="hidden md:inline-block font-semibold text-[var(--text-primary)] truncate max-w-[110px]">
        {userName}
      </span>
    </button>
  );

  return <DropdownMenu trigger={trigger} items={items} align="right" className="min-w-[210px]" />;
}
