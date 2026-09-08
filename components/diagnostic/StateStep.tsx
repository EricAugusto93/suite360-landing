import type { RefObject } from "react";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { STATE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/cn";
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
 *
 * ETAPA 4B: bloco widened para acompanhar a largura-alvo das etapas 3-5
 * (560-680px, aqui 620px) — muito mais presença que o antigo `max-w-sm`
 * (384px), reduzindo a area vazia lateral dentro do console. Superficie do
 * `<select>` (altura/radius/gradiente/borda) ajustada via `className`
 * repassado ao componente `Select` (que continua intocado — `Input.tsx`/
 * `Select.tsx` estao fora do escopo desta etapa): como esse componente
 * concatena classes sem `tailwind-merge` (ver `lib/cn.ts`), os overrides
 * que colidem com as classes proprias do `Select` (altura, radius, fundo,
 * borda) usam o modificador `!` do Tailwind para vencer de forma
 * deterministica, em vez de depender da ordem de geracao do CSS. A borda
 * de erro (`border-danger`, definida dentro do proprio `Select` quando
 * `error` esta presente) nunca e sobrescrita — o override de borda so e
 * aplicado quando NAO ha erro.
 */
export function StateStep({ titleRef, value, error, onChange }: StateStepProps) {
  return (
    <div className="mx-auto flex w-full flex-col gap-6 sm:max-w-[620px]">
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
          className={cn(
            "!h-14 !rounded-[14px] !bg-[linear-gradient(165deg,rgba(20,22,28,0.92)_0%,rgba(11,13,18,0.96)_100%)] !text-[15px]",
            error
              ? ""
              : "!border-[rgba(103,140,255,0.16)] hover:!border-primary/40 focus-visible:!border-primary",
          )}
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
