"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { WORKFLOW_STAGES } from "@/data/studios";
import { WorkflowNode } from "./WorkflowNode";
import { ArrowRight, CheckCircle2, Cpu } from "lucide-react";

export function ConnectedWorkflow() {
  const [activeStageId, setActiveStageId] = useState<string>("product");

  const activeStage =
    WORKFLOW_STAGES.find((s) => s.id === activeStageId) || WORKFLOW_STAGES[0];

  return (
    <section className="relative py-20 sm:py-28 border-t border-[var(--border)] bg-[var(--background)]">
      <Container className="space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4 max-w-3xl">
          <Badge variant="accent" dot>
            CONNECTED WORKFLOW
          </Badge>

          {/* Strict Heading Rule: NO full stops */}
          <h2 className="font-display type-h2 font-extrabold tracking-tight text-[var(--text-primary)]">
            ONE IDEA
            <br />
            <span className="text-[var(--accent)]">EVERY OUTPUT</span>
          </h2>

          <p className="type-body-lg text-[var(--text-secondary)] leading-relaxed">
            Create once and carry the same product context through every creative stage.
          </p>
        </div>

        {/* 5-Stage Connected Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 relative"
          role="tablist"
          aria-label="Workflow Stages"
        >
          {WORKFLOW_STAGES.map((stage, idx) => (
            <WorkflowNode
              key={stage.id}
              stage={stage}
              isActive={activeStage.id === stage.id}
              onClick={() => setActiveStageId(stage.id)}
              isLast={idx === WORKFLOW_STAGES.length - 1}
            />
          ))}
        </motion.div>

        {/* Interactive Context Inspector Canvas */}
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-6 sm:p-8 shadow-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-[var(--border)] pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)]">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                  ACTIVE STAGE {activeStage.number} • CONTEXT HANDOFF
                </span>
                <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                  {activeStage.title} Studio Node
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>CONTEXT LOCK VERIFIED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card variant="subtle" className="p-4 space-y-2">
              <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                INBOUND CONTEXT INPUT
              </span>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                {activeStage.inputContext}
              </p>
            </Card>

            <Card variant="subtle" className="p-4 space-y-2 border-l-2 border-l-[var(--accent)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[var(--accent)]">
                  GENERATED ARTIFACT OUTPUT
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--accent)]" />
              </div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                {activeStage.outputArtifact}
              </p>
            </Card>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
