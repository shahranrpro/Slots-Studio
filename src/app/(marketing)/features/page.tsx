import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Product Features",
  description: "Explore the end-to-end creative capabilities of the Slots Studio operating system.",
};

export default function FeaturesPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-5xl">
        <div className="space-y-3">
          <Badge variant="accent">Platform Capabilities</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Engineered for Modern Creative Teams
          </h1>
          <p className="type-body-lg text-[var(--text-secondary)]">
            A unified creative workflow engine connecting concept, design, visual synthesis, and
            campaign execution.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Context Preservation</CardTitle>
              <CardDescription>
                Never lose design intent. Briefs, colorways, and technical specs travel across all 5 studios.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI-Native Studio Suite</CardTitle>
              <CardDescription>
                Dedicated tooling for product ideation, visual rendering, copy generation, and marketing packaging.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Speed</CardTitle>
              <CardDescription>
                Move from concept sketches to production-ready campaign assets in hours, not weeks.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Container>
    </div>
  );
}
