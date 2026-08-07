import casos from "./casos.json";
import { classificarPorRegras } from "../lib/classificador";

type Caso = { texto: string; rotulo: "golpe" | "legitima" };
const dados = casos as Caso[];

let vp = 0, vn = 0, fp = 0, fn = 0;
const erros: string[] = [];

for (const c of dados) {
  const r = classificarPorRegras(c.texto);
  // risco baixo => tratamos como "legitima"; medio ou alto => "golpe"
  const previsto: "golpe" | "legitima" = r.risco === "baixo" ? "legitima" : "golpe";

  if (previsto === "golpe" && c.rotulo === "golpe") vp++;
  else if (previsto === "legitima" && c.rotulo === "legitima") vn++;
  else if (previsto === "golpe" && c.rotulo === "legitima") {
    fp++;
    erros.push(`[FALSO POSITIVO] tratou como golpe uma mensagem legitima:\n     "${c.texto}"`);
  } else {
    fn++;
    erros.push(`[FALSO NEGATIVO] deixou passar um golpe:\n     "${c.texto}"`);
  }
}

const total = dados.length;
const pct = (n: number, d: number) => (d ? ((n / d) * 100).toFixed(1) : "-");

console.log("=====================================================");
console.log("  Avaliacao de acuracia do Pe Atras (motor de regras)");
console.log("=====================================================\n");
console.log(`Casos avaliados: ${total}\n`);
console.log(`Acuracia: ${pct(vp + vn, total)}%   (acertos: ${vp + vn} de ${total})`);
console.log(`Precisao: ${pct(vp, vp + fp)}%   (dos marcados como golpe, quantos eram golpe)`);
console.log(`Recall:   ${pct(vp, vp + fn)}%   (dos golpes reais, quantos foram detectados)\n`);
console.log("Matriz de confusao:");
console.log(`  Golpes detectados corretamente (VP): ${vp}`);
console.log(`  Legitimas corretas (VN):             ${vn}`);
console.log(`  Falsos positivos (FP):               ${fp}`);
console.log(`  Falsos negativos (FN):               ${fn}   <- os mais graves`);

if (erros.length) {
  console.log("\n-----------------------------------------------------");
  console.log("Casos que o motor de regras errou:");
  console.log("-----------------------------------------------------");
  erros.forEach((e) => console.log("  " + e));
}

console.log("\nObservacao: estes numeros sao apenas do motor de regras (sem IA).");
console.log("Os falsos negativos costumam ser golpes sutis, sem palavras-chave obvias,");
console.log("que a camada de IA tende a capturar melhor. Medir isso e' o que permite melhorar.");
