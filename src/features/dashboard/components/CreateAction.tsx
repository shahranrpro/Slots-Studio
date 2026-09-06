"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Box, Eye, FileText, Megaphone, Scissors, ArrowUpRight } from "lucide-react";

const STUDIOS = [
  {
    id: "01",
    name: "Product Studio",
    href: "/app/studio/product",
    desc: "Briefs, silhouettes, 3D specs",
    icon: Box,
  },
  {
    id: "02",
    name: "Visual Studio",
    href: "/app/studio/visual",
    desc: "On-model, studio lighting, styling",
    icon: Eye,
  },
  {
    id: "03",
    name: "Content Studio",
    href: "/app/studio/content",
    desc: "Descriptions, copy, messaging",
    icon: FileText,
  },
  {
    id: "04",
    name: "Campaign Studio",
    href: "/app/studio/campaign",
    desc: "Multi-aspect banners & social kits",
    icon: Megaphone,
  },
  {
    id: "05",
    name: "Production Studio",
    href: "/app/studio/production",
    desc: "BOM, CAD specs, vendor handoff",
    icon: Scissors,
  },
];

export function CreateAction() {
  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
          STUDIO LAUNCHERS
        </h2>
        <span className="text-[10px] font-mono text-[var(--accent)] font-semibold">
          ONE CONTEXT LOCK
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STUDIOS.map((studio) => {
          const Icon = studio.icon;
          return (
            <Link key={studio.id} href={studio.href} className="group focus:outline-none">
              <Card
                variant="interactive"
                className="p-3.5 h-full flex flex-col justify-between border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {studio.id}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="mt-3 space-y-0.5">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                    {studio.name}
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 leading-snug">
                    {studio.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
