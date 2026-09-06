import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing the use of Slots Studio.",
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-4xl">
        <div className="space-y-3">
          <Badge variant="outline">Legal</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Terms of Service
          </h1>
          <p className="type-body text-[var(--text-secondary)]">Last updated: August 2026</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs leading-relaxed text-[var(--text-secondary)]">
            <p>
              By accessing or using the Slots Studio platform, you agree to be bound by these Terms
              of Service.
            </p>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] pt-2">
              Ownership of Generated Content
            </h4>
            <p>
              You retain all ownership rights, copyrights, and intellectual property in the designs,
              prompts, and outputs generated through your active subscription tier.
            </p>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] pt-2">
              Acceptable Use
            </h4>
            <p>
              You agree not to use the generative engine for infringing intellectual property,
              creating malicious material, or attempting to reverse-engineer proprietary pipeline
              models.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
