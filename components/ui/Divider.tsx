import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type DividerProps = ComponentPropsWithoutRef<"hr">;

export function Divider({ className, ...props }: DividerProps) {
  return <hr className={cn("border-border border-t", className)} {...props} />;
}
