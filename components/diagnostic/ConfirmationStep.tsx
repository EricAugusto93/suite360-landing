"use client";

import type { RefObject } from "react";
import { ClipboardCheck } from "lucide-react";
import { WhatsAppLinkButton } from "@/components/ui/WhatsAppLinkButton";
import { cn } from "@/lib/cn";
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
 *
 * ETAPA 4B: fechamento premium do console — cabecalho com icone decorativo
 * (nenhuma celebracao/confete/metrica, so um icone de confirmacao), resumo
 * transformado de uma unica caixa com divisores num grid de "cards" de
 * revisao individuais (2 colunas no desktop quando 5 itens cabem
 * equilibrados — 2+2+1, o ultimo ocupando a largura toda; 1 coluna no
 * mobile), e o CTA final corrigido para nao quebrar de forma apertada no
 * mobile (altura flexivel com `min-height`, em vez de uma altura fixa que
 * cortava o texto em duas linhas). Nenhum dos 5 valores reais, links
 * Editar, texto do CTA ou logica de WhatsApp foi alterado — so a moldura
 * visual em volta deles.
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
    <div className="mx-auto flex w-full flex-col gap-7 sm:max-w-[600px]">
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          aria-hidden="true"
          className="border-primary/30 bg-accent text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
        >
          <ClipboardCheck size={20} />
        </span>
        <div className="flex flex-col gap-2">
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
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={cn(
              "flex items-start justify-between gap-3 rounded-xl border border-[rgba(103,140,255,0.14)] bg-[linear-gradient(165deg,rgba(20,22,28,0.85)_0%,rgba(11,13,18,0.92)_100%)] px-4 py-3.5",
              index === rows.length - 1 ? "sm:col-span-2" : "",
            )}
          >
            <div className="flex min-w-0 flex-col gap-1 text-left">
              <span className="text-caption text-muted-foreground tracking-wide uppercase">
                {row.label}
              </span>
              <span className="text-body text-foreground font-semibold break-words">
                {row.value}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(row.stepIndex)}
              className="text-primary focus-visible:ring-primary focus-visible:ring-offset-background text-small shrink-0 rounded-md px-2 py-1 font-medium transition-colors duration-200 hover:bg-primary/10 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Editar
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <WhatsAppLinkButton
          message={buildDiagnosticMessage(data)}
          source="diagnostic"
          variant="primary"
          size="lg"
          className="!h-auto w-full !min-h-[60px] !px-6 !py-3 !text-[14px] !leading-snug text-center sm:w-auto sm:!min-h-[56px] sm:!px-10 sm:!text-[15px]"
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
