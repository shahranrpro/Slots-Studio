import React from "react";
import type { Metadata } from "next";
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent, FormField, Input, Textarea, Button, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get in touch with the Slots Studio team.",
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="space-y-12 max-w-3xl">
        <div className="space-y-3">
          <Badge variant="accent">Get in Touch</Badge>
          <h1 className="font-display type-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Contact Slots Studio
          </h1>
          <p className="type-body-lg text-[var(--text-secondary)]">
            Have questions regarding custom enterprise integrations, studio pipelines, or technical
            support? Send our engineering team a message.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>We typically respond within 24 business hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Full Name" required htmlFor="contact-name">
                <Input id="contact-name" placeholder="Alex Rivers" />
              </FormField>
              <FormField label="Work Email" required htmlFor="contact-email">
                <Input id="contact-email" type="email" placeholder="alex@brand.com" />
              </FormField>
            </div>
            <FormField label="Subject" required htmlFor="contact-subject">
              <Input id="contact-subject" placeholder="Enterprise Studio Inquiry" />
            </FormField>
            <FormField label="Message" required htmlFor="contact-message">
              <Textarea id="contact-message" rows={4} placeholder="Describe your inquiry..." />
            </FormField>
            <div className="pt-2">
              <Button variant="primary">Submit Inquiry</Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
