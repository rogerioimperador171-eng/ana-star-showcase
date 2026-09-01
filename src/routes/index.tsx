import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, ShieldCheck, Flame, BadgeCheck } from "lucide-react";
import kitAsset from "@/assets/kit-ana-castela.asset.json";
import heroImg from "@/assets/hero-western.jpg";
import { PixCheckout } from "@/components/PixCheckout";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kit Sobrevivência Ana Castela — Edição Limitada" },
      {
        name: "description",
        content:
          "Kit Sobrevivência Ana Castela: caneca bota + peteco de Barretos. Edição limitada por apenas R$ 29,90. +4.800 kits vendidos com entrega rápida.",
      },
      { property: "og:title", content: "Kit Sobrevivência Ana Castela — Edição Limitada" },
      {
        property: "og:description",
        content:
          "Dois itens, um só objetivo: viver Barretos como uma verdadeira boiadeira. Garanta já o seu por R$ 29,90.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const reviews = [
  {
    name: "Larissa M.",
    city: "Barretos, SP",
    text: "Chegou em 3 dias, super bem embalado! A caneca bota é ainda mais linda pessoalmente. Usei o rodeio inteiro e todo mundo perguntou onde comprei.",
    product: "Kit Sobrevivência",
  },
  {
    name: "Camila R.",
    city: "Ribeirão Preto, SP",
    text: "Comprei de presente pra minha irmã que é fã da Ana Castela. Ela amou! Entrega rápida e o peteco é muito bem feito. Recomendo demais.",
    product: "Kit Sobrevivência",
  },
  {
    name: "Juliana F.",
    city: "Goiânia, GO",
    text: "Terceiro kit que compro, dessa vez pra levar pro show. Qualidade incrível, não desbota e o suporte segura a lata firme. Entrega chegou antes do prazo!",
    product: "Kit Sobrevivência",
  },
  {
    name: "Beatriz S.",
    city: "Uberaba, MG",
    text: "O peteco mais famoso de Barretos mesmo! Chegou rapidinho, atendimento nota 10 e o produto é idêntico às fotos. Virei cliente fiel.",
    product: "Kit Sobrevivência",
  },
];

const marqueeItems = [
  "EDIÇÃO LIMITADA",
  "BARRETOS 2026",
  "+4.800 KITS VENDIDOS",
  "ENVIO PARA TODO O BRASIL",
  "NOTA 4.9 DE SATISFAÇÃO",
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

function Index() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  return (

    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement bar */}
      <div className="bg-primary py-2 text-center font-display text-sm tracking-[0.2em] text-primary-foreground">
        ★ FRETE GRÁTIS ACIMA DE 2 KITS — SÓ ENQUANTO DURAR O ESTOQUE ★
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Chapéu country rosa em arena de rodeio ao pôr do sol"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="mb-4 inline-block -rotate-2 bg-primary px-4 py-1 font-display text-xl tracking-widest text-primary-foreground">
              ★ KIT ★
            </p>
            <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
              SOBREVIVÊNCIA
              <span className="block text-primary">ANA CASTELA</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              ★ Para curtir cada segundo com estilo e atitude! ★
            </p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-sm text-muted-foreground line-through">R$ 49,90</span>
              <span className="font-display text-6xl text-primary md:text-7xl">
                <span className="text-3xl align-top">R$</span> 29
                <span className="text-3xl align-top">,90</span>
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="#garantir"
                className="bg-primary px-8 py-4 font-display text-2xl tracking-widest text-primary-foreground shadow-[0_0_40px_-5px_var(--color-pinkglow)] transition-transform hover:scale-105"
              >
                ★ GARANTA JÁ O SEU! ★
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Stars />
              <span>4.9/5 — 1.247 avaliações · +4.800 kits vendidos</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-primary/20 blur-3xl" />
            <img
              src={kitAsset.url}
              alt="Kit Sobrevivência Ana Castela: caneca em formato de bota rosa e peteco rosa de Barretos"
              className="relative w-full rotate-1 rounded-2xl border border-border shadow-2xl"
            />
            <p className="absolute -left-2 top-6 -rotate-6 bg-primary px-3 py-1 font-display text-lg tracking-widest text-primary-foreground shadow-lg">
              ★ EDIÇÃO LIMITADA ★
            </p>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-card py-3">
        <div className="marquee-track flex w-max gap-10 font-display text-xl tracking-[0.25em] text-primary">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>★ {item}</span>
          ))}
        </div>
      </div>

      {/* What's inside */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center font-display text-5xl md:text-6xl">
          DOIS ITENS, <span className="text-primary">UM SÓ OBJETIVO</span>
        </h2>
        <p className="mt-3 text-center text-lg italic text-muted-foreground">
          Viver Barretos como uma verdadeira boiadeira!
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="font-display text-3xl text-primary">CANECA BOTA</p>
            <p className="mt-2 text-muted-foreground">
              Suporte para copo e lata no formato de bota, com design exclusivo inspirado na boiadeira
              mais autêntica do Brasil. Gravação Barretos 2026 em alto-relevo.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="font-display text-3xl text-primary">O PETECO</p>
            <p className="mt-2 text-muted-foreground">
              O peteco mais famoso de Barretos! Chaveiro colecionável em formato de revólver, o
              acessório que ninguém tira da bolsa nos rodeios e festivais.
            </p>
          </div>
        </div>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {[
            "Design exclusivo inspirado na Ana Castela",
            "Ideal para festas, rodeios e festivais",
            "Presente perfeito para fãs",
            "Qualidade, resistência e muito estilo",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 text-center sm:grid-cols-3">
          <div>
            <Truck className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 font-display text-2xl">ENVIO EM 24H</p>
            <p className="text-sm text-muted-foreground">Postagem no dia útil seguinte, com código de rastreio</p>
          </div>
          <div>
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 font-display text-2xl">COMPRA SEGURA</p>
            <p className="text-sm text-muted-foreground">Pagamento protegido e troca garantida em 7 dias</p>
          </div>
          <div>
            <Flame className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 font-display text-2xl">+4.800 VENDIDOS</p>
            <p className="text-sm text-muted-foreground">O kit queridinho das boiadeiras em todo o Brasil</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center font-display text-5xl md:text-6xl">
          QUEM COMPROU, <span className="text-primary">APROVOU</span>
        </h2>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Stars />
          <span className="text-sm text-muted-foreground">4.9 de 5 · 1.247 avaliações verificadas</span>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <Stars />
              <blockquote className="mt-3 flex-1 text-sm text-muted-foreground">“{r.text}”</blockquote>
              <figcaption className="mt-4 border-t border-border pt-3">
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city} · Compra verificada</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="garantir" className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-display text-2xl tracking-widest text-primary">★ EDIÇÃO LIMITADA — BARRETOS 2026 ★</p>
          <h2 className="mt-4 font-display text-6xl md:text-7xl">
            GARANTA JÁ <span className="text-primary">O SEU!</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Estoque limitado. Quando acabar, só na próxima edição.
          </p>
          <div className="mt-6 font-display text-7xl text-primary">
            <span className="align-top text-4xl">R$</span> 29<span className="align-top text-4xl">,90</span>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="mt-8 inline-block bg-primary px-10 py-5 font-display text-3xl tracking-widest text-primary-foreground shadow-[0_0_50px_-5px_var(--color-pinkglow)] transition-transform hover:scale-105"
          >
            ★ PAGAR COM PIX ★
          </button>

          <p className="mt-4 text-xs text-muted-foreground">
            Pix, cartão ou boleto · Envio para todo o Brasil
          </p>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>Kit Sobrevivência — Edição Barretos 2026 · Produto não oficial de fã, sem vínculo com a artista.</p>
      </footer>

      <PixCheckout open={checkoutOpen} onOpenChange={setCheckoutOpen} />

    </div>
  );
}
