import type { RefObject } from "react";
import { cn } from "@/lib/cn";
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
      {/*
        ETAPA 4A: texto de apoio agrupado com a pergunta (gap-2, mesmo bloco
        centralizado) — mais proximo dela do que do grid de opcoes logo
        abaixo (que continua no gap-6 do container externo).
      */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h3
          ref={titleRef}
          tabIndex={-1}
          className="text-h3 font-semibold focus:outline-none"
        >
          Qual é o segmento da sua empresa?
        </h3>
        <p className="text-muted-foreground max-w-sm text-[15px] leading-relaxed sm:text-[16px]">
          Selecione a opção que melhor representa o seu negócio.
        </p>
      </div>

      <div
        role="group"
        aria-label="Segmento da empresa"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {SEGMENT_OPTIONS.map(({ value: option, label, icon: Icon }) => {
          const selected = value === option;
          return (
            <OptionCard
              key={option}
              selected={selected}
              onClick={() => onSelect(option)}
            >
              <Icon
                size={24}
                className={cn(
                  "transition-colors duration-200",
                  selected
                    ? "text-primary drop-shadow-[0_0_5px_rgba(8,102,255,0.6)]"
                    : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span className="text-small font-medium">{label}</span>
            </OptionCard>
          );
        })}
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
