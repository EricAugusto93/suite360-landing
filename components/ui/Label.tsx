import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type LabelProps = ComponentPropsWithoutRef<"label">;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-label text-foreground font-medium", className)}
      {...props}
    />
  );
}
