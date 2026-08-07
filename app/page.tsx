"use client";

import { useState } from "react";
import type { Analise } from "@/lib/tipos";

const EXEMPLO =
  "Oi mãe, troquei de número, salva aí. Tô num aperto e preciso que você me mande um Pix de R$ 450 agora, depois te explico. Não conta pra ninguém.";

function Escudo() {
  return (
    <svg className="escudo" width="54" height="54" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.4 L19.6 5.1 V11 C19.6 16 16.3 19.5 12 21.1 C7.7 19.5 4.4 16 4.4 11 V5.1 Z"
        fill="#0e7c7b"
        stroke="#0b625f"
        strokeWidth="0.6"
      />
      <path
        d="M8.3 12.3 l2.6 2.6 l4.8 -5.4"
        stroke="#ffffff"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Home() {
  const [mensagem, setMensagem] = useState("");
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function analisar() {
    if (!mensagem.trim()) {
      setErro("Cole uma mensagem para analisar.");
      return;
    }
    setErro("");
    setCarregando(true);
    setAnalise(null);
    try {
      const resp = await fetch("/api/analisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem }),
      });
      const data = await resp.json();
      if (!resp.ok) setErro(data?.erro || "Não foi possível analisar agora.");
      else setAnalise(data);
    } catch {
      setErro("Não foi possível analisar agora. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="wrap">
      <header className="topo">
        <Escudo />
        <div className="marca">Pé Atrás</div>
        <p className="sub">Recebeu uma mensagem estranha? Cole ela aqui e veja se tem cara de golpe.</p>
      </header>

      <section className="caixa">
        <label htmlFor="msg" className="rotulo">Mensagem recebida</label>
        <textarea
          id="msg"
          className="entrada"
          placeholder="Cole aqui a mensagem que você recebeu..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={6}
        />
        <div className="acoes">
          <button className="btn" onClick={analisar} disabled={carregando}>
            {carregando ? "Analisando..." : "Analisar mensagem"}
          </button>
          <button
            className="btn-fantasma"
            onClick={() => {
              setMensagem(EXEMPLO);
              setAnalise(null);
              setErro("");
            }}
          >
            Usar um exemplo
          </button>
        </div>
        {erro && <p className="erro">{erro}</p>}
      </section>

      {analise && <Resultado analise={analise} />}

      <footer className="rodape">
        Orientação educativa, não uma garantia. &ldquo;Sem sinais de golpe&rdquo; não significa &ldquo;seguro&rdquo;.
        Na dúvida, confirme sempre por outro canal antes de pagar.
      </footer>
    </main>
  );
}

function Resultado({ analise }: { analise: Analise }) {
  const rotulo: Record<Analise["risco"], string> = {
    baixo: "Risco baixo",
    medio: "Atenção",
    alto: "Risco alto",
  };

  return (
    <section className={`resultado risco-${analise.risco}`}>
      <div className="selo">{rotulo[analise.risco]}</div>
      <h2 className="tipo">{analise.tipoGolpe}</h2>
      <p className="explica">{analise.explicacao}</p>

      {analise.sinais.length > 0 && (
        <div className="bloco">
          <h3>Sinais encontrados</h3>
          <ul>
            {analise.sinais.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bloco orienta">
        <h3>O que fazer</h3>
        <p>{analise.orientacao}</p>
      </div>

      <div className="fonte">
        {analise.fonte === "ia"
          ? "Análise com apoio de inteligência artificial"
          : "Análise por regras de verificação"}
      </div>
    </section>
  );
}
