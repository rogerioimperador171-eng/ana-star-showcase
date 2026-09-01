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

## Publicação

O projeto roda em TanStack Start (SSR) e é publicado pelo botão **Publish** do Lovable — o backend
das rotas de pagamento sobe junto, sem configuração extra. Não é necessário `netlify.toml` nem
Netlify Functions: as funções de servidor do TanStack cumprem exatamente esse papel (protegem as
credenciais no servidor). Caso queira hospedar em outro provedor, use um host com suporte a SSR
(Node/Edge) e defina as duas variáveis de ambiente acima no painel do provedor.

## Atualizar a API no futuro

Todo o contrato com a ProPixBR está em um único arquivo: `src/lib/pix.functions.ts`.

- `BASE_URL` — troque a base da API.
- `createPixDeposit` — payload e leitura da resposta de `/api/v1/deposit`.
- `checkPixStatus` — payload e leitura da resposta de `/api/v1/check`.
- A UI do checkout está em `src/components/PixCheckout.tsx` (intervalo do polling, textos e estados).
