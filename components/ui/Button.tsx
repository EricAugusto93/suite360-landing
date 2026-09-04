"use client";

import { forwardRef } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

// Transicao de 200ms (janela 200-500ms pedida) com lista explicita de
// propriedades (evita `transition-all`, mais previsivel/performatico).
const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100";

// Botoes primarios devem usar size md/lg para garantir area de toque >= 44px no mobile.
// FASE 13: feedback de hover vem da MUDANCA DE COR (nao de elevacao/sombra
// — instrucao explicita: "sombra minima ou nenhuma", botao deve parecer
// "preciso, nao fofinho"). `active:scale-[0.98]` da a resposta tatil ao
// clique em todas as variantes de destaque.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98]",
  secondary:
    "border border-border bg-card text-foreground hover:bg-muted active:scale-[0.98]",
  ghost: "text-foreground hover:bg-muted active:bg-muted",
  outline:
    "border border-border text-foreground hover:bg-muted active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-6 text-body",
  lg: "h-12 px-8 text-body",
};

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    { variant = "primary", size = "md", className, children, ...props },
    ref,
  ) => {
    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    if ("href" in props && typeof props.href === "string") {
      const { href, ...anchorProps } = props as ButtonAsAnchor;
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    const buttonProps = props as Omit<ButtonAsButton, keyof CommonProps>;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={buttonProps.type ?? "button"}
        className={classes}
        {...buttonProps}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
