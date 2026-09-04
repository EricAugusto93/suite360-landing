"use client";

import { useEffect, useReducer, useRef } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { trackEvent } from "@/lib/analytics";
import type { DiagnosticStepId } from "@/lib/types";
import { ConfirmationStep } from "./ConfirmationStep";
import {
  STEP_ORDER,
  diagnosticReducer,
  initialDiagnosticState,
  validateStep,
} from "./diagnosticReducer";
import { SegmentStep } from "./SegmentStep";
import { SizeStep } from "./SizeStep";
import { StateStep } from "./StateStep";
import { TextFieldStep } from "./TextFieldStep";

const STEP_LABELS: Record<DiagnosticStepId, string> = {
  segment: "Segmento",
  size: "Porte",
  state: "Estado",
  city: "Cidade",
  company: "Empresa",
  confirmation: "Confirmação",
};

const STEP_TRANSITION: Transition = { duration: 0.18, ease: [0.16, 1, 0.3, 1] };

export function DiagnosticWizard() {
  const [state, dispatch] = useReducer(
    diagnosticReducer,
    initialDiagnosticState,
  );
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lastFocusedStepIndexRef = useRef(state.stepIndex);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const currentStepId = STEP_ORDER[state.stepIndex];
  const stepNumber = state.stepIndex + 1;
  const totalSteps = STEP_ORDER.length;

  /**
   * Dispara `diagnostic_start` na primeira interacao efetiva (selecionar
   * uma opcao, digitar um campo) — nunca no mount/entrada na viewport
   * (FASE 11, secao "Diagnostico iniciado": evitar disparar so porque a
   * secao apareceu na tela). Guardado por ref para disparar uma unica vez
   * por experiencia, sem precisar de persistencia entre reloads.
   */
  function markStarted() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackEvent("diagnostic_start");
  }

  // Move o foco para a pergunta da nova etapa — mas nao no primeiro
  // carregamento (evita "roubar" o foco/scroll de quem so abriu a pagina).
  // Compara o INDICE anterior com o atual (nao um booleano "primeira vez")
  // de proposito: um guard booleano do tipo `isFirstRender` e corrompido
  // pelo double-invoke de efeitos do React Strict Mode em desenvolvimento
  // (o efeito roda, marca "ja rodou", e roda de novo imediatamente —
  // na segunda vez o guard ja estava "gasto" e o foco disparava no mount,
  // rolando a pagina inteira ate o diagnostico). Comparar valores e imune
  // a quantas vezes o efeito reexecuta com o mesmo stepIndex.
  useEffect(() => {
    if (lastFocusedStepIndexRef.current !== state.stepIndex) {
      titleRef.current?.focus();
    }
    lastFocusedStepIndexRef.current = state.stepIndex;
  }, [state.stepIndex]);

  function goNext() {
    const error = validateStep(currentStepId, state.data);
    if (error) {
      dispatch({ type: "SET_ERROR", message: error });
      return;
    }
    const nextIndex = state.stepIndex + 1;
    dispatch({ type: "NEXT" });
    // `step` e a etapa que acabou de ser preenchida/validada (nunca o
    // valor digitado — so o identificador da etapa, ver lib/types.ts).
    trackEvent("diagnostic_step_complete", { step: currentStepId });
    if (STEP_ORDER[nextIndex] === "confirmation" && !hasCompletedRef.current) {
      // Guardado por ref: se o visitante editar e retornar a confirmacao,
      // a conclusao nao e contada de novo (FASE 11, secao 36).
      hasCompletedRef.current = true;
      trackEvent("diagnostic_complete");
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (currentStepId !== "confirmation") {
      goNext();
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-label text-muted-foreground font-medium">
          Etapa {stepNumber} de {totalSteps}
        </p>
        <Progress
          value={(stepNumber / totalSteps) * 100}
          label={`Etapa ${stepNumber} de ${totalSteps}: ${STEP_LABELS[currentStepId]}`}
        />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/*
          `layout` anima a altura do container conforme o conteudo real de
          cada etapa muda (grid de segmento é mais alto que um input isolado),
          em vez de travar todas as etapas numa altura minima fixa — o que
          deixava espaco vazio grande nas etapas mais curtas. `popLayout`
          remove a etapa que sai do fluxo imediatamente, para nao inflar a
          medicao de altura durante a transicao.
        */}
        <motion.div layout={!shouldReduceMotion} transition={STEP_TRANSITION}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentStepId}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={STEP_TRANSITION}
            >
              {currentStepId === "segment" && (
                <SegmentStep
                  titleRef={titleRef}
                  value={state.data.segment}
                  customValue={state.data.customSegment}
                  error={state.error}
                  onSelect={(segment) => {
                    markStarted();
                    dispatch({ type: "SELECT_SEGMENT", segment });
                  }}
                  onCustomChange={(value) => {
                    markStarted();
                    dispatch({ type: "SET_CUSTOM_SEGMENT", value });
                  }}
                />
              )}

              {currentStepId === "size" && (
                <SizeStep
                  titleRef={titleRef}
                  value={state.data.size}
                  error={state.error}
                  onSelect={(size) => {
                    markStarted();
                    dispatch({ type: "SELECT_SIZE", size });
                  }}
                />
              )}

              {currentStepId === "state" && (
                <StateStep
                  titleRef={titleRef}
                  value={state.data.estado}
                  error={state.error}
                  onChange={(estado) => {
                    markStarted();
                    dispatch({ type: "SELECT_STATE", estado });
                  }}
                />
              )}

              {currentStepId === "city" && (
                <TextFieldStep
                  titleRef={titleRef}
                  fieldId="city"
                  question="Em qual cidade sua empresa está?"
                  label="Cidade"
                  placeholder="Ex: Curitiba"
                  autoComplete="address-level2"
                  value={state.data.city}
                  error={state.error}
                  onChange={(value) => {
                    markStarted();
                    dispatch({ type: "SET_CITY", value });
                  }}
                />
              )}

              {currentStepId === "company" && (
                <TextFieldStep
                  titleRef={titleRef}
                  fieldId="company"
                  question="Qual é o nome da sua empresa?"
                  label="Nome da empresa"
                  placeholder="Ex: Barbearia Central"
                  autoComplete="organization"
                  value={state.data.companyName}
                  error={state.error}
                  onChange={(value) => {
                    markStarted();
                    dispatch({ type: "SET_COMPANY", value });
                  }}
                />
              )}

              {currentStepId === "confirmation" && (
                <ConfirmationStep
                  titleRef={titleRef}
                  data={state.data}
                  onEditStep={(index) => dispatch({ type: "GOTO", index })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {currentStepId !== "confirmation" ? (
          <div className="mt-8 flex items-center justify-between gap-4">
            {state.stepIndex > 0 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => dispatch({ type: "BACK" })}
              >
                <ArrowLeft size={16} />
                Voltar
              </Button>
            ) : (
              <span aria-hidden="true" />
            )}

            <Button type="submit" variant="primary">
              Avançar
              <ArrowRight size={16} />
            </Button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
