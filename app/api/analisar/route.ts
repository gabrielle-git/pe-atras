import { extrair } from "@/lib/extracao";
import { gerarFlags } from "@/lib/sinais";
import { classificarComIA } from "@/lib/ia";
import { classificarPorRegras } from "@/lib/classificador";
import { extrairIp, verificarRateLimit } from "@/lib/rate-limit";
import type { Analise } from "@/lib/tipos";

export async function POST(req: Request) {
  const limite = verificarRateLimit(extrairIp(req));
  if (!limite.permitido) {
    return Response.json(
      { erro: "Muitas análises seguidas. Espere um pouco e tente de novo." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limite.retryAfterSegundos),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let mensagem = "";
  try {
    const body = await req.json();
    mensagem = (body?.mensagem ?? "").toString();
  } catch {
    return Response.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  mensagem = mensagem.trim();
  if (!mensagem) return Response.json({ erro: "Cole uma mensagem para analisar." }, { status: 400 });
  if (mensagem.length > 4000) mensagem = mensagem.slice(0, 4000);

  const dados = extrair(mensagem);
  const flags = gerarFlags(dados);

  const daIA = await classificarComIA(mensagem, flags, dados);
  const analise: Analise = daIA ?? classificarPorRegras(mensagem);

  return Response.json(analise);
}
