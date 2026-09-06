"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroEyebrow } from "./HeroEyebrow";
import { HeroLogoReveal } from "./HeroLogoReveal";
import { HeroApplicationPreview } from "./HeroApplicationPreview";
import { navigationConfig } from "@/data/navigation";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-24">
      {/* Background Grid Pattern Accent */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

      <Container className="space-y-16 lg:space-y-0">
        {/* Two-Part Editorial Composition */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Brand, Typography & CTAs */}
          <div className="flex flex-col items-start space-y-6 lg:col-span-6 xl:col-span-5">
            {/* Eyebrow & Logo Reveal Group */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <HeroLogoReveal />
              <div className="hidden sm:block h-6 w-px bg-[var(--border)]" />
              <HeroEyebrow label="AI CREATIVE WORKFLOW" />
            </div>

            {/* Main Editorial H1 — Strictly NO full stops */}
            <h1 className="font-display type-display-l font-extrabold tracking-tight text-[var(--text-primary)]">
              ONE PRODUCT
              <br />
              <span className="text-[var(--accent)]">EVERY OUTPUT</span>
            </h1>

            {/* Supporting Pitch */}
            <p className="type-body-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Create, refine, and move product ideas from concept to commercial output inside one
              AI-powered studio. Carry the full context across design, visuals, content, and
              campaigns.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href={navigationConfig.marketingCta.primary.href}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {navigationConfig.marketingCta.primary.title}
                </Button>
              </Link>

              <Link href={navigationConfig.marketingCta.secondary.href}>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Compass className="h-4 w-4" />}
                >
                  {navigationConfig.marketingCta.secondary.title}
                </Button>
              </Link>
            </div>

            {/* Trust / Technical Metric Note */}
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)] w-full text-xs font-mono text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <span>5 Integrated Studios</span>
              </div>
              <span>•</span>
              <div>Context Lock Engine</div>
            </div>
          </div>

          {/* Right Column: Workstation Application Preview */}
          <div className="lg:col-span-6 xl:col-span-7">
            <HeroApplicationPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
