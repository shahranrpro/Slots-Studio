import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Card, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Resources & Guides",
  description: "Documentation, workflow guides, and resources for Slots Studio.",
};

export default function ResourcesPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-5xl">
        <div className="space-y-3">
          <Badge variant="accent">Resource Center</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Guides, Documentation &amp; Insights
          </h1>
          <p className="type-body-lg text-[var(--text-secondary)]">
            Explore best practices for structuring generative product workflows and maximizing
            studio output.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Card variant="interactive">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">Guide</Badge>
              <CardTitle>Structuring Product Slots</CardTitle>
              <CardDescription>
                How to formulate technical briefs that yield photorealistic 3D renders and specs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">Architecture</Badge>
              <CardTitle>Context Pipelines</CardTitle>
              <CardDescription>
                Deep-dive into multi-studio state management and AI context preservation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Link href="/dev/components" className="block">
            <Card variant="interactive" className="h-full border-[var(--accent)]/40">
              <CardHeader>
                <Badge variant="accent" className="w-fit mb-2">Internal</Badge>
                <CardTitle>UI Component System</CardTitle>
                <CardDescription>
                  Interactive developer showcase of all 22 Slots Studio design primitives.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </Container>
    </div>
  );
}
