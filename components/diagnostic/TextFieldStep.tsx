import type { RefObject } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

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

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <h3
        ref={titleRef}
        tabIndex={-1}
        className="text-h3 text-center font-semibold focus:outline-none"
      >
        {question}
      </h3>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <Input
          id={inputId}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          error={error ?? undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
