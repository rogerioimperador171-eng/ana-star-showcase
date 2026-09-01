import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Check,
  Copy,
  Loader2,
  QrCode,
  RefreshCw,
  AlertTriangle,
  Truck,
  ArrowLeft,
} from "lucide-react";

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

const PRODUCT_PRICE = 29.9;
const PRODUCT_NAME = "Kit Sobrevivência Ana Castela — Edição Barretos 2026";

const SHIPPING = [
  { id: "pac", label: "ENVIOS PAC", eta: "7 dias úteis", price: 18.91 },
  { id: "sedex", label: "ENVIOS SEDEX", eta: "5 dias úteis", price: 24.52 },
] as const;

type ShippingId = (typeof SHIPPING)[number]["id"];
type Step = 1 | 2 | 3 | 4;

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function maskCpf(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function maskCep(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

const inputClass = "h-12 text-base";

export function PixCheckout({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const deposit = useServerFn(createPixDeposit);
  const check = useServerFn(checkPixStatus);

  const [step, setStep] = useState<Step>(1);

  // etapa 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  // etapa 2
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingId | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pix, setPix] = useState<{ transactionId: string; copyPaste: string; qrcodeUrl: string | null } | null>(
    null,
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shippingOption = SHIPPING.find((s) => s.id === shipping) ?? null;
  const total = PRODUCT_PRICE + (shippingOption?.price ?? 0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  useEffect(() => {
    if (step !== 3 || !pix) return;
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const result = await check({ data: { transactionId: pix.transactionId } });
        if (result.ok && result.paid) {
          stopPolling();
          setStep(4);
        }
      } catch {
        /* silencioso: mantém o polling ativo */
      }
    }, 3000);
    return stopPolling;
  }, [step, pix, check, stopPolling]);

  // busca de endereço pelo CEP
  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    let active = true;
    setCepLoading(true);
    setCepError(null);
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((r) => r.json() as Promise<Record<string, string | boolean>>)
      .then((data) => {
        if (!active) return;
        if (data["erro"]) {
          setCepError("CEP não encontrado. Confira o número digitado.");
          return;
        }
        setStreet(String(data["logradouro"] ?? ""));
        setDistrict(String(data["bairro"] ?? ""));
        setCity(String(data["localidade"] ?? ""));
        setUf(String(data["uf"] ?? ""));
      })
      .catch(() => {
        if (active) setCepError("Não foi possível buscar o CEP. Tente novamente.");
      })
      .finally(() => {
        if (active) setCepLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cep]);

  function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 3) return setError("Informe seu nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Informe um e-mail válido.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Informe um telefone válido com DDD.");
    if (cpf.replace(/\D/g, "").length !== 11) return setError("Informe um CPF válido.");
    setStep(2);
  }

  function submitStep2(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (cep.replace(/\D/g, "").length !== 8) return setError("Informe um CEP válido.");
    if (!street.trim() || !city.trim()) return setError("Endereço incompleto. Confira o CEP.");
    if (!number.trim()) return setError("Informe o número do endereço.");
    if (!shipping) return setError("Escolha uma opção de envio.");
    setStep(3);
    void generatePix();
  }

  async function generatePix() {
    setError(null);
    setLoading(true);
    setPix(null);
    try {
      const result = await deposit({
        data: {
          amount: Number(total.toFixed(2)),
          description: PRODUCT_NAME,
          payerName: name.trim(),
          payerDocument: cpf.replace(/\D/g, ""),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPix({ transactionId: result.transactionId, copyPaste: result.copyPaste, qrcodeUrl: result.qrcodeUrl });
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
    setStep(1);
    setPix(null);
    setError(null);
    setLoading(false);
  }

  const qrSrc =
    pix?.qrcodeUrl ??
    (pix
      ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(pix.copyPaste)}`
      : "");

  const titles: Record<Step, string> = {
    1: "SEUS DADOS",
    2: "ENTREGA",
    3: "PAGAMENTO PIX",
    4: "PAGAMENTO APROVADO!",
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl p-4 sm:max-w-md sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl tracking-wide sm:text-3xl">{titles[step]}</DialogTitle>
          <DialogDescription>
            {step < 4 ? `Etapa ${step} de 3 · ${PRODUCT_NAME.split("—")[0]?.trim()}` : "Recebemos seu pagamento."}
          </DialogDescription>
        </DialogHeader>

        {step < 4 && (
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        )}

        {error && (
          <p className="flex items-start gap-2 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {error}
          </p>
        )}

        {/* ETAPA 1 */}
        {step === 1 && (
          <form onSubmit={submitStep1} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="ck-name">Nome completo</Label>
              <Input
                id="ck-name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maria da Silva"
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ck-email">E-mail</Label>
              <Input
                id="ck-email"
                className={inputClass}
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ck-phone">Telefone</Label>
              <Input
                id="ck-phone"
                className={inputClass}
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                placeholder="(11) 90000-0000"
                autoComplete="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ck-cpf">CPF</Label>
              <Input
                id="ck-cpf"
                className={inputClass}
                inputMode="numeric"
                value={cpf}
                onChange={(e) => setCpf(maskCpf(e.target.value))}
                placeholder="000.000.000-00"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              CONTINUAR
            </button>
          </form>
        )}

        {/* ETAPA 2 */}
        {step === 2 && (
          <form onSubmit={submitStep2} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="ck-cep">CEP</Label>
              <div className="relative">
                <Input
                  id="ck-cep"
                  className={inputClass}
                  inputMode="numeric"
                  value={cep}
                  onChange={(e) => setCep(maskCep(e.target.value))}
                  placeholder="00000-000"
                  autoComplete="postal-code"
                />
                {cepLoading && (
                  <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-primary" />
                )}
              </div>
              {cepError && <p className="text-xs text-primary">{cepError}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ck-street">Endereço</Label>
              <Input id="ck-street" className={inputClass} value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Rua" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ck-number">Número</Label>
                <Input
                  id="ck-number"
                  className={inputClass}
                  inputMode="numeric"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-comp">Complemento</Label>
                <Input
                  id="ck-comp"
                  className={inputClass}
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 12"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ck-district">Bairro</Label>
                <Input id="ck-district" className={inputClass} value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-city">Cidade / UF</Label>
                <Input id="ck-city" className={inputClass} value={city && uf ? `${city} / ${uf}` : city} readOnly />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <p className="font-display text-xl tracking-wide">FORMA DE ENVIO</p>
              {SHIPPING.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setShipping(option.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    shipping === option.id ? "border-primary bg-primary/10" : "border-border bg-card"
                  }`}
                >
                  <Truck className="h-5 w-5 shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">
                      {option.label} — {option.eta.toUpperCase()}
                    </span>
                    <span className="block text-xs text-muted-foreground">Entrega em até {option.eta}</span>
                  </span>
                  <span className="font-display text-xl text-primary">{brl(option.price)}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
                className="flex items-center justify-center gap-1 rounded-md border border-border px-4 py-4 text-sm text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                CONTINUAR
              </button>
            </div>
          </form>
        )}

        {/* ETAPA 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xl tracking-wide">RESUMO DO PEDIDO</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Kit Sobrevivência Ana Castela</span>
                  <span>{brl(PRODUCT_PRICE)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {shippingOption ? `${shippingOption.label} (${shippingOption.eta})` : "Frete"}
                  </span>
                  <span>{brl(shippingOption?.price ?? 0)}</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-border pt-2 font-display text-2xl">
                  <span>TOTAL</span>
                  <span className="text-primary">{brl(total)}</span>
                </div>
              </div>
              <p className="mt-3 border-t border-border pt-2 text-xs text-muted-foreground">
                Entrega em {street}, {number}
                {complement ? ` — ${complement}` : ""} · {district} · {city}/{uf} · CEP {cep}
              </p>
            </div>

            {loading && (
              <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" /> Gerando seu PIX...
              </p>
            )}

            {!loading && !pix && (
              <button
                type="button"
                onClick={() => void generatePix()}
                className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground"
              >
                <QrCode className="h-5 w-5" /> GERAR PIX
              </button>
            )}

            {pix && (
              <>
                <div className="flex justify-center">
                  <img
                    src={qrSrc}
                    alt="QR Code do pagamento PIX"
                    width={240}
                    height={240}
                    className="h-56 w-56 rounded-lg border border-border bg-white p-2"
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

                <div className="rounded-lg border border-border bg-card p-4 text-sm">
                  <p className="font-display text-xl tracking-wide">COMO PAGAR:</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                    <li>Abra o app do seu banco e escolha Pix.</li>
                    <li>Selecione Ler QR Code ou Pix copia e cola.</li>
                    <li>Escaneie o código acima ou cole o código copiado.</li>
                    <li>Confira o valor e confirme o pagamento.</li>
                    <li>Pronto! A confirmação aparece aqui automaticamente.</li>
                  </ol>
                  <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    <p>PROPIXBR LTDA</p>
                    <p>BASS PAGO INSTITUICAO DE PAGAMENTO LTDA</p>
                    <p>CNPJ: 65.474.453/0001-0</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void generatePix()}
                  className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground underline underline-offset-4"
                >
                  <RefreshCw className="h-3 w-3" /> Gerar novo PIX
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                stopPolling();
                setError(null);
                setPix(null);
                setStep(2);
              }}
              className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Voltar para entrega
            </button>
          </div>
        )}

        {/* ETAPA 4 */}
        {step === 4 && (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="font-display text-3xl text-primary">PEDIDO CONFIRMADO</p>
            <p className="text-sm text-muted-foreground">
              Seu Kit Sobrevivência será postado no próximo dia útil com código de rastreio enviado para {email}.
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
