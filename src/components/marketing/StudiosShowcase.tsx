"use client";

import React from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { STUDIOS_DATA } from "@/data/studios";
import { StudioCard } from "./StudioCard";

export function StudiosShowcase() {
  const [productStudio, visualStudio, contentStudio, campaignStudio, productionStudio] =
    STUDIOS_DATA;

  return (
    <section className="relative py-20 sm:py-28 border-t border-[var(--border)] bg-[var(--background)]">
      <Container className="space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4 max-w-3xl">
          <Badge variant="accent" dot>
            THE STUDIO
          </Badge>

          {/* Strict Heading Rule: NO full stops */}
          <h2 className="font-display type-h2 font-extrabold tracking-tight text-[var(--text-primary)]">
            FIVE STUDIOS
            <br />
            <span className="text-[var(--accent)]">ONE WORKSPACE</span>
          </h2>

          <p className="type-body-lg text-[var(--text-secondary)] leading-relaxed">
            Every studio is connected to the same project context, so work moves forward instead
            of starting over.
          </p>
        </div>

        {/* Asymmetric Editorial Studio Grid */}
        <div className="space-y-6">
          {/* Top Row: Two Featured Lead Studios */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            <StudioCard studio={productStudio} isFeatured />
            <StudioCard studio={visualStudio} isFeatured />
          </motion.div>

          {/* Bottom Row: Three Specialized Studios */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <StudioCard studio={contentStudio} />
            <StudioCard studio={campaignStudio} />
            <StudioCard studio={productionStudio} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
