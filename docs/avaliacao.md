# Avaliação de acurácia

Um sistema que dá conselhos de segurança precisa saber o quanto acerta. Por isso o projeto mantém um conjunto de mensagens rotuladas e um script que mede o desempenho do motor de regras.

## Como rodar

    npm run evals

## O que é medido

- Acurácia: proporção de acertos no total.
- Precisão: dos casos marcados como golpe, quantos eram realmente golpe.
- Recall: dos golpes reais, quantos foram detectados.
- Falsos negativos: golpes que passaram como legítimos. É o erro mais grave, porque pode custar dinheiro à pessoa, e é o número que mais importa reduzir.

## Interpretação

Os números do script referem-se apenas ao motor de regras (sem IA). Os falsos negativos costumam ser golpes sutis, sem palavras-chave óbvias (por exemplo, um golpe de relacionamento), que a camada de IA tende a capturar melhor. Medir isso de forma honesta é o que permite melhorar o sistema com o tempo, em vez de apenas supor que ele funciona.

## Conjunto de dados

O arquivo `evals/casos.json` contém mensagens rotuladas como "golpe" ou "legitima", cobrindo os principais tipos de golpe (falso parente, falsa central do banco, prêmio falso, cobrança falsa) e mensagens legítimas do dia a dia. O conjunto pode ser ampliado ao longo do tempo.
