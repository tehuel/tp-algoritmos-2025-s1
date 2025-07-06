export function medirTiempo(fn, ...args) {
    const inico = performance.now();
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

  const todosCubiertos = U.every(e => elementosCubiertos.has(e));
  return todosCubiertos;
}

// Función para verificar si la solución es mínima
export function esSolucionMinima(seleccionados, sets, U) {
  // verificar si todos los conjuntos seleccionados son necesarios
  return seleccionados.every((esSeleccionado, i) => {
    if (esSeleccionado) {
      // Probar si al eliminar este conjunto, aún se cubre U
      const nuevaSeleccion = [...seleccionados];
      nuevaSeleccion[i] = false;
      if (esUniversoCubierto(nuevaSeleccion, sets, U)) {
        return false; // El conjunto no es necesario
      }
    }
    return true; // El conjunto es necesario
  });
}
