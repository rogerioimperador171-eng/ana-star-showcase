import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Gift,
  Menu,
  PackageCheck,
  Play,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PixCheckout } from "@/components/PixCheckout";
import {
  FUNBOX_GIF,
  FUNBOX_HERO,
  FUNBOX_ITEMS,
  FUNBOX_MEDIA,
  FUNBOX_VARIANTS,
  type FunboxVariantId,
} from "@/lib/funbox";

const brl = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MiniKo Squishy FunBox™ — Caixa Surpresa com 8 Squishies" },
      {
        name: "description",
        content: "Descubra a MiniKo Squishy FunBox com 8 squishies diferentes, frete grátis e pagamento seguro por Pix.",
      },
      { property: "og:title", content: "MiniKo Squishy FunBox™ — 8 squishies em uma caixa surpresa" },
      {
        property: "og:description",
        content: "8 formatos, texturas e sensações para apertar, brincar, colecionar e presentear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const reviews = [
  { name: "Olivia R.", text: "Pedi e chegou antes do prazo. Todos vieram bem embalados e são de ótima qualidade." },
  { name: "Bruna O.", text: "Muito legais, minha filha ficou alucinada. A caixa é linda e veio tudo certinho." },
  { name: "Juliano Q.", text: "Vale muito a pena. São oito modelos diferentes e o frete foi bem rápido." },
  { name: "Naiane E.", text: "Ótimos! Um mais bonito que o outro e muito gostosos de apertar." },
  { name: "Daiane T.", text: "Tudo perfeito. A caixa chegou bem protegida e recomendo muito." },
  { name: "Gabriela U.", text: "Sensacional. Um mais fofo que o outro, foi um presente perfeito." },
  { name: "Amelia O.", text: "Chegou hoje e nós estamos enlouquecidas. São muito gostosinhos de apertar." },
  { name: "Vanessa Z.", text: "Chegou bem rapidinho com todos os itens diferentes e com rastreamento." },
  { name: "Carla P.", text: "São lindos. Amamos a surpresa e a qualidade dos squishies." },
];

function Stars({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`${size === "lg" ? "h-5 w-5" : "h-4 w-4"} fill-current`} />
      ))}
    </div>
  );
}

function Index() {
  const [variantId, setVariantId] = useState<FunboxVariantId>("classic");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const product = FUNBOX_VARIANTS[variantId];
  const media = FUNBOX_MEDIA[mediaIndex] ?? FUNBOX_MEDIA[0];

  useEffect(() => {
    const targetIndex = variantId === "classic" ? 2 : 3;
    setMediaIndex(targetIndex);
  }, [variantId]);

  function buyNow() {
    setCheckoutOpen(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-accent px-4 py-2 text-center text-xs font-semibold text-accent-foreground sm:text-sm">
        <span className="font-bold italic">Dia das Crianças chegando!</span> — Até 60% OFF + Frete grátis
      </div>

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
          <a href="#inicio" className="min-w-fit text-3xl font-black text-primary" aria-label="MiniKo, página inicial">
            Mini<span className="text-accent">Ko</span><span className="text-gold">★</span>
          </a>
          <div className="relative hidden flex-1 sm:block">
            <input
              aria-label="Pesquisar"
              placeholder="Pesquisar..."
              className="h-11 w-full rounded-md border border-input bg-background px-4 pr-12 text-base outline-none focus:ring-2 focus:ring-ring"
            />
            <Search className="absolute right-4 top-3 h-5 w-5 text-primary" />
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm font-semibold">
            <span className="hidden items-center gap-2 md:flex"><Truck className="h-5 w-5 text-primary" /> Rastrear pedido</span>
            <span className="hidden h-7 w-px bg-border md:block" />
            <span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-primary" /> <span className="hidden sm:inline">Carrinho</span></span>
          </div>
        </div>
        <nav className="border-t border-border/60 px-4 py-3 text-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Menu className="h-4 w-4" /> Principal</span>
          <span className="mx-5">Kits Squishies</span>
        </nav>
      </header>

      <main id="inicio">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          Página inicial <span className="mx-2">›</span> Todos os produtos <span className="mx-2">›</span> MiniKo Squishy FunBox™
        </div>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 rounded-lg border border-border bg-card p-3 sm:p-5">
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              {media?.type === "video" ? (
                <video
                  key={media.src}
                  controls
                  playsInline
                  poster={media.poster}
                  className="h-full w-full object-contain"
                  aria-label={media.alt}
                >
                  <source src={media.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={media?.src}
                  alt={media?.alt ?? product.name}
                  width={1024}
                  height={1024}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              )}
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/90"
                onClick={() => setMediaIndex((mediaIndex - 1 + FUNBOX_MEDIA.length) % FUNBOX_MEDIA.length)}
                aria-label="Foto anterior"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/90"
                onClick={() => setMediaIndex((mediaIndex + 1) % FUNBOX_MEDIA.length)}
                aria-label="Próxima foto"
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {FUNBOX_MEDIA.map((item, index) => (
                <Button
                  key={`${item.src}-${index}`}
                  type="button"
                  variant="outline"
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md p-0 ${mediaIndex === index ? "border-primary ring-2 ring-ring" : ""}`}
                  onClick={() => setMediaIndex(index)}
                  aria-label={`Abrir mídia ${index + 1}`}
                >
                  <img src={item.type === "video" ? item.poster : item.src} alt="" className="h-full w-full object-cover" />
                  {item.type === "video" && <Play className="absolute inset-0 m-auto h-5 w-5 fill-card text-card" />}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 sm:p-7">
            <div className="flex items-start gap-2">
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">MiniKo Squishy FunBox™ — Caixa Surpresa com 8 Squishies</h1>
              <BadgeCheck className="mt-2 h-5 w-5 shrink-0 fill-primary text-card" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Novo</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm"><Stars /><strong>4,9/5</strong><span className="text-muted-foreground">(avaliações verificadas)</span></div>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-primary" /> Entrega estimada: 3 a 8 dias úteis</p>
              <p className="flex items-center gap-2"><Truck className="h-5 w-5 text-accent" /> Envio com código de rastreamento</p>
            </div>

            <div className="my-6 border-t border-border" />
            <p className="text-sm font-semibold">Escolha sua FunBox:</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(Object.values(FUNBOX_VARIANTS)).map((variant) => (
                <Button
                  key={variant.id}
                  type="button"
                  variant="outline"
                  onClick={() => setVariantId(variant.id)}
                  className={`h-auto flex-col items-stretch gap-2 rounded-md p-2 text-left ${variantId === variant.id ? "border-primary ring-2 ring-ring" : ""}`}
                >
                  <img src={variant.image} alt={variant.shortName} className="aspect-square w-full rounded object-cover" />
                  <span className="text-sm font-bold">{variant.shortName}</span>
                  <span className="text-primary">{brl(variant.price)}</span>
                </Button>
              ))}
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-sm text-muted-foreground line-through">{brl(product.compareAt)}</span>
              <span className="text-4xl font-black text-primary">{brl(product.price)}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Pagamento à vista por Pix</p>
            <p className="mt-3 inline-flex rounded bg-gold px-3 py-1 text-xs font-bold text-primary-foreground">
              Economize {brl(product.compareAt - product.price)}
            </p>

            <Button type="button" onClick={buyNow} className="mt-7 h-14 w-full bg-cta text-lg font-black uppercase text-cta-foreground shadow-sm hover:bg-cta/90">
              <ShoppingCart className="h-5 w-5" /> Comprar agora
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Frete grátis para todo o Brasil</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid items-center gap-8 border-y border-border py-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase text-accent">Diversão de caixa cheia</p>
              <h2 className="mt-2 text-4xl font-black text-foreground sm:text-5xl">8 squishies. 8 sensações. Uma caixa incrível!</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Se apertar um já é gostoso, imagina abrir uma caixa com <strong className="text-foreground">8 squishies diferentes</strong> de uma vez. Cada modelo tem seu formato, textura e sensação ao apertar.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {FUNBOX_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-primary" /> {item}</li>
                ))}
              </ul>
            </div>
            <img src={FUNBOX_GIF} alt="Squishies da FunBox em movimento" className="w-full rounded-lg border border-border" loading="lazy" />
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
            <img src={FUNBOX_MEDIA[6]?.type === "image" ? FUNBOX_MEDIA[6].src : FUNBOX_HERO} alt="Diferentes texturas da FunBox" className="w-full rounded-lg" loading="lazy" />
            <div>
              <h2 className="text-4xl font-black sm:text-5xl">Aperte. Amasse. Estique. Repita.</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Alguns são supermacios. Outros têm gel, glitter ou elementos dentro. São perfeitos para brincar, colecionar, trocar com as amigas ou simplesmente deixar as mãos ocupadas.</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3"><Sparkles className="h-6 w-6 shrink-0 text-primary" /><div><strong>Diversão garantida</strong><p className="text-sm text-muted-foreground">Texturas, cores e formatos variados.</p></div></div>
                <div className="flex gap-3"><Gift className="h-6 w-6 shrink-0 text-accent" /><div><strong>Presente completo</strong><p className="text-sm text-muted-foreground">A surpresa já começa pela caixa.</p></div></div>
              </div>
              <Button type="button" onClick={buyNow} className="mt-8 h-13 bg-cta px-8 font-bold uppercase text-cta-foreground hover:bg-cta/90">Quero minha FunBox</Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-black sm:text-5xl">Um presente que já começa pela caixa</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">A FunBox chega com 8 squishies reunidos em uma caixa superdivertida, transformando o momento de abrir no melhor da brincadeira. Ideal para aniversário, datas especiais ou para fazer uma surpresa.</p>
              <Button type="button" onClick={buyNow} className="mt-8 h-13 bg-cta px-8 font-bold uppercase text-cta-foreground hover:bg-cta/90">Comprar agora</Button>
            </div>
            <img src={FUNBOX_MEDIA[8]?.type === "image" ? FUNBOX_MEDIA[8].src : FUNBOX_HERO} alt="FunBox pronta para presentear" className="w-full rounded-lg border border-border" loading="lazy" />
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-center sm:grid-cols-3 sm:px-6">
            <div><Truck className="mx-auto h-8 w-8 text-primary" /><h3 className="mt-3 text-lg font-bold">Frete grátis</h3><p className="mt-1 text-sm text-muted-foreground">PAC ou SEDEX sem custo adicional.</p></div>
            <div><PackageCheck className="mx-auto h-8 w-8 text-accent" /><h3 className="mt-3 text-lg font-bold">Pedido monitorado</h3><p className="mt-1 text-sm text-muted-foreground">Acompanhe todas as atualizações do envio.</p></div>
            <div><ShieldCheck className="mx-auto h-8 w-8 text-gold" /><h3 className="mt-3 text-lg font-bold">Compra segura</h3><p className="mt-1 text-sm text-muted-foreground">Dados protegidos durante o pagamento.</p></div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase text-accent">Avaliações verificadas</p>
            <h2 className="mt-2 text-4xl font-black sm:text-5xl">Quem abriu a FunBox, amou</h2>
            <div className="mt-4 flex items-center justify-center gap-3"><Stars size="lg" /><strong className="text-2xl">4,9</strong><span className="text-muted-foreground">9 avaliações</span></div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.name} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between"><Stars /><BadgeCheck className="h-5 w-5 text-primary" /></div>
                <blockquote className="mt-4 min-h-16 text-sm leading-relaxed text-muted-foreground">“{review.text}”</blockquote>
                <figcaption className="mt-4 border-t border-border pt-3 text-sm font-bold">{review.name} <span className="font-normal text-muted-foreground">· Compra verificada</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="bg-primary px-4 py-14 text-center text-primary-foreground">
          <h2 className="text-4xl font-black sm:text-5xl">Qual você vai apertar primeiro?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">Escolha sua FunBox e descubra todas as cores e texturas que vão chegar para você.</p>
          <div className="mt-6 text-4xl font-black">{product.shortName} · {brl(product.price)}</div>
          <Button type="button" onClick={buyNow} className="mt-7 h-14 bg-cta px-10 text-lg font-black uppercase text-cta-foreground hover:bg-cta/90">Comprar agora</Button>
        </section>
      </main>

      <footer className="bg-foreground px-4 py-8 text-center text-xs text-background/70">
        <p>MiniKo Squishy FunBox™ · 8 squishies diferentes em uma única caixa.</p>
      </footer>

      <PixCheckout open={checkoutOpen} onOpenChange={setCheckoutOpen} variantId={variantId} />
    </div>
  );
}