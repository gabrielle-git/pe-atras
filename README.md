# Pé Atrás

Aplicação web que ajuda pessoas a identificar golpes recebidos por mensagem. A pessoa cola a mensagem suspeita e recebe uma avaliação de risco, os sinais encontrados em linguagem simples e a orientação do que fazer.

O nome resume a ideia: dar à pessoa aquele empurrão para ficar com o "pé atrás" antes de tomar uma decisão da qual pode se arrepender.

## O problema

Golpes digitais atingem cerca de 1 em cada 3 brasileiros por ano, e as maiores vítimas são idosos e pessoas com pouca familiaridade digital. O ponto central: mais de 90% das fraudes acontecem porque a própria vítima é convencida a transferir o dinheiro. O elo frágil não é a tecnologia, é a decisão humana sob pressão. É nesse instante de dúvida que o Pé Atrás atua.

## Como funciona

A análise acontece no servidor (rota de API), em camadas — as verificações objetivas rodam antes da IA:

1. Extração determinística (`lib/extracao.ts`): identifica links, chaves Pix, valores, telefones e expressões de urgência na mensagem.
2. Sinais e flags (`lib/sinais.ts`): aplica regras (link encurtado, imitação de banco, terminação de site suspeita, pedido de senha, "troquei de número"...), cada uma com um peso, e calcula um risco preliminar.
3. Classificação com IA (`lib/ia.ts`): envia a mensagem somada às flags ao modelo (via OpenRouter) e recebe risco, tipo de golpe, sinais e orientação em JSON.
4. Se a IA não estiver configurada ou falhar, o app responde com o resultado das regras (`lib/classificador.ts`) — ou seja, funciona mesmo sem chave.

A decisão de fazer as verificações objetivas antes de acionar a IA é intencional: é mais rápido, mais barato e auditável, e entrega ao modelo um contexto já qualificado. A chave da IA fica somente no servidor (variável de ambiente), nunca no navegador.

## Tecnologias

- Next.js 15 (App Router) e React 19
- TypeScript
- OpenRouter — acesso ao modelo de linguagem, com saída em JSON
- Vitest — testes
- Deploy na Vercel

## Rodando localmente

Requer Node.js 18.18 ou superior.

    npm install
    cp .env.local.example .env.local   # e preencha a chave, se quiser a IA
    npm run dev

Abra http://localhost:3000

Sem a chave do OpenRouter o app já funciona usando as regras. Com a chave, a resposta fica mais rica.

## Testes e avaliação de acurácia

Testes automatizados (unitários) do motor de análise:

    npm test

Avaliação de acurácia sobre um conjunto de mensagens rotuladas (mede acurácia, precisão, recall e falsos negativos do motor de regras):

    npm run evals

Detalhes da metodologia em `docs/avaliacao.md`.

## Variáveis de ambiente

    OPENROUTER_API_KEY   chave do OpenRouter (opcional, mas recomendada)
    OPENROUTER_MODEL     modelo a usar (opcional; padrão google/gemini-2.0-flash-001)

## Publicando na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em vercel.com, importe o repositório.
3. Em Settings > Environment Variables, adicione OPENROUTER_API_KEY (e OPENROUTER_MODEL, se quiser).
4. Faça o deploy. A Vercel gera o link público para compartilhar e demonstrar.

## Documentação

    docs/arquitetura.md        as camadas da análise e as decisões de segurança
    docs/avaliacao.md          como a acurácia é medida
    docs/privacidade-lgpd.md   tratamento de dados
    docs/adr/                  registro de decisões técnicas (ADRs)

## Estrutura

    app/
      page.tsx                interface (colar mensagem e ver o resultado)
      layout.tsx
      globals.css
      api/analisar/route.ts   rota que executa a análise no servidor
    lib/
      extracao.ts             extração de sinais (regex)
      sinais.ts               regras e flags com peso
      classificador.ts        classificação por regras (isolada e testável)
      ia.ts                   chamada ao OpenRouter
      catalogo.ts             catálogo de golpes conhecidos
      tipos.ts                tipos TypeScript
    tests/                    testes unitários (Vitest)
    evals/                    conjunto rotulado e script de acurácia
    .github/workflows/        integração contínua (build + testes a cada push)

## Aviso

Orientação educativa, não uma garantia. "Sem sinais de golpe" não significa "seguro". Na dúvida, confirme sempre por outro canal antes de pagar ou clicar.
