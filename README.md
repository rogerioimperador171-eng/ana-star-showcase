# Kit Sobrevivência Ana Castela — Landing Page com PIX (ProPixBR)

Landing page em React + TypeScript (TanStack Start + Vite) com checkout PIX integrado à API
`https://api.propixbr.com`.

## Como funciona o pagamento

1. O usuário clica em **GARANTA JÁ O SEU / COMPRAR AGORA** e informa nome e CPF/CNPJ.
2. O frontend chama a função de servidor `createPixDeposit` (`src/lib/pix.functions.ts`), que faz
   `POST /api/v1/deposit` com os headers `x-client-id`, `x-client-secret` e `Content-Type: application/json`.
3. A resposta (`transactionId`, `copyPaste`, `qrcodeUrl`, `status`) é exibida na hora: QR Code,
   PIX copia e cola, botão **COPIAR PIX** e status "Aguardando pagamento".
4. A cada 3 segundos o app chama `checkPixStatus` → `POST /api/v1/check` com o `transactionId`.
   Quando `transactionState` for `COMPLETO`, o polling para e a tela de pagamento aprovado aparece
   sem recarregar a página.

As credenciais **nunca** vão para o navegador: só o código do servidor lê `process.env`.

## Variáveis de ambiente

| Variável               | Descrição                          |
| ---------------------- | ---------------------------------- |
| `PROPAY_CLIENT_ID`     | Client ID da ProPixBR (`live_...`) |
| `PROPAY_CLIENT_SECRET` | Client Secret da ProPixBR (`sk_...`) |

Já estão configuradas neste projeto. Para alterá-las, abra
**Project Settings → Secrets** no Lovable e edite os valores (ou peça ao assistente para atualizar).

Localmente, crie um arquivo `.env` na raiz (não versionado):

```
PROPAY_CLIENT_ID=live_xxx
PROPAY_CLIENT_SECRET=sk_xxx
```

## Testar localmente

```sh
npm i
npm run dev     # http://localhost:8080
npm run build   # build de produção
```

## Publicação na Netlify

O projeto agora tem `netlify.toml` configurado:

```
[build]
  command = "npm run build"
  publish = "dist"
```

O build gera o site estático em `dist/` e a função SSR em
`.netlify/functions-internal/server` (preset `netlify` do Nitro, com rota `/*`),
que é quem executa as funções de servidor do PIX. Nenhuma configuração extra de
redirect é necessária.

**Antes do deploy, cadastre as variáveis em Site configuration → Environment variables:**

- `PROPAY_CLIENT_ID`
- `PROPAY_CLIENT_SECRET`

Depois é só disparar um novo deploy (Deploys → Trigger deploy → Clear cache and deploy site).

Publicar pelo botão **Publish** do Lovable continua funcionando normalmente.

## Atualizar a API no futuro


Todo o contrato com a ProPixBR está em um único arquivo: `src/lib/pix.functions.ts`.

- `BASE_URL` — troque a base da API.
- `createPixDeposit` — payload e leitura da resposta de `/api/v1/deposit`.
- `checkPixStatus` — payload e leitura da resposta de `/api/v1/check`.
- A UI do checkout está em `src/components/PixCheckout.tsx` (intervalo do polling, textos e estados).
