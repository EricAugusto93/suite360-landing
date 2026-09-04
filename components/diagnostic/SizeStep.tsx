import type { RefObject } from "react";
import { SIZE_OPTIONS } from "@/lib/constants";
import type { BusinessSize } from "@/lib/types";
import { OptionCard } from "./OptionCard";

type SizeStepProps = {
  titleRef: RefObject<HTMLHeadingElement | null>;
  value: BusinessSize | null;
  error: string | null;
  onSelect: (size: BusinessSize) => void;
};

export function SizeStep({ titleRef, value, error, onSelect }: SizeStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3
        ref={titleRef}
        tabIndex={-1}
        className="text-h3 text-center font-semibold focus:outline-none"
      >
        Qual o porte da sua empresa?
      </h3>

      <div
        role="group"
        aria-label="Porte da empresa"
        className="mx-auto grid w-full max-w-sm grid-cols-3 gap-3"
      >
        {SIZE_OPTIONS.map((size) => (
          <OptionCard
            key={size}
            selected={value === size}
            onClick={() => onSelect(size)}
          >
            <span className="text-body font-medium">{size}</span>
          </OptionCard>
        ))}
      </div>

      {error ? (
        <p role="alert" className="text-small text-danger text-center">
          {error}
        </p>
      ) : null}
    </div>
  );
}
