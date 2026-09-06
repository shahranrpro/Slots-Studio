import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Slots Studio privacy commitments and data handling policies.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-4xl">
        <div className="space-y-3">
          <Badge variant="outline">Legal</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Privacy Policy
          </h1>
          <p className="type-body text-[var(--text-secondary)]">Last updated: August 2026</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Protection &amp; Confidentiality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs leading-relaxed text-[var(--text-secondary)]">
            <p>
              At Slots Studio, we respect your intellectual property and privacy. We do not use your
              proprietary design assets, technical specifications, or confidential product prompts to
              train public AI models without explicit enterprise consent.
            </p>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] pt-2">
              Information We Collect
            </h4>
            <p>
              We collect account identifiers, usage analytics to improve service reliability, and
              workspace state necessary to maintain product context across our creative studios.
            </p>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] pt-2">
              Asset Security
            </h4>
            <p>
              All stored assets, 3D definitions, and generated imagery are encrypted in transit and
              at rest using industry-standard AES-256 protocols.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
