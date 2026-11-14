# Edna & Célia Salgados: página de links

Página única com a logo e 3 botões: **Fazer pedido pelo site**, **Ver cardápio**
e **Falar no WhatsApp**. Feita para ser aberta pelo link da bio do Instagram e
pelo WhatsApp. Não é indexada pelo Google, não tem banco, login nem analytics.

## Editar textos e links

Tudo fica em [`src/lib/config.js`](src/lib/config.js): nome, frase, WhatsApp,
horário e endereço.

As imagens ficam em `public/`:

| Arquivo               | O que é                                           |
| --------------------- | ------------------------------------------------- |
| `public/logo.png`     | Logo da loja                                      |
| `public/cardapio.jpg` | Imagem do cardápio (pode ser vertical e grande)   |

O favicon (`src/app/icon.png` e `src/app/apple-icon.png`) foi gerado a partir
da logo. Se trocar a logo, gere de novo os dois ícones.

## Variável de ambiente

| Nome                           | Para quê                                  |
| ------------------------------ | ----------------------------------------- |
| `NEXT_PUBLIC_SITE_PEDIDOS_URL` | Endereço do site de pedidos (botão 1)     |

Copie o exemplo e coloque o endereço real:

```bash
cp .env.example .env.local
```

Se a variável não estiver definida, o botão "Fazer pedido pelo site" leva para
o WhatsApp, para nunca virar um link quebrado.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Para testar a versão de produção: `npm run build && npm start`.

## Publicar na Vercel

1. Suba o projeto para o GitHub.
2. Na Vercel: **Add New → Project** e importe o repositório (o framework é
   detectado como Next.js; não precisa mudar nada no build).
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SITE_PEDIDOS_URL` com o
   endereço do site de pedidos (marque Production e Preview).
4. Clique em **Deploy**.

Se mudar a variável depois, faça um **Redeploy**: variáveis `NEXT_PUBLIC_` são
gravadas no site na hora do build.
