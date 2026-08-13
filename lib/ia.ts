import type { Analise, DadosExtraidos, Flag } from "./tipos";
import { resumoCatalogo } from "./catalogo";

const MODELO = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

function extrairJSON(txt: string): string | null {
  const semFences = txt.replace(/```json/gi, "").replace(/```/g, "").trim();
  const ini = semFences.indexOf("{");
  const fim = semFences.lastIndexOf("}");
  if (ini !== -1 && fim !== -1 && fim > ini) return semFences.slice(ini, fim + 1);
  return null;
}

export async function classificarComIA(
  texto: string,
  flags: Flag[],
  _dados: DadosExtraidos
): Promise<Analise | null> {
  const chave = process.env.OPENROUTER_API_KEY;
  if (!chave) return null;

  const flagsTexto = flags.length
    ? flags.map((f) => `- ${f.descricao}`).join("\n")
    : "- Nenhum sinal objetivo detectado pelas regras.";

  const sistema = `Você é um analista de segurança do "Pé Atrás", um serviço que ajuda pessoas (em especial idosos) a identificar golpes recebidos por mensagem.
Responda SOMENTE com um objeto JSON, sem nenhum texto fora dele, neste formato:
{
  "risco": "baixo | medio | alto",
  "tipoGolpe": "nome do golpe mais provável, ou 'Nenhum identificado'",
  "sinais": ["frases curtas e simples do que é suspeito"],
  "explicacao": "explicação curta em linguagem simples, sem termos técnicos",
  "orientacao": "o que a pessoa deve fazer agora, em uma ou duas frases"
}
Regras: escreva para uma pessoa idosa; nunca afirme que a mensagem é 100% segura; sempre que houver risco, oriente confirmar por outro canal antes de pagar ou clicar.
Tipos de golpe conhecidos:
${resumoCatalogo()}`;

  const usuario = `Mensagem recebida:
"""
${texto}
"""

Sinais objetivos já detectados:
${flagsTexto}`;

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELO,
        temperature: 0.2,
        messages: [
          { role: "system", content: sistema },
          { role: "user", content: usuario },
        ],
      }),
    });

    if (!resp.ok) return null;

    const data = await resp.json();
    const conteudo: string = data?.choices?.[0]?.message?.content ?? "";
    const bloco = extrairJSON(conteudo);
    if (!bloco) return null;

    const parsed = JSON.parse(bloco);
    return {
      risco: parsed.risco === "alto" || parsed.risco === "medio" ? parsed.risco : "baixo",
      tipoGolpe: parsed.tipoGolpe ?? "Nenhum identificado",
      sinais: Array.isArray(parsed.sinais) ? parsed.sinais : [],
      explicacao: parsed.explicacao ?? "",
      orientacao: parsed.orientacao ?? "",
      flags,
      fonte: "ia",
    };
  } catch {
    return null;
  }
}
