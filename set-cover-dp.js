// Función para verificar si todos los elementos de U están cubiertos
function esUniversoCubierto(seleccionados, sets, U) {
  const elementosCubiertos = new Set();

  seleccionados.forEach((vecesUsado, i) => {
    if (vecesUsado > 0) sets[i].forEach(e => elementosCubiertos.add(e));
  });

  const todosCubiertos = U.every(e => elementosCubiertos.has(e));
  return todosCubiertos;
}

// Función para verificar si la solución es mínima
function esSolucionMinima(seleccionados, sets, U) {
  // Verificar si hay conjuntos que no son necesarios  
  for (let i = 0; i < seleccionados.length; i++) {
    if (seleccionados[i] > 0) {
      // Probar si al eliminar este conjunto, aún se cubre U
      const nuevaSeleccion = [...seleccionados];
      nuevaSeleccion[i]--;
      if (esUniversoCubierto(nuevaSeleccion, sets, U)) {
        return false; // Hay un conjunto redundante
      }
    }
  }
  return true; // No hay conjuntos redundantes
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
  nuevaListaDeSeleccionados[index]++;
  const solucionesConConjunto = setCover(index + 1, nuevaListaDeSeleccionados, soluciones, sets, U);

  // Combinar todas las soluciones
  return [...solucionesSinConjunto, ...solucionesConConjunto];
}

// Función para encontrar la solución óptima usando programación dinámica
function setCoverProgramacionDinamica(sets, U) {
  const ningunSeleccionado = Array(sets.length).fill(0);

  // Llamar a la función recursiva
  const resultado = setCover(0, ningunSeleccionado, [], sets, U);

  // Si el resultado es infinito, significa que no se puede cubrir el universo
  return resultado;
}
