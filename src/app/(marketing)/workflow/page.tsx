import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Workflow Architecture",
  description: "How Slots Studio connects concept creation to commercial asset delivery.",
};

export default function WorkflowPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-5xl">
        <div className="space-y-3">
          <Badge variant="accent">Workflow Engine</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Create Once. Carry the Context Everywhere.
          </h1>
          <p className="type-body-lg text-[var(--text-secondary)]">
            Traditional pipelines fracture information across disparate tools. Slots Studio unifies
            the entire creative chain into a continuous contextual flow.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] font-mono text-xs font-bold text-black">
                  1
                </span>
                <CardTitle>Define the Product Slot</CardTitle>
              </div>
              <CardDescription className="pt-2">
                Establish the product archetype, materials, color palettes, and technical
                parameters once. This becomes the contextual anchor.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] font-mono text-xs font-bold text-black">
                  2
                </span>
                <CardTitle>Synthesize Visuals &amp; Copy</CardTitle>
              </div>
              <CardDescription className="pt-2">
                Pass the Slot context to Visual Studio and Content Studio simultaneously to generate
                studio renders, lifestyle models, and SEO-optimized copy.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] font-mono text-xs font-bold text-black">
                  3
                </span>
                <CardTitle>Package &amp; Deploy</CardTitle>
              </div>
              <CardDescription className="pt-2">
                Campaign Studio organizes the generated assets into multi-channel marketing kits,
                e-commerce bundles, and production tech packs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Container>
    </div>
  );
}
