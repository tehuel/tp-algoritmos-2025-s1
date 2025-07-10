function yieldToMain() {
  if (globalThis.scheduler?.yield) {
    return scheduler.yield();
  }
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

export const obtenerElementoRandom = (array) => array[Math.floor(Math.random() * array.length)];

export const mezclarArray = (array) => {
  const arrayMezclado = [...array];
  for (let i = arrayMezclado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayMezclado[i], arrayMezclado[j]] = [arrayMezclado[j], arrayMezclado[i]];
  }
  return arrayMezclado;
};

export async function medirTiempo(fn, ...args) {
  const inico = performance.now();
  await yieldToMain();
  const resultado = fn(...args);
  const fin = performance.now();

  return {
    resultado,
    tiempo: fin - inico
  };
}

export function deSolucionAListadoDeIndices(seleccionados) {
  return seleccionados
    .map((s, i) => s ? i : -1)
    .filter(i => i !== -1);
}

export function deSolucionAListadoDeConjuntos(seleccionados, sets) {
  return deSolucionAListadoDeIndices(seleccionados).map(i => sets[i]);
}

export function informacionSolucion(seleccionados, sets, U) {
  return {
    seleccionados: deSolucionAListadoDeConjuntos(seleccionados, sets),
    cantidadSeleccionados: seleccionados.reduce((total, s) => total + (s ? 1 : 0), 0),
    esSolucion: esUniversoCubierto(seleccionados, sets, U),
    esMinima: esSolucionMinima(seleccionados, sets, U),
  };
}

/**
 * Verifica si el conjunto universo U está completamente cubierto por los subconjuntos seleccionados.
 *
 * @param {boolean[]} seleccionados - Array de booleanos que indica qué subconjuntos están seleccionados.
 * @param {Array<Array<number>>} sets - Array de subconjuntos, donde cada subconjunto es un array de elementos.
 * @param {Array<number>} U - Conjunto universo de elementos a cubrir.
 * @returns {boolean} Retorna true si todos los elementos de U están cubiertos por los subconjuntos seleccionados, de lo contrario false.
 */
export function esUniversoCubierto(seleccionados, sets, U) {
  const elementosCubiertos = new Set();

  seleccionados.forEach((esSeleccionado, i) => {
    if (esSeleccionado) sets[i].forEach(e => elementosCubiertos.add(e));
  });

  return U.every(e => elementosCubiertos.has(e));
}

/**
 * Determina si un subconjunto seleccionado es necesario para cubrir el universo U.
 * Un subconjunto es necesario si, al eliminarlo de la selección actual, el universo U deja de estar cubierto.
 *
 * @param {number} indice - Índice del subconjunto a evaluar dentro de la selección.
 * @param {boolean[]} seleccionados - Array de booleanos que indica qué subconjuntos están seleccionados.
 * @param {Array<Array<number>>} sets - Array de subconjuntos disponibles.
 * @param {Array<number>} U - Universo que se debe cubrir.
 * @returns {boolean} Retorna true si el subconjunto es necesario, false en caso contrario.
 */
export function esSubconjuntoNecesario(indice, seleccionados, sets, U) {
  // Probar si al eliminar este conjunto, aún se cubre U
  const nuevaSeleccion = [...seleccionados];
  nuevaSeleccion[indice] = false;
  if (esUniversoCubierto(nuevaSeleccion, sets, U)) {
    return false; // El conjunto no es necesario
  }
  return true; // El conjunto es necesario    
}

/**
 * Verifica si la selección actual de conjuntos es una solución mínima para cubrir el conjunto U.
 * Una solución es mínima si, al remover cualquier conjunto seleccionado, deja de cubrir U.
 *
 * @param {boolean[]} seleccionados - Array que indica qué conjuntos están seleccionados.
 * @param {Array<Array<number>>} sets - Array de conjuntos disponibles (cada uno es un array de números).
 * @param {Array<number>} U - Conjunto universo que debe ser cubierto (array de números).
 * @returns {boolean} Retorna true si la selección es mínima, false en caso contrario.
 */
export function esSolucionMinima(seleccionados, sets, U) {
  // verificar si todos los conjuntos seleccionados son necesarios
  return seleccionados.every((esSeleccionado, i) => {
    if (esSeleccionado) {
      return esSubconjuntoNecesario(i, seleccionados, sets, U);
    }
    return true; // Si no está seleccionado, no es necesario verificarlo
  });
}
