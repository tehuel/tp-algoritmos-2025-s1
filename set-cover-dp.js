// Función para verificar si todos los elementos de U están cubiertos
function esUniversoCubierto(seleccionados, sets, U) {
  const elementosCubiertos = new Set();

  seleccionados.forEach((esSeleccionado, i) => {
    if (esSeleccionado) sets[i].forEach(e => elementosCubiertos.add(e));
  });

  const todosCubiertos = U.every(e => elementosCubiertos.has(e));
  return todosCubiertos;
}

// Función para verificar si la solución es mínima
function esSolucionMinima(seleccionados, sets, U) {
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

// funcion recursiva para encontrar la solución óptima
function setCover(index, seleccionados, soluciones, sets, U) {
  // caso base: si todos los elementos de U están cubiertos
  if (esUniversoCubierto(seleccionados, sets, U) && esSolucionMinima(seleccionados, sets, U)) {
    // Devolver una copia de la solución encontrada
    return [[...seleccionados]];
  }

  // caso base: si se han revisado todos los conjuntos
  if (index >= sets.length) return [];

  // Opción 1: No incluir el conjunto actual
  const solucionesSinConjunto = setCover(index + 1, seleccionados, soluciones, sets, U);

  // Opción 2: Incluir el conjunto actual
  const nuevaListaDeSeleccionados = [...seleccionados];
  nuevaListaDeSeleccionados[index] = true;
  const solucionesConConjunto = setCover(index + 1, nuevaListaDeSeleccionados, soluciones, sets, U);

  // Combinar todas las soluciones
  return [...solucionesSinConjunto, ...solucionesConConjunto];
}

// Función para encontrar la solución óptima usando programación dinámica
function setCoverProgramacionDinamica(sets, U) {
  const seleccionadosInicial = Array(sets.length).fill(false);

  // Llamar a la función recursiva
  const resultado = setCover(0, seleccionadosInicial, [], sets, U);

  // Si el resultado es infinito, significa que no se puede cubrir el universo
  return resultado;
}
