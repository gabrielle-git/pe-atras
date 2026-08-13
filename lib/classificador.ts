import { extrair } from "./extracao";
import { gerarFlags, riscoPorFlags } from "./sinais";
import type { Analise } from "./tipos";

// Classificacao apenas por regras (sem IA). Isolada aqui para poder ser
// testada e avaliada de forma independente da rota e do modelo.
export function classificarPorRegras(mensagem: string): Analise {
  const dados = extrair(mensagem);
  const flags = gerarFlags(dados);
  const risco = riscoPorFlags(flags);
  const sinais = flags.map((f) => f.descricao);

  let tipoGolpe = "Nenhum identificado";
  if (flags.some((f) => f.codigo === "troca_numero")) tipoGolpe = "Golpe do falso parente";
  else if (flags.some((f) => f.codigo === "banco_falso" || f.codigo === "pede_codigo_senha"))
    tipoGolpe = "Falsa central do banco";
  else if (flags.some((f) => f.codigo === "link_encurtado" || f.codigo === "tld_suspeito"))
    tipoGolpe = "Mensagem com link suspeito";

  const explicacao =
    risco === "baixo"
      ? "Não encontramos sinais fortes de golpe nesta mensagem. Ainda assim, continue atenta: golpes mudam o tempo todo."
      : "Esta mensagem tem características comuns em golpes. Vale muito a pena desconfiar antes de fazer qualquer coisa.";

  const orientacao =
    risco === "baixo"
      ? "Na dúvida, confirme sempre com a pessoa ou empresa por um canal que você já conhece."
      : "Não clique em links, não pague e não envie códigos. Confirme por outro canal (uma ligação, por exemplo) antes de agir.";

  return { risco, tipoGolpe, sinais, explicacao, orientacao, flags, fonte: "regras" };
}
