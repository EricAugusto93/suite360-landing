import type { RefObject } from "react";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { STATE_OPTIONS } from "@/lib/constants";
import type { UF } from "@/lib/types";

type StateStepProps = {
  titleRef: RefObject<HTMLHeadingElement | null>;
  value: UF | null;
  error: string | null;
  onChange: (value: UF) => void;
};

/**
 * Etapa "Estado" — vem antes de Cidade (pedido explicito do usuario).
 * Sigla (UF) e o valor selecionado/persistido; o select mostra o nome
 * completo de cada estado (lib/constants.ts, STATE_OPTIONS).
 */
export function StateStep({ titleRef, value, error, onChange }: StateStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <h3
        ref={titleRef}
        tabIndex={-1}
        className="text-h3 text-center font-semibold focus:outline-none"
      >
        Em qual estado sua empresa está?
      </h3>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="diagnostic-state">Estado</Label>
        <Select
          id="diagnostic-state"
          value={value ?? ""}
          error={error ?? undefined}
          onChange={(event) => onChange(event.target.value as UF)}
        >
          <option value="" disabled>
            Selecione o estado
          </option>
          {STATE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
