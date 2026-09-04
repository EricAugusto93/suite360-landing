"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonVariant = "ghost" | "outline" | "solid";
type IconButtonSize = "sm" | "md";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  icon: ReactNode;
  /** Obrigatorio: botoes de icone nao tem texto visivel para leitores de tela. */
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: "text-foreground hover:bg-muted active:bg-muted",
  outline:
    "border border-border text-foreground hover:bg-muted active:bg-muted",
  solid: "bg-primary text-primary-foreground hover:bg-primary-hover",
};

// md (44px) e o padrao recomendado para area de toque confortavel no mobile.
const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = "ghost",
      size = "md",
      className,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-colors duration-200",
          "focus-visible:ring-primary focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
