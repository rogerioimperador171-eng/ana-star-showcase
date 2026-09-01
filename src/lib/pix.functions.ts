import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE_URL = "https://api.propixbr.com";
const TIMEOUT_MS = 20_000;

export type PixDepositResult =
  | {
      ok: true;
      transactionId: string;
      copyPaste: string;
      qrcodeUrl: string | null;
      status: string | null;
    }
  | { ok: false; error: string };

export type PixCheckResult =
  | { ok: true; transactionState: string; paid: boolean }
  | { ok: false; error: string };

function credentials() {
  const clientId = process.env["PROPAY_CLIENT_ID"];
  const clientSecret = process.env["PROPAY_CLIENT_SECRET"];
  if (!clientId || !clientSecret) return null;
  return {
    "x-client-id": clientId,
    "x-client-secret": clientSecret,
    "Content-Type": "application/json",
  };
}

async function callApi(path: string, body: unknown) {
  const headers = credentials();
  if (!headers) {
    return { error: "Pagamento indisponível no momento. Tente novamente em instantes." };
  }
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const text = await response.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      payload = {};
    }
    if (!response.ok) {
      const message =
        (typeof payload["message"] === "string" && payload["message"]) ||
        (typeof payload["error"] === "string" && payload["error"]) ||
        `Falha na comunicação com o provedor de pagamento (${response.status}).`;
      console.error(`propixbr ${path} failed: ${response.status} ${text.slice(0, 500)}`);
      return { error: message };
    }
    return { payload };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error(`propixbr ${path} error`, error);
    return {
      error: timedOut
        ? "O provedor de pagamento demorou para responder. Tente novamente."
        : "Não foi possível gerar o PIX agora. Verifique sua conexão e tente novamente.",
    };
  }
}

function pick(payload: Record<string, unknown>, keys: string[]): string | null {
  const data =
    (payload["data"] as Record<string, unknown> | undefined) ??
    (payload["transaction"] as Record<string, unknown> | undefined) ??
    payload;
  for (const key of keys) {
    const value = data[key] ?? payload[key];
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "object" && value !== null) {
      const nested = value as Record<string, unknown>;
      for (const k of keys) {
        const v = nested[k];
        if (typeof v === "string" && v.length > 0) return v;
      }
    }
  }
  return null;
}

export const createPixDeposit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        amount: z.number().positive().max(100000),
        description: z.string().min(1).max(140),
        payerName: z.string().min(3).max(120),
        payerDocument: z.string().min(11).max(18),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<PixDepositResult> => {
    const result = await callApi("/api/v1/deposit", {
      amount: data.amount,
      description: data.description,
      payerName: data.payerName,
      payerDocument: data.payerDocument.replace(/\D/g, ""),
    });
    if ("error" in result) return { ok: false, error: result.error };

    const transactionId = pick(result.payload, ["transactionId", "id", "transaction_id"]);
    const copyPaste = pick(result.payload, [
      "copyPaste",
      "copypaste",
      "copy_paste",
      "qrcode",
      "emv",
      "pixCopiaECola",
    ]);
    if (!transactionId || !copyPaste) {
      console.error("propixbr deposit missing fields", JSON.stringify(result.payload).slice(0, 500));
      return { ok: false, error: "Resposta inesperada do provedor de pagamento. Tente novamente." };
    }
    return {
      ok: true,
      transactionId,
      copyPaste,
      qrcodeUrl: pick(result.payload, ["qrcodeUrl", "qrCodeUrl", "qrcode_url", "qrCodeImage"]),
      status: pick(result.payload, ["status", "transactionState"]),
    };
  });

export const checkPixStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ transactionId: z.string().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data }): Promise<PixCheckResult> => {
    const result = await callApi("/api/v1/check", { transactionId: data.transactionId });
    if ("error" in result) return { ok: false, error: result.error };

    const state =
      pick(result.payload, ["transactionState", "state", "status"]) ?? "AGUARDANDO";
    return { ok: true, transactionState: state, paid: state.toUpperCase() === "COMPLETO" };
  });
