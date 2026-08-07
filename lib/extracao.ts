import type { DadosExtraidos } from "./tipos";

const ENCURTADORES = [
  "bit.ly", "tinyurl.com", "cutt.ly", "is.gd", "t.co", "goo.gl",
  "ow.ly", "rebrand.ly", "encurtador.com.br", "shorturl.at", "l1nk.dev",
];

const TERMOS_URGENCIA = [
  "urgente", "agora", "imediat", "ainda hoje", "e pra hoje", "e para hoje",
  "rapido", "rapidinho", "ultima chance", "ultima hora", "expira",
  "bloquead", "suspens", "nao conta", "em segredo", "me ajuda urgente",
];

const TERMOS_CODIGO_SENHA = ["codigo", "senha", "token", "otp", "verificacao"];

const TERMOS_TROCA_NUMERO = [
  "troquei de numero", "mudei de numero", "meu novo numero", "numero novo",
  "esse e meu novo", "novo whatsapp", "novo zap", "salva ai meu novo",
];

function semAcento(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function host(u: string): string {
  return u.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase();
}

export function extrair(textoOriginal: string): DadosExtraidos {
  const texto = semAcento(textoOriginal.toLowerCase());

  const urlRegex = /((https?:\/\/)?(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?)/gi;
  const brutas = textoOriginal.match(urlRegex) || [];
  const urls = brutas
    .map((u) => u.trim())
    .filter((u) => /\.[a-z]{2,}/i.test(u) && !/\.(?:jpg|jpeg|png|gif|pdf)$/i.test(u));

  const encurtadores = urls.filter((u) =>
    ENCURTADORES.some((e) => host(u) === e || host(u).endsWith("." + e))
  );

  const chavesPix = /\bpix\b/i.test(texto) || /transfer|deposit/i.test(texto);
  const valores = (textoOriginal.match(/r\$\s?\d[\d.,]*/gi) || []).map((v) => v.trim());
  const telefones = (textoOriginal.match(/(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/g) || [])
    .map((t) => t.trim());

  const contidos = (lista: string[]) => lista.filter((t) => texto.includes(t));

  return {
    urls,
    encurtadores,
    chavesPix,
    valores,
    telefones,
    urgencia: contidos(TERMOS_URGENCIA),
    pedeCodigoOuSenha: TERMOS_CODIGO_SENHA.some((t) => texto.includes(t)),
    trocaDeNumero: TERMOS_TROCA_NUMERO.some((t) => texto.includes(t)),
  };
}
