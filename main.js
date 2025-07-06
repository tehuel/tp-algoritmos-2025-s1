import { medirTiempo } from './utils.js';
import { generarProblemaSetCover } from './problema.js';
import { setCoverProgramacionDinamica } from './set-cover-dp.js';
import { setCoverBusquedaLocal } from './set-cover-local.js';

const algoritmos = {
    "dp": setCoverProgramacionDinamica,
    "local": setCoverBusquedaLocal,
};

function resolver(algoritmo, universo, subconjuntos) {
    const { resultado, tiempo } = medirTiempo(algoritmos[algoritmo], universo, subconjuntos);

    const salida = {
        tiempo: `${tiempo} ms`,
        len: resultado.map(r => r.filter(Boolean).length),
        resultado,
        subconjuntos,
        universo,
    };

    document.getElementById("output").textContent = JSON.stringify(salida, null, 2);
}

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const {
            algoritmo,
            cantElementos,
            cantSubconjuntos,
            tamMinSubconjunto,
            tamMaxSubconjunto
        } = Object.fromEntries(
            new FormData(form)
                .entries()
                .map(([key, value]) => [key, isNaN(parseInt(value)) ? value : parseInt(value)]) // Convertir los valores a enteros
        );

        const { universo, subconjuntos } = generarProblemaSetCover(cantElementos, cantSubconjuntos, tamMinSubconjunto, tamMaxSubconjunto);

        const btnReintentar = document.querySelector("#retry");
        btnReintentar.replaceWith(btnReintentar.cloneNode(true)); // Clonar el botón para eliminar los event listeners previos

        document.querySelector("#retry").addEventListener("click", () => {
            resolver(algoritmo, universo, subconjuntos);
        });

        resolver(algoritmo, universo, subconjuntos);
    });
});
