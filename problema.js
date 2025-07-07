import { obtenerElementoRandom  } from "./utils.js";

const generarArrayUniverso = (n) => Array.from({ length: n }, (_, i) => i + 1);

const obtenerEnteroRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generarProblemaSetCover = (
  cantElementos,
  cantSubconjuntos,
  tamMinSubconjunto,
  tamMaxSubconjunto
) => {
  const universo = generarArrayUniverso(cantElementos);
  const subconjuntos = [];

  for (let i = 0; i < cantSubconjuntos; i++) {
    const tamSubconjunto = obtenerEnteroRandom(tamMinSubconjunto, tamMaxSubconjunto);
    const elementosSubconjunto = new Set();
    while (elementosSubconjunto.size < tamSubconjunto) {
      elementosSubconjunto.add(obtenerElementoRandom(universo));
    }
    subconjuntos.push(Array.from(elementosSubconjunto));
  }

  return {
    universo,
    subconjuntos,
  };
}

export const generarHashProblema = (universo, subconjuntos) => {
  const u = universo.join(",");
  const s = subconjuntos.map(s => s.join(",")).join(";");
  const hash = `${u}|${s}`;
  return btoa(hash);
}