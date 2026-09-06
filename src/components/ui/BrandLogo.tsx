import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  /**
   * Width and height dimension in pixels. Default is 32.
   */
  size?: number;
  /**
   * Accessible alt description. Provide an empty string ("") if the logo is purely decorative.
   */
  alt?: string;
  /**
   * Whether to prioritize image loading (useful for above-the-fold brand marks).
   */
  priority?: boolean;
  /**
   * Optional custom classes for the container.
   */
  className?: string;
}

/**
 * Official Slots Studio S Mark Logo Component.
 * Preserves exact asset proportions, pixels, and brand fidelity.
 */
export function BrandLogo({
  size = 32,
  alt = "Slots Studio Logo",
  priority = false,
  className,
}: BrandLogoProps) {
  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo/logo.png"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
