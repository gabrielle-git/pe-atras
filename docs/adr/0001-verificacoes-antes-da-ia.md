# ADR 0001 - Verificações determinísticas antes da IA

## Contexto
Seria possível enviar a mensagem inteira direto para o modelo de linguagem e pedir o veredito. Muitos indícios de golpe, porém, são objetivos e não precisam de IA para serem detectados.

## Decisão
Executar extração e verificações determinísticas (links, encurtadores, imitação de banco, terminação suspeita, urgência, pedido de senha) antes de acionar a IA, entregando ao modelo a mensagem somada às flags.

## Consequências
- Positivo: mais rápido, mais barato e auditável.
- Positivo: aumenta a precisão, pois a IA decide sobre evidências, não sobre suposições.
- Positivo: o motor de regras funciona de forma independente, garantindo resposta mesmo sem IA.
- Atenção: exige manutenção das regras conforme novos golpes surgem.
