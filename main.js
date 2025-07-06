import { setCoverProgramacionDinamica } from './set-cover-dp.js';
import { medirTiempo } from './utils.js';
import { generarProblemaSetCover } from './problema.js';

document.addEventListener("DOMContentLoaded", function () {

    const algoritmos = {
        "dp": setCoverProgramacionDinamica,
    };
    console.log("Algoritmos disponibles:", algoritmos);

    const form = document.getElementById("set-cover-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const {
            cantElementos,
            cantSubconjuntos,
            tamMinSubconjunto,
            tamMaxSubconjunto
        } = Object.fromEntries(
            new FormData(form)
                .entries()
                .map(([key, value]) => [key, parseInt(value)]) // Convertir los valores a enteros
        );

        const { universo, subconjuntos } = generarProblemaSetCover(cantElementos, cantSubconjuntos, tamMinSubconjunto, tamMaxSubconjunto);
        const { resultado, tiempo } = medirTiempo(setCoverProgramacionDinamica, universo, subconjuntos);

        const salida = {
            tiempo: `${tiempo} ms`,
            solucion: resultado,
            subconjuntos,
            universo,
        };
        document.getElementById("output").textContent = JSON.stringify(salida, null, 2);
    });
});
