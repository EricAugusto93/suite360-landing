import { DIAGNOSTIC_STEP_IDS } from "@/lib/types";
import type {
  BusinessSize,
  DiagnosticData,
  DiagnosticStepId,
  Segment,
  UF,
} from "@/lib/types";

export const STEP_ORDER: readonly DiagnosticStepId[] = DIAGNOSTIC_STEP_IDS;

export type DiagnosticState = {
  stepIndex: number;
  data: DiagnosticData;
  error: string | null;
};

export const initialDiagnosticState: DiagnosticState = {
  stepIndex: 0,
  data: {
    segment: null,
    customSegment: "",
    size: null,
    estado: null,
    city: "",
    companyName: "",
  },
  error: null,
};

export type DiagnosticAction =
  | { type: "SELECT_SEGMENT"; segment: Segment }
  | { type: "SET_CUSTOM_SEGMENT"; value: string }
  | { type: "SELECT_SIZE"; size: BusinessSize }
  | { type: "SELECT_STATE"; estado: UF }
  | { type: "SET_CITY"; value: string }
  | { type: "SET_COMPANY"; value: string }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GOTO"; index: number }
  | { type: "SET_ERROR"; message: string };

/**
 * Validacao humana e simples (PLANEJAMENTO.md / instrucao da FASE 05,
 * secao 17) — mensagens diretas, sem jargao tecnico. Fica fora do reducer
 * (que so aplica transicoes de estado) para que o componente que dispara
 * "NEXT" possa decidir, com o mesmo resultado, se tambem deve registrar um
 * evento de analytics.
 */
export function validateStep(
  step: DiagnosticStepId,
  data: DiagnosticData,
): string | null {
  switch (step) {
    case "segment":
      if (!data.segment) return "Selecione o segmento da sua empresa.";
      if (data.segment === "Outro" && data.customSegment.trim().length === 0) {
        return "Informe o segmento da sua empresa.";
      }
      return null;
    case "size":
      return data.size ? null : "Selecione o porte da sua empresa.";
    case "state":
      return data.estado ? null : "Selecione o estado da sua empresa.";
    case "city":
      return data.city.trim().length > 0
        ? null
        : "Informe a cidade da sua empresa.";
    case "company":
      return data.companyName.trim().length > 0
        ? null
        : "Informe o nome da sua empresa.";
    case "confirmation":
      return null;
  }
}

export function diagnosticReducer(
  state: DiagnosticState,
  action: DiagnosticAction,
): DiagnosticState {
  switch (action.type) {
    case "SELECT_SEGMENT":
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          segment: action.segment,
          customSegment:
            action.segment === "Outro" ? state.data.customSegment : "",
        },
      };
    case "SET_CUSTOM_SEGMENT":
      return {
        ...state,
        error: null,
        data: { ...state.data, customSegment: action.value },
      };
    case "SELECT_SIZE":
      return {
        ...state,
        error: null,
        data: { ...state.data, size: action.size },
      };
    case "SELECT_STATE":
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          estado: action.estado,
          // Estado alterado invalida a cidade ja preenchida (pode nao
          // existir no novo estado) — forca reentrada na proxima etapa.
          city:
            action.estado === state.data.estado ? state.data.city : "",
        },
      };
    case "SET_CITY":
      return {
        ...state,
        error: null,
        data: { ...state.data, city: action.value },
      };
    case "SET_COMPANY":
      return {
        ...state,
        error: null,
        data: { ...state.data, companyName: action.value },
      };
    case "NEXT":
      return {
        ...state,
        error: null,
        stepIndex: Math.min(state.stepIndex + 1, STEP_ORDER.length - 1),
      };
    case "BACK":
      return {
        ...state,
        error: null,
        stepIndex: Math.max(state.stepIndex - 1, 0),
      };
    case "GOTO":
      return {
        ...state,
        error: null,
        stepIndex: Math.min(Math.max(action.index, 0), STEP_ORDER.length - 1),
      };
    case "SET_ERROR":
      return { ...state, error: action.message };
  }
}
