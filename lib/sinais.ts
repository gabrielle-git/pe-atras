import type { DadosExtraidos, Flag, Risco } from "./tipos";

// Nomes de bancos (para detectar imitação) e seus domínios oficiais (para não acusar o verdadeiro)
const BANCOS = [
  "nubank", "itau", "bradesco", "santander", "caixa", "bancodobrasil",
  "inter", "sicoob", "sicredi", "picpay", "mercadopago", "c6bank",
];
const DOMINIOS_OFICIAIS = [
  "nubank.com.br", "itau.com.br", "bradesco.com.br", "santander.com.br",
  "caixa.gov.br", "bb.com.br", "bancointer.com.br", "sicoob.com.br",
  "sicredi.com.br", "picpay.com", "mercadopago.com.br", "c6bank.com.br",
];
const TLDS_SUSPEITOS = ["top", "xyz", "click", "live", "buzz", "rest", "quest", "monster", "sbs"];

function host(u: string): string {
  return u.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase();
}

function pareceBancoFalso(urls: string[]): boolean {
  return urls.some((u) => {
    const h = host(u);
    if (DOMINIOS_OFICIAIS.some((d) => h === d || h.endsWith("." + d))) return false;
    return BANCOS.some((b) => h.includes(b));
  });
}

function temTldSuspeito(urls: string[]): boolean {
  return urls.some((u) => {
    const tld = host(u).split(".").pop() || "";
    return TLDS_SUSPEITOS.includes(tld);
  });
}

export function gerarFlags(d: DadosExtraidos): Flag[] {
  const flags: Flag[] = [];
  const add = (codigo: string, descricao: string, peso: number) =>
    flags.push({ codigo, descricao, peso });

  if (d.encurtadores.length) add("link_encurtado", "Contém link encurtado, que esconde o endereço real de destino", 2);
  if (pareceBancoFalso(d.urls)) add("banco_falso", "Link parece imitar o de um banco, mas não é o endereço oficial", 3);
  if (temTldSuspeito(d.urls)) add("tld_suspeito", "Link com terminação de site frequentemente usada em golpes", 2);
  if (d.pedeCodigoOuSenha) add("pede_codigo_senha", "Pede código, senha ou token — algo que ninguém legítimo pede", 3);
  if (d.trocaDeNumero) add("troca_numero", "Alega ter trocado de número (tática comum do golpe do falso parente)", 3);
  if (d.urgencia.length) add("urgencia", "Cria senso de urgência para você agir sem pensar", 1);
  if (d.chavesPix && d.valores.length) add("pix_valor", "Pede transferência de dinheiro via Pix", 1);
  else if (d.chavesPix) add("pix", "Menciona Pix ou transferência de dinheiro", 1);

  return flags;
}

export function riscoPorFlags(flags: Flag[]): Risco {
  const total = flags.reduce((s, f) => s + f.peso, 0);
  if (total >= 5) return "alto";
  if (total >= 2) return "medio";
  return "baixo";
}
