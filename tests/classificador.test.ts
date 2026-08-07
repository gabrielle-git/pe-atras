import { describe, it, expect } from "vitest";
import { classificarPorRegras } from "../lib/classificador";

describe("classificarPorRegras", () => {
  it("marca o golpe do falso parente como risco alto", () => {
    const r = classificarPorRegras(
      "Oi mãe, troquei de número, me manda um Pix de R$ 450 agora, é urgente."
    );
    expect(r.risco).toBe("alto");
    expect(r.tipoGolpe).toBe("Golpe do falso parente");
  });

  it("marca uma mensagem legítima como risco baixo", () => {
    const r = classificarPorRegras("Bom dia! Confirmando sua consulta de amanhã às 14h.");
    expect(r.risco).toBe("baixo");
    expect(r.flags.length).toBe(0);
  });

  it("detecta link que imita um banco", () => {
    const r = classificarPorRegras("Sua conta será bloqueada. Acesse bradesco-seguranca.xyz urgente");
    expect(r.risco).not.toBe("baixo");
    expect(r.flags.some((f) => f.codigo === "banco_falso")).toBe(true);
  });

  it("nunca retorna conteúdo vazio de orientação", () => {
    const r = classificarPorRegras("qualquer mensagem");
    expect(r.orientacao.length).toBeGreaterThan(0);
    expect(r.explicacao.length).toBeGreaterThan(0);
  });
});
