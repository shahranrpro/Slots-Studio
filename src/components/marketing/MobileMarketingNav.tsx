"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight } from "lucide-react";
import { navigationConfig } from "@/data/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { AppearanceSelector } from "@/components/ui/AppearanceSelector";
import { Divider } from "@/components/ui/Divider";
import { cn } from "@/lib/utils";

export function MobileMarketingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleClose = () => setIsOpen(false);

  return (
    <div className="flex items-center md:hidden">
      <IconButton
        variant="ghost"
        size="md"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5 text-[var(--text-primary)]" />
      </IconButton>

      <Sheet
        isOpen={isOpen}
        onClose={handleClose}
        title="Navigation"
        side="right"
        className="w-full max-w-xs sm:max-w-sm"
      >
        <div className="flex h-full flex-col justify-between pt-2">
          {/* Main Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navigationConfig.marketingNav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={cn(
                    "flex items-center justify-between rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-medium transition-colors select-none",
                    isActive
                      ? "bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions & Controls */}
          <div className="space-y-4 pt-6">
            <Divider label="Appearance" />

            <div className="flex justify-center">
              <AppearanceSelector size="sm" />
            </div>

            <Divider />

            <div className="flex flex-col gap-2.5">
              <Link href={navigationConfig.marketingCta.signIn.href} onClick={handleClose}>
                <Button variant="outline" className="w-full justify-center">
                  {navigationConfig.marketingCta.signIn.title}
                </Button>
              </Link>

              <Link href={navigationConfig.marketingCta.primary.href} onClick={handleClose}>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {navigationConfig.marketingCta.primary.title}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
