import { cloneScenarioPresets } from "./scenarios";
import type {
  CalculatorMode,
  CostInputs,
  JCurveParams,
  ScenarioAssumptions,
  ScenarioType,
  UXMetric,
} from "./types";

/** Query param key for the encoded calculator state. */
export const SHARE_QUERY_KEY = "s";

export interface ShareableState {
  v: 1;
  mode: CalculatorMode;
  costs: CostInputs;
  metrics: UXMetric[];
  jCurve: JCurveParams;
  scenarios: Record<ScenarioType, ScenarioAssumptions>;
}

export function createDefaultShareableState(
  partial?: Partial<Omit<ShareableState, "v">>,
): ShareableState {
  return {
    v: 1,
    mode: "simple",
    costs: { seatCount: 25, costPerSeatPerMonth: 40 },
    metrics: [],
    jCurve: {
      dipDurationMonths: 2,
      dipSeverity: 0.4,
      rampDurationMonths: 3,
      steadyStateMultiplier: 1.1,
    },
    scenarios: cloneScenarioPresets(),
    ...partial,
  };
}

/** Encode calculator state for a shareable URL query value (base64url JSON). */
export function serializeShareState(state: ShareableState): string {
  const json = JSON.stringify(state);
  return base64UrlEncode(json);
}

/** Decode share state from a query value. Returns null if missing or invalid. */
export function deserializeShareState(encoded: string | null | undefined): ShareableState | null {
  if (!encoded) return null;
  try {
    const json = base64UrlDecode(encoded);
    const parsed: unknown = JSON.parse(json);
    if (!isShareableState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Read share state from a URLSearchParams / query string. */
export function parseShareStateFromSearch(search: string | URLSearchParams): ShareableState | null {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  return deserializeShareState(params.get(SHARE_QUERY_KEY));
}

/** Build a full URL that reconstitutes the given state. */
export function buildShareUrl(state: ShareableState, baseUrl: string = ""): string {
  const url = new URL(baseUrl || "http://localhost/ai-lab/roi-compass/");
  url.searchParams.set(SHARE_QUERY_KEY, serializeShareState(state));
  return url.toString();
}

function isShareableState(value: unknown): value is ShareableState {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (record.v !== 1) return false;
  if (record.mode !== "simple" && record.mode !== "advanced") return false;
  if (!record.costs || typeof record.costs !== "object") return false;
  if (!Array.isArray(record.metrics)) return false;
  if (!record.jCurve || typeof record.jCurve !== "object") return false;
  if (!record.scenarios || typeof record.scenarios !== "object") return false;
  return true;
}

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLength);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
