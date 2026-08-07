# ADR 0002 - Entregar como aplicação web, não como bot de WhatsApp

## Contexto
A ideia inicial era um bot no WhatsApp (via Meta Cloud API e n8n). Na prática, essa abordagem se mostrou frágil no prazo do projeto: o túnel local (cloudflared) muda de endereço a cada reinício, a configuração da Meta é sensível, e o número de teste tem restrições. Além disso, um bot no WhatsApp não pode ser testado diretamente por um avaliador externo.

## Decisão
Entregar o Pé Atrás como uma aplicação web em Next.js, publicada na Vercel. A pessoa cola a mensagem em uma página e recebe a análise.

## Consequências
- Positivo: elimina a dependência de túnel, número e configuração da Meta.
- Positivo: gera um link público que qualquer pessoa (incluindo o avaliador) pode testar.
- Positivo: o motor de análise é o mesmo; apenas o canal de entrada muda.
- Neutro: a integração com o WhatsApp permanece possível como evolução futura, reaproveitando o mesmo motor.
