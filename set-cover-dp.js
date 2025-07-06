import { esUniversoCubierto, esSolucionMinima } from './utils.js';

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
export function setCoverProgramacionDinamica(U, sets) {
  const seleccionadosInicial = Array(sets.length).fill(false);

  // Llamar a la función recursiva
  const resultado = setCover(0, seleccionadosInicial, [], sets, U);

  // Si el resultado es infinito, significa que no se puede cubrir el universo
  return resultado;
}
