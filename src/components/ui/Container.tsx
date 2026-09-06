import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  clean?: boolean; // When true, removes default padding
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { as: Component = "div", clean = false, className, children, ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[1440px]",
        !clean && "px-5 sm:px-8 lg:px-12",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
