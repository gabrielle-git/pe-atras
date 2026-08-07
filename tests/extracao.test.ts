import { describe, it, expect } from "vitest";
import { extrair } from "../lib/extracao";

describe("extrair", () => {
  it("encontra chave Pix e valor em reais", () => {
    const d = extrair("me manda um pix de R$ 100 agora");
    expect(d.chavesPix).toBe(true);
    expect(d.valores.length).toBeGreaterThan(0);
  });

  it("identifica link encurtado", () => {
    const d = extrair("clica aqui bit.ly/abcd para ver");
    expect(d.encurtadores.length).toBeGreaterThan(0);
  });

  it("detecta a troca de número (falso parente)", () => {
    const d = extrair("oi, troquei de número, salva aí");
    expect(d.trocaDeNumero).toBe(true);
  });

  it("detecta expressões de urgência", () => {
    const d = extrair("é urgente, preciso agora");
    expect(d.urgencia.length).toBeGreaterThan(0);
  });
});
