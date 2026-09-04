"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Mensagem de erro. Quando presente, ativa o estado visual/aria de erro. */
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, error, id, "aria-describedby": ariaDescribedBy, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = cn(ariaDescribedBy, errorId) || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "bg-card text-body text-foreground placeholder:text-muted-foreground h-11 w-full rounded-md border px-4 transition-[color,background-color,border-color,box-shadow] duration-200",
            "focus-visible:ring-primary focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_var(--s360-glow-blue)] focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-danger"
              : "border-border hover:border-muted-foreground",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="text-small text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
