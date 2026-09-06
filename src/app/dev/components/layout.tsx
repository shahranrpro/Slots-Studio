import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System Showcase",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
