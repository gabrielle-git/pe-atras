import { afterEach, describe, expect, it } from "vitest";
import {
  _configRateLimit,
  _resetRateLimitStore,
  extrairIp,
  verificarRateLimit,
} from "../lib/rate-limit";

afterEach(() => {
  _resetRateLimitStore();
});

describe("verificarRateLimit", () => {
  it("permite até o limite e bloqueia depois", () => {
    const { limite } = _configRateLimit();
    const chave = "teste-ip";

    for (let i = 0; i < limite; i++) {
      const r = verificarRateLimit(chave, 1_000 + i);
      expect(r.permitido).toBe(true);
    }

    const bloqueado = verificarRateLimit(chave, 1_000 + limite);
    expect(bloqueado.permitido).toBe(false);
    expect(bloqueado.restante).toBe(0);
    expect(bloqueado.retryAfterSegundos).toBeGreaterThan(0);
  });

  it("libera de novo depois da janela", () => {
    const { limite, janelaMs } = _configRateLimit();
    const chave = "teste-janela";
    const inicio = 10_000;

    for (let i = 0; i < limite; i++) {
      expect(verificarRateLimit(chave, inicio + i).permitido).toBe(true);
    }
    expect(verificarRateLimit(chave, inicio + limite).permitido).toBe(false);

    const depois = verificarRateLimit(chave, inicio + janelaMs + 1);
    expect(depois.permitido).toBe(true);
  });
});

describe("extrairIp", () => {
  it("usa o primeiro IP de x-forwarded-for", () => {
    const req = new Request("http://localhost/api/analisar", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(extrairIp(req)).toBe("1.2.3.4");
  });
});
