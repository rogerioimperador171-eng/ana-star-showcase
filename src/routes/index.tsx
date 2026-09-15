import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, ShieldCheck, Flame, BadgeCheck } from "lucide-react";
import kitAsset from "@/assets/kit-squishy.asset.json";
import { PixCheckout } from "@/components/PixCheckout";

const PRODUCT_IMAGE_URL = `https://project--24592de8-3a87-4821-adfa-a124e2b3eddd-dev.lovable.app${kitAsset.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kit 3 Squishies — Cubo Gelo, Queijo e Barra Manteiga | Super Oferta" },
      {
        name: "description",
        content:
          "Kit 3 Squishies anti-estresse: Cubo Squeeze Gelo, Queijo Squishy e Barra Manteiga por apenas R$ 49,90. +3.200 kits vendidos com entrega rápida.",
      },
      { property: "og:title", content: "Kit 3 Squishies — Super Oferta por R$ 49,90" },
      {
        property: "og:description",
        content:
          "Diversão, relaxamento e estilo em um só kit! 3 squishies anti-estresse por R$ 49,90. Estoque limitado.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: PRODUCT_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: PRODUCT_IMAGE_URL },
    ],
  }),
  component: Index,
});

const reviews = [
  {
    name: "Larissa M.",
    city: "São Paulo, SP",
    text: "Chegou em 3 dias, super bem embalado! O cubo de gelo com glitter é ainda mais bonito pessoalmente. Meu filho não larga mais.",
    product: "Kit 3 Squishies",
  },
  {
    name: "Camila R.",
    city: "Ribeirão Preto, SP",
    text: "Comprei de presente pra minha sobrinha e ela amou! Entrega rápida e o queijo squishy é muito macio. Recomendo demais.",
    product: "Kit 3 Squishies",
  },
  {
    name: "Juliana F.",
    city: "Goiânia, GO",
    text: "Segundo kit que compro, dessa vez pra mim! Uso a barra manteiga no trabalho e ajuda muito na ansiedade. Chegou antes do prazo!",
    product: "Kit 3 Squishies",
  },
  {
    name: "Beatriz S.",
    city: "Uberaba, MG",
    text: "Produto idêntico às fotos, atendimento nota 10 e entrega rapidinha. Os squishies são de ótima qualidade, não estouram fácil.",
    product: "Kit 3 Squishies",
  },
  {
    name: "Rafael T.",
    city: "Curitiba, PR",
    text: "Comprei pro meu filho que tem TDAH e o cubo squeeze ajuda muito na concentração dele. Entrega em 4 dias e tudo certinho.",
    product: "Kit 3 Squishies",
  },
  {
    name: "Fernanda L.",
    city: "Belo Horizonte, MG",
    text: "Amei demais! O queijo é o mais gostoso de apertar, super satisfatório. Veio muito bem embalado, cada um na caixinha.",
    product: "Kit 3 Squishies",
  },
  {
    name: "Diego A.",
    city: "Fortaleza, CE",
    text: "Preço ótimo por 3 produtos de qualidade. Chegou em 5 dias aqui no Ceará, com código de rastreio desde o início. Valeu muito a pena.",
    product: "Kit 3 Squishies",
  },
  {
    name: "Mariana P.",
    city: "Porto Alegre, RS",
    text: "Kit perfeito pra presentear! Comprei um pra mim e um pra minha amiga. Cores lindas, cheirinho bom e entrega super rápida.",
    product: "Kit 3 Squishies",
  },
];

const marqueeItems = [
  "SUPER OFERTA",
  "KIT 3 PRODUTOS",
  "+3.200 KITS VENDIDOS",
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
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/80 to-background" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-2 md:items-center md:py-24">
          <div className="order-2 md:order-1">
            <p className="mb-4 inline-block -rotate-2 bg-primary px-4 py-1 font-display text-xl tracking-widest text-primary-foreground">
              ★ KIT 3 PRODUTOS ★
            </p>
            <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
              SUPER
              <span className="block text-primary">OFERTA</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              ★ Diversão, relaxamento e estilo em um só kit! ★
            </p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-sm text-muted-foreground line-through">R$ 89,90</span>
              <span className="font-display text-6xl text-primary md:text-7xl">
                <span className="text-3xl align-top">R$</span> 49
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
              <span>4.9/5 — 986 avaliações · +3.200 kits vendidos</span>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="absolute -inset-6 rounded-full bg-primary/20 blur-3xl" />
            <img
              src={PRODUCT_IMAGE_URL}
              alt="Kit 3 Squishies: cubo squeeze gelo com glitter, queijo squishy e barra de manteiga anti-estresse"
              width={1024}
              height={1536}
              loading="eager"
              decoding="async"
              className="relative mx-auto block w-full max-w-sm rotate-1 rounded-2xl border border-border shadow-2xl md:max-w-none"
            />
            <p className="absolute -left-1 -top-3 -rotate-6 bg-primary px-3 py-1 font-display text-lg tracking-widest text-primary-foreground shadow-lg md:-left-2 md:top-6">
              ★ OFERTA LIMITADA ★
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
          TRÊS SQUISHIES, <span className="text-primary">UM SÓ KIT</span>
        </h2>
        <p className="mt-3 text-center text-lg italic text-muted-foreground">
          Diversão, relaxamento e estilo para todas as idades!
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="font-display text-3xl text-primary">CUBO SQUEEZE GELO</p>
            <p className="mt-2 text-muted-foreground">
              Cubo transparente com glitter em cores sortidas. Super sólido, squishy e hipnotizante
              de apertar — o queridinho da galera!
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="font-display text-3xl text-primary">QUEIJO SQUISHY</p>
            <p className="mt-2 text-muted-foreground">
              O queijo anti-estresse mais divertido que existe! Textura macia e super satisfatória,
              perfeito para aliviar a tensão do dia a dia.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="font-display text-3xl text-primary">BARRA MANTEIGA</p>
            <p className="mt-2 text-muted-foreground">
              Squishy em formato de barra de manteiga, feito para combater estresse e ansiedade.
              Aperta, estica e volta ao formato original!
            </p>
          </div>
        </div>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {[
            "Alivia o estresse e a ansiedade",
            "Estimula a concentração",
            "Ideal para presentear",
            "Qualidade e diversão garantidas",
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
            <p className="mt-2 font-display text-2xl">+3.200 VENDIDOS</p>
            <p className="text-sm text-muted-foreground">O kit anti-estresse queridinho do Brasil</p>
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
          <span className="text-sm text-muted-foreground">4.9 de 5 · 986 avaliações verificadas</span>
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
          <p className="font-display text-2xl tracking-widest text-primary">★ OFERTA LIMITADA — KIT 3 SQUISHIES ★</p>
          <h2 className="mt-4 font-display text-6xl md:text-7xl">
            GARANTA JÁ <span className="text-primary">O SEU!</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Estoque limitado. Quando acabar, o preço volta ao normal.
          </p>
          <div className="mt-6 font-display text-7xl text-primary">
            <span className="align-top text-4xl">R$</span> 49<span className="align-top text-4xl">,90</span>
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
        <p>Kit 3 Squishies — Cubo Squeeze Gelo, Queijo Squishy e Barra Manteiga.</p>
      </footer>

      <PixCheckout open={checkoutOpen} onOpenChange={setCheckoutOpen} />

    </div>
  );
}
