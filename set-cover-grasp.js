import { mezclarArray, esUniversoCubierto, esSubconjuntoNecesario } from './utils.js';

// la calidad del candidato se mide por la cantidad de NUEVOS elementos que cubre
function calidadCandidato (U, sets, solucion, candidato) {
    const elementosCubiertos = new Set();
    solucion.forEach((esSeleccionado, i) => {
        if (esSeleccionado) sets[i].forEach(e => elementosCubiertos.add(e));
    });

    // contar los nuevos elementos que cubre el candidato
    let nuevosElementos = 0;
    sets[candidato].forEach(e => {
        if (!elementosCubiertos.has(e) && U.includes(e)) {
            nuevosElementos++;
        }
    });

    return nuevosElementos;
}

function greedyAleatorio (U, sets, candidatosMax, aleatoriedad) {
    const noCubiertos = new Set(U);
    const seleccionados = Array(sets.length).fill(false);

    // construyo una solución cubriendo todos los elementos de U
    while (noCubiertos.size) {
        // obtengo una lista de los mejores candidatos
        const candidatosConCalidad = sets
            .map((set, i) => ({ indice: i, calidad: calidadCandidato(U, sets, seleccionados, i) }))
            .filter(c => c.calidad > 0) // solo candidatos que cubren nuevos elementos
            .sort((a, b) => b.calidad - a.calidad) // ordeno por calidad
            .slice(0, candidatosMax); // me quedo con los mejores candidatos

        if (!candidatosConCalidad.length) {
            console.log('No hay más candidatos que cubran nuevos elementos.');
            break;
        }

        const candidatosAleatorios = Math.random() < aleatoriedad
            ? mezclarArray(candidatosConCalidad)
            : candidatosConCalidad; 

        const indiceSeleccionado = candidatosAleatorios.pop().indice;
        seleccionados[indiceSeleccionado] = true;
        sets[indiceSeleccionado].forEach(e => noCubiertos.delete(e));
    }
    return seleccionados;
}

function localSearch (U, sets, seleccionados) {
    let mejorSeleccion = [...seleccionados];

    // intento mejorar la solución eliminando subconjuntos innecesarios
    for (let i = 0; i < sets.length; i++) {
        if (!seleccionados[i]) continue; // solo intento eliminar los seleccionados
        if (esSubconjuntoNecesario(i, mejorSeleccion, sets, U)) continue;

        mejorSeleccion[i] = false; // elimino el conjunto
        if (esUniversoCubierto(mejorSeleccion, sets, U)) {
            console.log(`Eliminado S${i + 1} [${sets[i]}]`);
        } else {
            console.log(`No se puede eliminar S${i + 1} [${sets[i]}]`);
            mejorSeleccion[i] = true; // lo vuelvo a seleccionar
        }
    }
    return mejorSeleccion;
}

export function setCoverGrasp (
    U, 
    sets, 
    { 
        iteraciones = 100, // número de iteraciones del GRASP
        candidatosMax = 3, // número máximo de candidatos a considerar en cada iteración
        aleatoriedad = 0.5, // probabilidad de seleccionar un subconjunto aleatorio
    } = {}
) {
    let mejorSolucion = null;
    for (let i = 0; i < iteraciones; i++) {
        const solucionGreedy = greedyAleatorio(U, sets, candidatosMax, aleatoriedad);
        const solucionGreedyMejorada = localSearch(U, sets, solucionGreedy);

        if (!mejorSolucion || solucionGreedyMejorada.length < mejorSolucion.length) {
            mejorSolucion = solucionGreedyMejorada;
        }
    }

    // Devolver los subconjuntos seleccionados
    return [ mejorSolucion ];
}