"use client";

import type { RefObject } from "react";
import { Card } from "@/components/ui/Card";
import { WhatsAppLinkButton } from "@/components/ui/WhatsAppLinkButton";
import { resolveStateLabel } from "@/lib/constants";
import type { DiagnosticData } from "@/lib/types";
import {
  buildDiagnosticMessage,
  isWhatsAppConfigured,
  resolveSegmentLabel,
} from "@/lib/whatsapp";
import { STEP_ORDER } from "./diagnosticReducer";

type ConfirmationStepProps = {
  titleRef: RefObject<HTMLHeadingElement | null>;
  data: DiagnosticData;
  onEditStep: (stepIndex: number) => void;
};

/**
 * CTA final: quando o WhatsApp esta configurado, o clique abre a conversa
 * de verdade (via WhatsAppLinkButton, que centraliza essa decisao) — nao
 * ha mais um estado "enviado" fictício (FASE 05) simulando uma acao que
 * nao acontecia. Sem numero configurado, o botao fica desabilitado — aqui,
 * ao contrario do Hero/CTA final (FASE 12), o botao NAO e omitido: e o
 * unico caminho de conversao desta etapa, entao precisa de alguma
 * explicacao para nao parecer quebrado. A legenda foi revisada na FASE 12
 * para um tom de status operacional ("indisponivel no momento"), em vez de
 * expor um roteiro de lancamento ("sera ativado em breve") — ver
 * PLANEJAMENTO.md, secao 14.12.
 */
export function ConfirmationStep({
  titleRef,
  data,
  onEditStep,
}: ConfirmationStepProps) {
  const rows = [
    {
      label: "Empresa",
      value: data.companyName,
      stepIndex: STEP_ORDER.indexOf("company"),
    },
    {
      label: "Segmento",
      value: resolveSegmentLabel(data),
      stepIndex: STEP_ORDER.indexOf("segment"),
    },
    {
      label: "Porte",
      value: data.size ?? "",
      stepIndex: STEP_ORDER.indexOf("size"),
    },
    {
      label: "Estado",
      value: resolveStateLabel(data.estado),
      stepIndex: STEP_ORDER.indexOf("state"),
    },
    {
      label: "Cidade",
      value: data.city,
      stepIndex: STEP_ORDER.indexOf("city"),
    },
  ];

  const configured = isWhatsAppConfigured();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h3
          ref={titleRef}
          tabIndex={-1}
          className="text-h3 font-semibold focus:outline-none"
        >
          Pronto. Vamos analisar seu cenário.
        </h3>
        <p className="text-body text-muted-foreground">
          Confira os dados abaixo antes de continuar.
        </p>
      </div>

      <Card className="divide-border flex flex-col divide-y p-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex flex-col text-left">
              <span className="text-caption text-muted-foreground">
                {row.label}
              </span>
              <span className="text-body font-medium">{row.value}</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(row.stepIndex)}
              className="text-small text-primary focus-visible:ring-primary focus-visible:ring-offset-background shrink-0 rounded-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Editar
            </button>
          </div>
        ))}
      </Card>

      <div className="flex flex-col items-center gap-3">
        <WhatsAppLinkButton
          message={buildDiagnosticMessage(data)}
          source="diagnostic"
          variant="primary"
          size="lg"
          className="w-full"
        >
          Consultar meu diagnóstico gratuito
        </WhatsAppLinkButton>

        {!configured ? (
          <p className="text-small text-muted-foreground text-center">
            Atendimento pelo WhatsApp indisponível no momento.
          </p>
        ) : null}
      </div>
    </div>
  );
}
