type Entrada = { timestamps: number[] };

const store = new Map<string, Entrada>();

const LIMITE = Number(process.env.RATE_LIMIT_MAX) || 5;
const JANELA_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000;

export type ResultadoRateLimit = {
  permitido: boolean;
  restante: number;
  retryAfterSegundos: number;
};

/** Limite por chave (ex.: IP) em janela deslizante, em memória no processo. */
export function verificarRateLimit(chave: string, agora = Date.now()): ResultadoRateLimit {
  const inicio = agora - JANELA_MS;
  const atual = store.get(chave)?.timestamps.filter((t) => t > inicio) ?? [];

  if (atual.length >= LIMITE) {
    store.set(chave, { timestamps: atual });
    const maisAntigo = atual[0] ?? agora;
    const retryAfterSegundos = Math.max(1, Math.ceil((maisAntigo + JANELA_MS - agora) / 1000));
    return { permitido: false, restante: 0, retryAfterSegundos };
  }

  atual.push(agora);
  store.set(chave, { timestamps: atual });
  return {
    permitido: true,
    restante: Math.max(0, LIMITE - atual.length),
    retryAfterSegundos: 0,
  };
}

export function extrairIp(req: Request): string {
  const encaminhado = req.headers.get("x-forwarded-for");
  if (encaminhado) {
    const primeiro = encaminhado.split(",")[0]?.trim();
    if (primeiro) return primeiro;
  }
  return req.headers.get("x-real-ip")?.trim() || "desconhecido";
}

/** Só para testes. */
export function _resetRateLimitStore() {
  store.clear();
}

export function _configRateLimit() {
  return { limite: LIMITE, janelaMs: JANELA_MS };
}
