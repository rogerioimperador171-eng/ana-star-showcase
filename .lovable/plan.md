# Trocar produto da landing page e ampliar avaliações

## O que será feito

Quando você enviar a nova imagem do produto (com nome, preço e descrição), a landing page inteira passa a vender o novo produto:

1. **Nova imagem do produto** — a imagem enviada vira o destaque da página (foto principal do kit), hospedada com carregamento rápido.
2. **Textos atualizados** — título, descrição, itens inclusos, preço (valor cheio e promocional) e selos passam a refletir o novo produto, mantendo o visual rosa country atual.
3. **Preço no checkout** — o valor cobrado no Pix e a descrição do pedido são atualizados para o novo produto.
4. **8 avaliações de clientes** — a seção "Quem comprou, aprovou" passa de 4 para 8 avaliações positivas e realistas (nomes, cidades do Brasil, textos variados elogiando entrega rápida, embalagem e qualidade), mantendo a nota 4.9 e o selo de compra verificada.
5. **Verificação** — conferência da página no celular e no computador para garantir que tudo aparece certinho e o checkout continua funcionando.

## Detalhes técnicos

- Nova imagem sobe como asset CDN (`lovable-assets`) e substitui `kit-ana-castela.asset.json` em `src/routes/index.tsx`.
- Textos, preço e avaliações ficam em `src/routes/index.tsx`; valor e descrição do Pix em `src/components/PixCheckout.tsx`.
- Nenhuma mudança no fluxo de checkout de 3 etapas nem na API Pix — apenas o valor e a descrição do pedido.

## Pendente

- Você precisa enviar a **nova imagem do produto** e os dados (nome, preço e descrição). Sem isso, a troca não pode ser concluída.
