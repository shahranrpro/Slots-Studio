"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { AppearanceSelector } from "@/components/ui/AppearanceSelector";
import { Container } from "@/components/ui/Container";
import { navigationConfig } from "@/data/navigation";
import { APP_CONFIG } from "@/lib/constants";
import { MobileMarketingNav } from "./MobileMarketingNav";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[var(--accent-foreground)] focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Header Bar */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          isScrolled
            ? "border-b border-[var(--border)] bg-[var(--surface-1)]/90 backdrop-blur-md shadow-xs"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <Container clean className="px-5 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Brand Identity */}
            <Link
              href="/"
              className="flex items-center gap-3 group select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-[var(--radius-sm)]"
              aria-label="Slots Studio Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] transition-colors group-hover:border-[var(--border-strong)]">
                <BrandLogo size={22} priority alt="Slots Studio S Mark" />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
                {APP_CONFIG.name}
              </span>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-1)]/80 px-3 py-1 shadow-2xs backdrop-blur-xs"
            >
              {navigationConfig.marketingNav.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors select-none",
                      "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]",
                      isActive
                        ? "bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold shadow-xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                    )}
                  >
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions & Theme Control */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center">
                <AppearanceSelector size="sm" />
              </div>

              <div className="hidden md:flex items-center gap-2.5">
                <Link href={navigationConfig.marketingCta.signIn.href}>
                  <Button variant="ghost" size="sm">
                    {navigationConfig.marketingCta.signIn.title}
                  </Button>
                </Link>

                <Link href={navigationConfig.marketingCta.primary.href}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    {navigationConfig.marketingCta.primary.title}
                  </Button>
                </Link>
              </div>

              {/* Mobile Drawer Trigger */}
              <MobileMarketingNav />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}
