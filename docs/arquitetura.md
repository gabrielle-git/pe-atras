# Arquitetura

## Visão geral

O Pé Atrás é uma aplicação web (Next.js). A pessoa cola uma mensagem suspeita e recebe uma avaliação. Toda a análise acontece no servidor, em uma rota de API (`app/api/analisar/route.ts`), organizada em camadas — as verificações objetivas rodam antes da IA.

## Fluxo de análise

    Navegador (a pessoa cola a mensagem)
            |
            v
    Rota de API (servidor)
            |
            v
    [1] Extracao deterministica (lib/extracao.ts)
        links, chaves Pix, valores, telefones, urgencia
            |
            v
    [2] Sinais e flags com peso (lib/sinais.ts)
        link encurtado, imitacao de banco, TLD suspeito,
        pedido de senha, "troquei de numero"...
            |
            v
    [3] Classificacao com IA (lib/ia.ts, via OpenRouter)
        recebe a mensagem + as flags -> JSON estruturado
            |
            v
    Se a IA nao estiver configurada ou falhar:
    [3b] Classificacao por regras (lib/classificador.ts)
            |
            v
    Resposta: risco, tipo de golpe, sinais e orientacao

## Por que verificar antes de usar a IA

Boa parte dos indícios de golpe é objetiva (um link encurtado, um domínio que imita um banco, um pedido de senha). Resolver isso com código determinístico é mais rápido, mais barato e auditável, e entrega ao modelo um contexto já qualificado. É uma decisão de arquitetura de segurança, não apenas uma chamada a um chatbot.

## Resiliência

O motor de regras funciona de forma independente da IA. Se a chave não estiver configurada, ou se a chamada ao modelo falhar, a aplicação ainda responde com o resultado das regras. Ou seja, o serviço não deixa a pessoa sem resposta.

## Segurança

A chave da IA fica somente no servidor (variável de ambiente) e nunca é exposta ao navegador. A entrada é validada e limitada em tamanho antes de ser processada.
