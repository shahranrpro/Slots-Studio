"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  RefreshCw,
  XCircle,
  Sliders,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

type ReviewState = "pending" | "approved" | "rejected";

export function ReviewSection() {
  const [reviewState, setReviewState] = useState<ReviewState>("pending");

  return (
    <section className="relative py-20 sm:py-28 border-t border-[var(--border)] bg-[var(--background)]">
      <Container className="space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4 max-w-3xl">
          <Badge variant="accent" dot>
            AI + HUMAN REVIEW
          </Badge>

          {/* Strict Heading Rule: NO full stops */}
          <h2 className="font-display type-h2 font-extrabold tracking-tight text-[var(--text-primary)]">
            GENERATE
            <br />
            <span className="text-[var(--accent)]">THEN DECIDE</span>
          </h2>

          <p className="type-body-lg text-[var(--text-secondary)] leading-relaxed">
            AI creates the draft. You decide what moves forward.
          </p>
        </div>

        {/* Technical Review Workstation Interface */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-4 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Workstation Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--accent)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    CANDIDATE #02481-B
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">•</span>
                  <span className="font-display text-xs font-bold text-[var(--text-primary)]">
                    Technical Training Jacket SS-24
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  Interactive Review Workstation
                </span>
              </div>
            </div>

            {/* Decision Status Badge */}
            <div className="flex items-center gap-3">
              {reviewState === "pending" && (
                <Badge variant="warning" dot>
                  PENDING REVIEW
                </Badge>
              )}
              {reviewState === "approved" && (
                <Badge variant="success" dot>
                  APPROVED
                </Badge>
              )}
              {reviewState === "rejected" && (
                <Badge variant="danger" dot>
                  REJECTED
                </Badge>
              )}
            </div>
          </div>

          {/* Workstation Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Generated Draft Visualization Preview */}
            <div className="flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] p-6 lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                  SYNTHESIS ARTIFACT INSPECTION
                </span>
                <span className="font-mono text-[10px] text-[var(--accent)] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>PREVIEW CANVAS</span>
                </span>
              </div>

              {/* Wireframe Mockup Visual */}
              <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-1)] p-8 text-center">
                <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-3)] border border-[var(--border)]">
                  <Zap className="h-8 w-8 text-[var(--accent)]" />
                </div>
                <h4 className="font-display text-sm font-bold text-[var(--text-primary)]">
                  Tactical Technical Shell Lookbook
                </h4>
                <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-sm">
                  Generated with locked silhouette geometry, stealth black palette, and matte trims.
                </p>
              </div>

              {/* Technical Context Status Bar — Purely factual status without invented numerical claims */}
              <div className="grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4 text-center font-mono text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Spec Status</span>
                  <p className="font-bold text-[var(--text-primary)]">LOCKED</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Colorway</span>
                  <p className="font-bold text-[var(--accent)]">CALIBRATED</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Context Status</span>
                  <p className="font-bold text-emerald-400">UNIFIED</p>
                </div>
              </div>
            </div>

            {/* Right: Decision Controls & Parameter Checks */}
            <div className="flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] p-6 lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    Decision Matrix
                  </span>
                  <Sliders className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  No generated output is deployed without explicit operator sign-off. Approved
                  assets carry the project context downstream.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-xs">
                    <span className="text-[var(--text-secondary)]">Material Spec Lock</span>
                    <span className="font-mono text-emerald-400 font-semibold">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-xs">
                    <span className="text-[var(--text-secondary)]">Brand Voice Compliance</span>
                    <span className="font-mono text-emerald-400 font-semibold">PASS</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Demo interactive state) */}
              <div className="space-y-2.5 pt-4 border-t border-[var(--border)]">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => setReviewState("approved")}
                >
                  Approve for Production
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-center"
                    leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                    onClick={() => setReviewState("pending")}
                  >
                    Regenerate
                  </Button>
                  <Button
                    variant="danger"
                    className="justify-center"
                    leftIcon={<XCircle className="h-3.5 w-3.5" />}
                    onClick={() => setReviewState("rejected")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
