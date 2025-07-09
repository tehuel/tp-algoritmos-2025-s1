function yieldToMain () {
  if (globalThis.scheduler?.yield) {
    return scheduler.yield();
  }

  // Fall back to yielding with setTimeout.
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

// Función para verificar si todos los elementos de U están cubiertos
export function esUniversoCubierto(seleccionados, sets, U) {
  const elementosCubiertos = new Set();

  seleccionados.forEach((esSeleccionado, i) => {
    if (esSeleccionado) sets[i].forEach(e => elementosCubiertos.add(e));
  });

  return U.every(e => elementosCubiertos.has(e));
}

export function esSubconjuntoNecesario(indice, seleccionados, sets, U) {
    // Probar si al eliminar este conjunto, aún se cubre U
    const nuevaSeleccion = [...seleccionados];
    nuevaSeleccion[indice] = false;
    if (esUniversoCubierto(nuevaSeleccion, sets, U)) {
        return false; // El conjunto no es necesario
    }
    return true; // El conjunto es necesario    
}

// Función para verificar si la solución es mínima
export function esSolucionMinima(seleccionados, sets, U) {
  // verificar si todos los conjuntos seleccionados son necesarios
  return seleccionados.every((esSeleccionado, i) => {
    if (esSeleccionado) {
        return esSubconjuntoNecesario(i, seleccionados, sets, U);
    }
    return true; // Si no está seleccionado, no es necesario verificarlo
  });
}
