import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Slots Studio",
  description: "The mission, philosophy, and engineering behind Slots Studio.",
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-4xl">
        <div className="space-y-3">
          <Badge variant="accent">Our Mission</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Bridging Product Design &amp; Commercial Velocity
          </h1>
          <p className="type-body-lg text-[var(--text-secondary)]">
            Slots Studio was created to eliminate the friction between product conception and
            market launch.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-sm text-[var(--text-secondary)] space-y-4 leading-relaxed">
          <p>
            Traditional product teams spend 70% of their creative cycle transcribing intent: passing
            tech-packs to render artists, writing copy from scratch for e-commerce, and manually
            reformatting visuals for each marketing channel.
          </p>
          <p>
            We engineered Slots Studio around the concept of the <strong>Contextual Slot</strong>.
            By capturing design parameters in a structured, AI-accessible format at the origin, all
            downstream assets can be generated in real-time with flawless fidelity to the original
            vision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Technical Precision</CardTitle>
              <CardDescription>
                Zero tolerance for hallucinations in product specs. Every generative output adheres
                strictly to defined dimensions, materials, and color standards.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>End-to-End Speed</CardTitle>
              <CardDescription>
                Empowering small creative teams to operate with the visual and marketing output of
                an enterprise brand.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Container>
    </div>
  );
}
