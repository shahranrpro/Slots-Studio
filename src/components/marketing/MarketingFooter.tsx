import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { navigationConfig } from "@/data/navigation";
import { APP_CONFIG } from "@/lib/constants";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();
  const { product, studios, resources, legal } = navigationConfig.marketingFooterNav;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-1)]">
      <Container className="py-12 sm:py-16">
        {/* Top Grid: Brand Column + Navigation Columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4 md:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-[var(--radius-sm)]"
              aria-label="Slots Studio Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)]">
                <BrandLogo size={20} alt="Slots Studio S Mark" />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
                {APP_CONFIG.name}
              </span>
            </Link>

            <p className="max-w-xs text-xs text-[var(--text-secondary)] leading-relaxed">
              AI-native creative &amp; product operating system. Create once. Carry the context
              everywhere.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>Slots Engine v0.1 • Operational</span>
            </div>
          </div>

          {/* Product Column */}
          <div className="col-span-1 space-y-3 md:col-span-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {product.title}
            </h4>
            <ul className="space-y-2 text-xs">
              {product.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studios Column */}
          <div className="col-span-1 space-y-3 md:col-span-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {studios.title}
            </h4>
            <ul className="space-y-2 text-xs">
              {studios.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-span-1 space-y-3 md:col-span-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {resources.title}
            </h4>
            <ul className="space-y-2 text-xs">
              {resources.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-span-1 space-y-3 md:col-span-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {legal.title}
            </h4>
            <ul className="space-y-2 text-xs">
              {legal.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Divider className="my-8" />

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p suppressHydrationWarning>© {currentYear} {APP_CONFIG.name}. All rights reserved.</p>
          <p className="font-mono text-[11px] text-[var(--text-muted)]">
            Create once. Carry the context everywhere.
          </p>
        </div>
      </Container>
    </footer>
  );
}
