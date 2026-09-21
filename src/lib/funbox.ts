import heroAsset from "@/assets/miniko/hero.png.asset.json";
import classicAsset from "@/assets/miniko/classic.png.asset.json";
import cuteAsset from "@/assets/miniko/cute.png.asset.json";
import gallery3Asset from "@/assets/miniko/gallery-3.png.asset.json";
import gallery4Asset from "@/assets/miniko/gallery-4.png.asset.json";
import gallery5Asset from "@/assets/miniko/gallery-5.png.asset.json";
import gallery6Asset from "@/assets/miniko/gallery-6.png.asset.json";
import giftAsset from "@/assets/miniko/gift.png.asset.json";
import gallery8Asset from "@/assets/miniko/gallery-8.png.asset.json";
import gallery9Asset from "@/assets/miniko/gallery-9.png.asset.json";
import demoGifAsset from "@/assets/miniko/demo.gif.asset.json";
import demoVideoAsset from "@/assets/miniko/demo.mp4.asset.json";

export type FunboxVariantId = "classic" | "cute";

const ASSET_ORIGIN = "https://project--24592de8-3a87-4821-adfa-a124e2b3eddd-dev.lovable.app";
const assetUrl = (path: string) => `${ASSET_ORIGIN}${path}`;

export type FunboxVariant = {
  id: FunboxVariantId;
  name: string;
  shortName: string;
  price: number;
  compareAt: number;
  image: string;
};

export const FUNBOX_ITEMS = [
  "Frutinha Squishy",
  "Cubo Squishy",
  "Cubo Ocean",
  "Squishy com Glitter",
  "Butter Squishy",
  "Bichinho Squishy",
  "Squishy Especial",
  "+ 1 modelo divertido",
];

export const FUNBOX_VARIANTS: Record<FunboxVariantId, FunboxVariant> = {
  classic: {
    id: "classic",
    name: "MiniKo Squishy FunBox™ — FunBox Classic",
    shortName: "FunBox Classic",
    price: 49.9,
    compareAt: 99.9,
    image: assetUrl(classicAsset.url),
  },
  cute: {
    id: "cute",
    name: "MiniKo Squishy FunBox™ — FunBox Cute",
    shortName: "FunBox Cute",
    price: 79.9,
    compareAt: 149.9,
    image: assetUrl(cuteAsset.url),
  },
};

export const FUNBOX_MEDIA = [
  { type: "image" as const, src: assetUrl(heroAsset.url), alt: "MiniKo Squishy FunBox com 8 squishies" },
  { type: "video" as const, src: assetUrl(demoVideoAsset.url), poster: assetUrl(gallery3Asset.url), alt: "Vídeo demonstrativo da FunBox" },
  { type: "image" as const, src: assetUrl(classicAsset.url), alt: "FunBox Classic com seus squishies" },
  { type: "image" as const, src: assetUrl(cuteAsset.url), alt: "FunBox Cute com seus squishies" },
  { type: "image" as const, src: assetUrl(gallery3Asset.url), alt: "Modelos da coleção FunBox" },
  { type: "image" as const, src: assetUrl(gallery4Asset.url), alt: "Squishies coloridos da FunBox" },
  { type: "image" as const, src: assetUrl(gallery5Asset.url), alt: "Detalhes dos squishies sensoriais" },
  { type: "image" as const, src: assetUrl(gallery6Asset.url), alt: "Conteúdo da caixa FunBox" },
  { type: "image" as const, src: assetUrl(giftAsset.url), alt: "FunBox pronta para presentear" },
  { type: "image" as const, src: assetUrl(gallery8Asset.url), alt: "Texturas variadas dos squishies" },
  { type: "image" as const, src: assetUrl(gallery9Asset.url), alt: "Coleção completa MiniKo FunBox" },
];

export const FUNBOX_GIF = assetUrl(demoGifAsset.url);
export const FUNBOX_HERO = assetUrl(heroAsset.url);