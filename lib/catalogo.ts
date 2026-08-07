export interface Golpe {
  tipo: string;
  nome: string;
  descricao: string;
  sinais: string[];
  orientacao: string;
}

export const CATALOGO: Golpe[] = [
  {
    tipo: "falso_parente",
    nome: "Golpe do falso parente",
    descricao: "Alguém usa um número desconhecido, diz ser um familiar que trocou de número e pede dinheiro com urgência.",
    sinais: ["número desconhecido", "alega ter trocado de número", "pedido urgente de dinheiro", "apelo emocional"],
    orientacao: "Não transfira. Ligue para o número antigo da pessoa e confirme por outro canal antes de qualquer coisa.",
  },
  {
    tipo: "falso_banco",
    nome: "Falsa central do banco",
    descricao: "Mensagem ou ligação fingindo ser do banco, pedindo senha, código ou instalação de aplicativo.",
    sinais: ["pede senha ou código", "link parecido com o do banco", "finge ser funcionário", "urgência"],
    orientacao: "Bancos nunca pedem senha. Ligue você mesma para o número oficial no verso do cartão.",
  },
  {
    tipo: "premio_falso",
    nome: "Prêmio ou sorteio falso",
    descricao: "Diz que você ganhou um prêmio e pede dados ou o pagamento de uma taxa para liberar.",
    sinais: ["você ganhou", "pede taxa para liberar", "link suspeito", "pede dados pessoais"],
    orientacao: "Prêmio de verdade não cobra taxa. Não clique em links nem informe dados.",
  },
  {
    tipo: "cobranca_falsa",
    nome: "Cobrança ou boleto falso",
    descricao: "Boleto ou cobrança adulterada, muitas vezes com urgência e ameaça de bloqueio.",
    sinais: ["boleto inesperado", "ameaça de bloqueio", "urgência para pagar"],
    orientacao: "Confira a cobrança direto no aplicativo ou site oficial da empresa antes de pagar.",
  },
];

export function resumoCatalogo(): string {
  return CATALOGO.map((g) => `- ${g.nome}: ${g.descricao}`).join("\n");
}
