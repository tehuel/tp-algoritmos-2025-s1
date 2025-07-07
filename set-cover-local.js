import { mezclarArray, esUniversoCubierto, esSolucionMinima, esSubconjuntoNecesario } from './utils.js';

export function setCoverBusquedaLocal (U, sets) {
    // solucion inicial: todos los subconjuntos
    const seleccionados = Array(sets.length).fill(true);

    // candidatos a eliminar: todos los subconjuntos
    let candidatos = mezclarArray(sets.map((_, index) => index));

    // Mientras haya mejoras
    let mejorado = true;
    while (mejorado) {
        mejorado = false;

        // Buscar un subconjunto que se pueda eliminar
        while (candidatos.length) {
            const indice = candidatos.pop();
            if (!esSubconjuntoNecesario(indice, seleccionados, sets, U)) {
                // Si el subconjunto no es necesario, eliminarlo
                seleccionados[indice] = false;
                mejorado = true;
                break; // Salir del bucle para reiniciar la búsqueda
            }
        }
    }

    // Verificar si la solución es válida
    if (!esUniversoCubierto(seleccionados, sets, U)) {
        console.warn("No se pudo cubrir el universo con los subconjuntos seleccionados.");
        return []; // No se pudo cubrir el universo
    }

    // Verificar si la solución es mínima
    if (!esSolucionMinima(seleccionados, sets, U)) {
        console.warn("La solución encontrada no es mínima.");
        return []; // No es una solución mínima
    }

    // Devolver los subconjuntos seleccionados
    return [ seleccionados ];
}