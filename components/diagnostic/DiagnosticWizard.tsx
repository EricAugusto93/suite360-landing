"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import type { DiagnosticStepId } from "@/lib/types";
import { useIsMobileViewport } from "@/lib/useIsMobileViewport";
import { ConfirmationStep } from "./ConfirmationStep";
import {
  STEP_ORDER,
  diagnosticReducer,
  initialDiagnosticState,
  validateStep,
} from "./diagnosticReducer";
import { SegmentedProgress } from "./SegmentedProgress";
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

// ETAPA 5 — duracao alinhada ao alvo explicito desta etapa (0.4s-0.6s;
// era 0.18s, rapida demais). Compartilhada pelo fade/slide de entrada e
// saida das etapas E pela altura animada do container (`motion.div layout`
// mais abaixo) — um unico numero para as duas coisas mantem o "morph" de
// altura e o conteudo sincronizados. Sob `prefers-reduced-motion`,
// `buildStepVariants` ja retorna estados identicos (sem interpolacao
// visivel) independente desta duracao — nenhum ajuste extra necessario
// para o movimento reduzido continuar instantaneo.
const STEP_TRANSITION: Transition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

type SlideDirection = 1 | -1;

/**
 * No mobile, a transicao entre etapas desliza horizontalmente (avancar:
 * etapa nova entra da direita, etapa antiga sai pela esquerda; voltar:
 * sentido invertido) — pedido explicito do usuario. No desktop/tablet o
 * comportamento continua o mesmo de sempre (leve deslocamento vertical
 * y:8/-8, sem `x`).
 *
 * `custom` (o `direction`) precisa vir do proprio `AnimatePresence`, nao so
 * de uma prop no `motion.div`: quando uma etapa sai da arvore, o React nao
 * a renderiza de novo para atualizar suas props — o `AnimatePresence`
 * guarda a ultima versao renderizada dela. Se o `exit` fosse um objeto (ou
 * uma funcao lendo uma prop comum), a etapa que esta saindo usaria a
 * direcao de QUANDO ELA ENTROU (a transicao anterior), nao a da transicao
 * atual. Como variant-function + `custom` no `AnimatePresence`, o Motion
 * reavalia `exit` com o valor mais recente de `custom` no momento da saida.
 */
function buildStepVariants(isMobile: boolean, reduced: boolean): Variants {
  if (reduced) {
    return {
      enter: { opacity: 1, x: 0, y: 0 },
      center: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 1, x: 0, y: 0 },
    };
  }
  if (!isMobile) {
    return {
      enter: { opacity: 0, x: 0, y: 8 },
      center: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, x: 0, y: -8 },
    };
  }
  return {
    enter: (direction: SlideDirection) => ({
      opacity: 0,
      x: direction === 1 ? 32 : -32,
      y: 0,
    }),
    center: { opacity: 1, x: 0, y: 0 },
    exit: (direction: SlideDirection) => ({
      opacity: 0,
      x: direction === 1 ? -32 : 32,
      y: 0,
    }),
  };
}

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
  const isMobile = useIsMobileViewport();
  // Atualizado em cada handler (goNext/BACK/GOTO) — nunca lido/escrito
  // durante a renderizacao (o lint de refs acusa isso, com razao: um ref
  // nao dispara rerender por si so, entao o `custom` do AnimatePresence
  // ficaria um passo atrasado). `useState` aqui e o certo: o valor so
  // importa para a proxima renderizacao apos o clique, nunca antes.
  const [slideDirection, setSlideDirection] = useState<SlideDirection>(1);
  // ETAPA 5 — auditoria de cliques rapidos encontrou um problema real: um
  // duplo-clique em Avancar (ou Avancar seguido imediatamente de Voltar)
  // dispara duas transicoes de etapa sobrepostas antes da primeira
  // terminar. Isso nao pula etapa nem duplica analytics (o reducer e
  // `hasCompletedRef` ja protegem isso), mas confirmado via
  // `elementFromPoint` que o navegador chega a pintar a barra superior do
  // console (`DiagnosticSection.tsx`) na posicao de outro elemento
  // completamente diferente ate a pagina ser recarregada — um dessincronia
  // de composicao do Chromium sob layout animations sobrepostas (Motion
  // `layout`/`popLayout`), nao um bug de CSS/layout do codigo em si (nenhum
  // `transform` residual em nenhum elemento da cadeia; nem scroll, resize
  // ou hover corrigem sozinhos). A correcao minima e impedir que uma
  // segunda transicao comece antes da primeira acabar — um debounce simples
  // por tempo (janela igual a `STEP_TRANSITION.duration` + folga),
  // aplicado tanto no dispatch (`goNext`/Voltar/Editar, entao Enter durante
  // a transicao tambem e ignorado) quanto visualmente (Avancar/Voltar
  // desabilitados enquanto `isTransitioning`).
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Guarda de LEITURA/ESCRITA sincrona (ref) separada do `isTransitioning`
  // de estado: o valor de estado so fica visivel para handlers em uma
  // RENDERIZACAO futura (React agrupa a atualizacao), entao dois cliques
  // disparados antes desse re-render enxergam a MESMA closure com
  // `isTransitioning=false` — o `if (isTransitioning) return` sozinho nao
  // bloqueia o segundo clique a tempo. O ref e lido/escrito imediatamente,
  // sem esperar um render, entao bloqueia o segundo clique de verdade; o
  // estado continua existindo so para o feedback visual (`disabled` nos
  // botoes), que pode acompanhar um render depois sem problema.
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  function beginTransition() {
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 500);
  }

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

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
    if (isTransitioningRef.current) return;
    const error = validateStep(currentStepId, state.data);
    if (error) {
      dispatch({ type: "SET_ERROR", message: error });
      return;
    }
    const nextIndex = state.stepIndex + 1;
    setSlideDirection(1);
    beginTransition();
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
      <SegmentedProgress
        currentStep={stepNumber}
        totalSteps={totalSteps}
        label={`Etapa ${stepNumber} de ${totalSteps}: ${STEP_LABELS[currentStepId]}`}
      />

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
          <AnimatePresence
            initial={false}
            mode="popLayout"
            custom={slideDirection}
          >
            <motion.div
              key={currentStepId}
              variants={buildStepVariants(isMobile, Boolean(shouldReduceMotion))}
              initial="enter"
              animate="center"
              exit="exit"
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
                  onEditStep={(index) => {
                    if (isTransitioningRef.current) return;
                    setSlideDirection(-1);
                    beginTransition();
                    dispatch({ type: "GOTO", index });
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {currentStepId !== "confirmation" ? (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/*
              ETAPA 4A — aviso de tempo, no rodape compartilhado por todas as
              etapas do formulario (nunca aparece na confirmacao, ja que
              este bloco inteiro so renderiza quando `currentStepId !==
              "confirmation"`). Icone decorativo (`aria-hidden`): o texto
              sozinho ja comunica o significado.
            */}
            <div className="text-muted-foreground flex items-center gap-2 text-[0.8125rem] sm:text-[0.875rem]">
              <ShieldCheck
                size={16}
                className="text-primary shrink-0"
                aria-hidden="true"
              />
              <span>Leva menos de 2 minutos</span>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              {state.stepIndex > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isTransitioning}
                  onClick={() => {
                    if (isTransitioningRef.current) return;
                    setSlideDirection(-1);
                    beginTransition();
                    dispatch({ type: "BACK" });
                  }}
                >
                  <ArrowLeft size={16} />
                  Voltar
                </Button>
              ) : (
                <span aria-hidden="true" />
              )}

              <Button type="submit" variant="primary" disabled={isTransitioning}>
                Avançar
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
