import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, QrCode, RefreshCw, AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPixDeposit, checkPixStatus } from "@/lib/pix.functions";

const AMOUNT = 29.9;
const DESCRIPTION = "Kit Sobrevivência Ana Castela — Edição Barretos 2026";

type Step = "form" | "pix" | "paid";

function maskDocument(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function PixCheckout({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const deposit = useServerFn(createPixDeposit);
  const check = useServerFn(checkPixStatus);

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pix, setPix] = useState<{ transactionId: string; copyPaste: string; qrcodeUrl: string | null } | null>(
    null,
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  useEffect(() => {
    if (step !== "pix" || !pix) return;
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const result = await check({ data: { transactionId: pix.transactionId } });
        if (result.ok && result.paid) {
          stopPolling();
          setStep("paid");
        }
      } catch {
        /* silencioso: mantém o polling ativo */
      }
    }, 3000);
    return stopPolling;
  }, [step, pix, check, stopPolling]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = document.replace(/\D/g, "");
    if (name.trim().length < 3) return setError("Informe seu nome completo.");
    if (digits.length !== 11 && digits.length !== 14) return setError("Informe um CPF ou CNPJ válido.");

    setLoading(true);
    try {
      const result = await deposit({
        data: { amount: AMOUNT, description: DESCRIPTION, payerName: name.trim(), payerDocument: digits },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPix({ transactionId: result.transactionId, copyPaste: result.copyPaste, qrcodeUrl: result.qrcodeUrl });
      setStep("pix");
    } catch {
      setError("Não foi possível gerar o PIX agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.copyPaste);
    } catch {
      const el = window.document.createElement("textarea");
      el.value = pix.copyPaste;
      window.document.body.appendChild(el);
      el.select();
      window.document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function reset() {
    stopPolling();
    setStep("form");
    setPix(null);
    setError(null);
    setLoading(false);
  }

  const qrSrc =
    pix?.qrcodeUrl ??
    (pix
      ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(pix.copyPaste)}`
      : "");

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl tracking-wide">
            {step === "paid" ? "PAGAMENTO APROVADO!" : "PAGAR COM PIX"}
          </DialogTitle>
          <DialogDescription>
            {step === "form"
              ? "Kit Sobrevivência Ana Castela · R$ 29,90"
              : step === "pix"
                ? "Escaneie o QR Code ou use o PIX copia e cola"
                : "Recebemos seu pagamento. Em breve entraremos em contato com o rastreio."}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pix-name">Nome completo</Label>
              <Input
                id="pix-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maria da Silva"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix-doc">CPF ou CNPJ</Label>
              <Input
                id="pix-doc"
                value={document}
                onChange={(e) => setDocument(maskDocument(e.target.value))}
                placeholder="000.000.000-00"
                inputMode="numeric"
              />
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
              {loading ? "GERANDO PIX..." : "GERAR PIX"}
            </button>
          </form>
        )}

        {step === "pix" && pix && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={qrSrc}
                alt="QR Code do pagamento PIX"
                width={240}
                height={240}
                className="h-60 w-60 rounded-lg border border-border bg-white p-2"
              />
            </div>
            <div className="rounded-md border border-border bg-card p-3">
              <p className="break-all font-mono text-xs text-muted-foreground">{pix.copyPaste}</p>
            </div>
            <button
              type="button"
              onClick={copy}
              className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copied ? "PIX COPIADO!" : "COPIAR PIX"}
            </button>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Aguardando pagamento...
            </p>
            <button
              type="button"
              onClick={reset}
              className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground underline underline-offset-4"
            >
              <RefreshCw className="h-3 w-3" /> Gerar novo PIX
            </button>
          </div>
        )}

        {step === "paid" && (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="font-display text-3xl text-primary">PEDIDO CONFIRMADO</p>
            <p className="text-sm text-muted-foreground">
              Seu Kit Sobrevivência será postado no próximo dia útil com código de rastreio.
            </p>
            <button
              type="button"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="w-full bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground"
            >
              FECHAR
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
