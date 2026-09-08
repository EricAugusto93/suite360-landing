import type { RefObject } from "react";
import { Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/cn";

type TextFieldStepProps = {
  titleRef: RefObject<HTMLHeadingElement | null>;
  /** Identificador estavel para o id do input (ex.: "city", "company"). */
  fieldId: string;
  question: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
};

/**
 * Etapas de Cidade e Empresa sao, na pratica, "uma pergunta + um input" —
 * simples e identicas em estrutura o suficiente para nao justificar dois
 * arquivos quase iguais (CityStep/CompanyStep). Este componente cobre
 * ambas via props; a diferenca de conteudo fica no `DiagnosticWizard`.
 *
 * ETAPA 4B: bloco widened para 560-680px (aqui 620px, `sm:max-w-[620px]`),
 * icone contextual (MapPin para "city", Building2 para "company") derivado
 * do `fieldId` — a mesma prop ja usada para montar o `id` do input, nunca
 * do texto da pergunta (comparacao fragil que quebraria se o texto mudasse)
 * — e superficie do `<input>` (altura/radius/gradiente/borda) ajustada via
 * `className` repassado ao componente `Input` (nao alterado nesta etapa).
 * Como `lib/cn.ts` so concatena classes (sem `tailwind-merge`), os
 * overrides que colidem com as classes proprias do `Input` usam `!` para
 * vencer de forma deterministica; a borda de erro (`border-danger`) nunca e
 * sobrescrita — o override de borda so entra quando NAO ha erro. O icone
 * fica num wrapper `group relative`, `aria-hidden`, `pointer-events-none`,
 * e muda de cor no foco via `group-focus-within` (o `:focus-within` do
 * wrapper capta o foco do `<input>` mesmo estando dois niveis abaixo, sem
 * precisar de estado em JS).
 */
export function TextFieldStep({
  titleRef,
  fieldId,
  question,
  label,
  placeholder,
  autoComplete,
  value,
  error,
  onChange,
}: TextFieldStepProps) {
  const inputId = `diagnostic-${fieldId}`;
  const Icon =
    fieldId === "city" ? MapPin : fieldId === "company" ? Building2 : null;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 sm:max-w-[620px]">
      <h3
        ref={titleRef}
        tabIndex={-1}
        className="text-h3 text-center font-semibold focus:outline-none"
      >
        {question}
      </h3>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <div className="group relative">
          {Icon && (
            <Icon
              size={18}
              aria-hidden="true"
              className="text-muted-foreground group-focus-within:text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-colors duration-200"
            />
          )}
          <Input
            id={inputId}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={value}
            error={error ?? undefined}
            onChange={(event) => onChange(event.target.value)}
            className={cn(
              "!h-14 !rounded-[14px] !bg-[linear-gradient(165deg,rgba(20,22,28,0.92)_0%,rgba(11,13,18,0.96)_100%)] !text-[15px]",
              Icon ? "!pl-11" : "",
              error
                ? ""
                : "!border-[rgba(103,140,255,0.16)] hover:!border-primary/40 focus-visible:!border-primary",
            )}
          />
        </div>
      </div>
    </div>
  );
}
