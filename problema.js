const generarArrayUniverso = (n) => Array.from({ length: n }, (_, i) => i + 1);

const obtenerEnteroRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const obtenerElementoRandom = (array) => array[Math.floor(Math.random() * array.length)];

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
