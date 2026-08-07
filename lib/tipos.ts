export type Risco = "baixo" | "medio" | "alto";

export interface Flag {
  codigo: string;
  descricao: string;
  peso: number;
}

export interface DadosExtraidos {
  urls: string[];
  encurtadores: string[];
  chavesPix: boolean;
  valores: string[];
  telefones: string[];
  urgencia: string[];
  pedeCodigoOuSenha: boolean;
  trocaDeNumero: boolean;
}

export interface Analise {
  risco: Risco;
  tipoGolpe: string;
  sinais: string[];
  explicacao: string;
  orientacao: string;
  flags: Flag[];
  fonte: "ia" | "regras";
}
