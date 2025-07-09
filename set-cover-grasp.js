import { mezclarArray, esUniversoCubierto, esSolucionMinima, esSubconjuntoNecesario } from './utils.js';

export function setCoverGrasp (
    U, 
    sets, 
    { 
        iteraciones = 100, // número de iteraciones del GRASP
        candidatosMax = 3, // número máximo de candidatos a eliminar en cada iteración
        aleatoriedad = 0.5, // probabilidad de seleccionar un subconjunto aleatorio
    } = {}
) {
    // solucion inicial: todos los subconjuntos
    const seleccionados = Array(sets.length).fill(true);
    
    // candidatos a eliminar: todos los subconjuntos
    let candidatos = mezclarArray(sets.map((_, index) => index));

    // Mientras haya iteraciones
    for (let i = 0; i < iteraciones; i++) {
        let mejorSeleccion = [...seleccionados];
        let mejorCalidad = -1;

        // Seleccionar subconjuntos aleatorios
        for (let j = 0; j < candidatosMax && candidatos.length > 0; j++) {
            const indice = candidatos.pop();
            if (Math.random() < aleatoriedad) {
                // Eliminar el subconjunto seleccionado
                mejorSeleccion[indice] = false;
            }
        }

        // Verificar si la solución es válida
        if (esUniversoCubierto(mejorSeleccion, sets, U)) {
            const calidad = mejorSeleccion.filter(Boolean).length; // Cantidad de subconjuntos seleccionados
            if (calidad > mejorCalidad) {
                mejorCalidad = calidad;
                seleccionados.splice(0, seleccionados.length, ...mejorSeleccion);
            }
        }
    }

    // Devolver los subconjuntos seleccionados
    return [ seleccionados ];
}