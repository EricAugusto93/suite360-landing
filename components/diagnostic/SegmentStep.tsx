import type { RefObject } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SEGMENT_OPTIONS } from "@/lib/constants";
import type { Segment } from "@/lib/types";
import { OptionCard } from "./OptionCard";

type SegmentStepProps = {
  titleRef: RefObject<HTMLHeadingElement | null>;
  value: Segment | null;
  customValue: string;
  error: string | null;
  onSelect: (segment: Segment) => void;
  onCustomChange: (value: string) => void;
};

export function SegmentStep({
  titleRef,
  value,
  customValue,
  error,
  onSelect,
  onCustomChange,
}: SegmentStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3
        ref={titleRef}
        tabIndex={-1}
        className="text-h3 text-center font-semibold focus:outline-none"
      >
        Qual é o segmento da sua empresa?
      </h3>

      <div
        role="group"
        aria-label="Segmento da empresa"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {SEGMENT_OPTIONS.map(({ value: option, label, icon: Icon }) => (
          <OptionCard
            key={option}
            selected={value === option}
            onClick={() => onSelect(option)}
          >
            <Icon
              size={20}
              className="text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-small font-medium">{label}</span>
          </OptionCard>
        ))}
      </div>

      {value === "Outro" && (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-1.5">
          <Label htmlFor="diagnostic-custom-segment">Qual é o segmento?</Label>
          <Input
            id="diagnostic-custom-segment"
            placeholder="Ex: Salão de beleza"
            value={customValue}
            onChange={(event) => onCustomChange(event.target.value)}
          />
        </div>
      )}

      {error ? (
        <p role="alert" className="text-small text-danger text-center">
          {error}
        </p>
      ) : null}
    </div>
  );
}
