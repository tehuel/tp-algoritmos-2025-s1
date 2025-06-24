// Función para verificar si todos los elementos de U están cubiertos
function esUniversoCubierto(seleccionados, sets, U) {
  const elementosCubiertos = new Set();

  seleccionados.forEach((vecesUsado, i) => {
    if (vecesUsado > 0) sets[i].forEach(e => elementosCubiertos.add(e));
  });
  
  // Verificar si todos los elementos de U están en los cubiertos
  return U.every(e => elementosCubiertos.has(e));
}

// funcion recursiva para encontrar la solución óptima
function setCover(index, seleccionados, sets, U) {

  console.log(`${ '-'.repeat(index) } setCover`, {index, seleccionados});

  // caso base: si todos los elementos de U están cubiertos
  if (esUniversoCubierto(seleccionados, sets, U)) {
    // retorna cantidad de conjuntos seleccionados
    const cantidad = seleccionados.reduce((sum, val) => sum + val, 0);
    console.log(`${ '-'.repeat(index) } > esUniversoCubierto`, {cantidad, seleccionados});
    return cantidad;
  }

  // caso base: si se han revisado todos los conjuntos
  if (index >= sets.length) return Infinity;

  // Opción 1: No incluir el conjunto actual
  const sinIncluir = setCover(index + 1, seleccionados, sets, U);

  // Opción 2: Incluir el conjunto actual
  const nuevaListaDeSeleccionados = [...seleccionados];
  nuevaListaDeSeleccionados[index]++;
  const conIncluir = setCover(index + 1, nuevaListaDeSeleccionados, sets, U);

  // Retornar el mínimo entre las dos opciones
  return Math.min(sinIncluir, conIncluir);
}

// Función para encontrar la solución óptima usando programación dinámica
function setCoverProgramacionDinamica(sets, U) {
  const ningunSeleccionado = Array(sets.length).fill(0);

  // Llamar a la función recursiva
  const resultado = setCover(0, ningunSeleccionado, sets, U);

  // Si el resultado es infinito, significa que no se puede cubrir el universo
  return resultado === Infinity ? null : resultado;
}
