"use client";

import { useState } from "react";
import type { Analise } from "@/lib/tipos";

const MAX_CARACTERES = 4000;

const EXEMPLOS = {
  familiar:
    "Oi mãe, troquei de número, salva aí. Tô num aperto e preciso que você me mande um Pix de R$ 450 agora, depois te explico. Não conta pra ninguém.",
  banco:
    "BANCO: Identificamos um acesso suspeito na sua conta. Para evitar o bloqueio, confirme seus dados imediatamente em https://bit.ly/conta-segura.",
  entrega:
    "Sua encomenda está retida. É necessário pagar uma taxa de R$ 8,90 para liberar a entrega. Acesse o link e regularize agora.",
};

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

      if (!resp.ok) {
        setErro(data?.erro || "Não foi possível analisar agora.");
      } else {
        setAnalise(data);

        window.setTimeout(() => {
          document.getElementById("resultado")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 80);
      }
    } catch {
      setErro("Não foi possível analisar agora. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  function usarExemplo(tipo: keyof typeof EXEMPLOS) {
    setMensagem(EXEMPLOS[tipo]);
    setAnalise(null);
    setErro("");
  }

  return (
    <main className="pagina">
      <header className="cabecalho">
        <a className="marca" href="#" aria-label="Pé Atrás, início">
          Pé Atrás
        </a>

        <nav className="nav" aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>

          <a
            href="https://github.com/gabrielle-git/pe-atras"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <section className="introducao" aria-labelledby="titulo-principal">
        <p className="sobretitulo">VERIFIQUE ANTES DE CONFIAR</p>

        <h1 id="titulo-principal">Ficou com o pé atrás?</h1>

        <p className="resumo">
          Cole a mensagem que você recebeu. O Pé Atrás procura sinais comuns de
          fraude e explica o que merece sua atenção antes que você tome uma
          decisão.
        </p>
      </section>

      <section className="ferramenta" aria-labelledby="titulo-ferramenta">
        <div className="titulo-secao">
          <h2 id="titulo-ferramenta">Analisar uma mensagem</h2>

          <p>
            Cole o conteúdo exatamente como chegou para que a análise tenha mais
            contexto.
          </p>
        </div>

        <div className="campo">
          <label htmlFor="msg" className="rotulo">
            Mensagem recebida
          </label>

          <textarea
            id="msg"
            className="entrada"
            placeholder="Cole aqui a mensagem que você recebeu..."
            value={mensagem}
            onChange={(e) =>
              setMensagem(e.target.value.slice(0, MAX_CARACTERES))
            }
            rows={6}
            maxLength={MAX_CARACTERES}
            aria-describedby="privacidade contador"
          />

          <div className="campo-meta">
            <p id="privacidade">
              Evite inserir senhas, códigos ou dados bancários completos.
            </p>

            <p id="contador" aria-live="polite">
              {mensagem.length}/{MAX_CARACTERES}
            </p>
          </div>
        </div>

        <div className="acoes">
          <button
            className="btn-principal"
            onClick={analisar}
            disabled={carregando}
          >
            {carregando ? "Analisando mensagem..." : "Analisar mensagem"}

            {!carregando && <span aria-hidden="true">→</span>}
          </button>
        </div>

        <div className="exemplos" aria-label="Mensagens de exemplo">
          <span>Quer testar primeiro?</span>

          <button type="button" onClick={() => usarExemplo("familiar")}>
            Falso familiar
          </button>

          <button type="button" onClick={() => usarExemplo("banco")}>
            Banco
          </button>

          <button type="button" onClick={() => usarExemplo("entrega")}>
            Entrega
          </button>
        </div>

        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}

        {carregando && (
          <div className="carregamento" aria-live="polite">
            <div className="linha-carregamento" aria-hidden="true">
              <span />
            </div>

            <p>A mensagem está sendo verificada.</p>
          </div>
        )}
      </section>

      {analise && <Resultado analise={analise} />}

      <section
        className="como-funciona"
        id="como-funciona"
        aria-labelledby="titulo-como-funciona"
      >
        <div className="titulo-secao">
          <h2 id="titulo-como-funciona">Como funciona</h2>

          <p>
            O Pé Atrás combina verificações objetivas com análise de contexto.
          </p>
        </div>

        <div className="etapas">
          <article className="etapa etapa-a">
            <span>01</span>

            <h3>Sinais conhecidos</h3>

            <p>
              Procura urgência, Pix, links suspeitos, troca de número e outros
              padrões recorrentes em golpes.
            </p>
          </article>

          <article className="etapa etapa-b">
            <span>02</span>

            <h3>Contexto da mensagem</h3>

            <p>
              Avalia como esses elementos aparecem juntos e qual abordagem está
              sendo usada.
            </p>
          </article>

          <article className="etapa etapa-c">
            <span>03</span>

            <h3>Explicação do resultado</h3>

            <p>
              Mostra por que a mensagem chamou atenção e orienta qual deve ser o
              próximo passo.
            </p>
          </article>
        </div>
      </section>

      <section className="aviso" aria-labelledby="titulo-aviso">
        <p className="aviso-rotulo">IMPORTANTE</p>

        <div>
          <h2 id="titulo-aviso">Na dúvida, confirme por outro canal.</h2>

          <p>
            O Pé Atrás oferece uma orientação educativa, não uma garantia.
            “Sem sinais de golpe” não significa “seguro”. Antes de pagar,
            clicar ou compartilhar dados, confirme a informação pelo site,
            aplicativo ou contato oficial.
          </p>
        </div>
      </section>

      <footer className="rodape">
        <p>Pé Atrás</p>

        <p>Projeto acadêmico sobre prevenção a golpes digitais.</p>
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

  const tituloSinais: Record<Analise["risco"], string> = {
    baixo: "O que observamos",
    medio: "Sinais de atenção",
    alto: "Por que desconfiar",
  };

  const tituloResultado =
    analise.risco === "baixo" &&
    analise.tipoGolpe.toLowerCase() === "nenhum identificado"
      ? "Nenhum golpe identificado"
      : analise.tipoGolpe;

  return (
    <section
      className={`resultado risco-${analise.risco}`}
      id="resultado"
      aria-labelledby="titulo-resultado"
    >
      <div className="resultado-topo">
        <p className="resultado-label">Resultado da análise</p>

        <span className="status-risco">{rotulo[analise.risco]}</span>
      </div>

      <h2 id="titulo-resultado" className="tipo-golpe">
        {tituloResultado}
      </h2>

      <p className="explicacao">{analise.explicacao}</p>

      {analise.sinais.length > 0 && (
        <div className="painel-sinais">
          <h3>{tituloSinais[analise.risco]}</h3>

          <ol className="lista-sinais">
            {analise.sinais.map((sinal, i) => (
              <li key={`${sinal}-${i}`}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{sinal}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="orientacao">
        <h3>O que fazer agora</h3>

        <p>{analise.orientacao}</p>
      </div>

      <p className="fonte">
        {analise.fonte === "ia"
          ? "Análise realizada com apoio de inteligência artificial."
          : "Análise realizada por regras de verificação."}
      </p>
    </section>
  );
}