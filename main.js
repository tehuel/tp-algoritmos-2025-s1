import { medirTiempo } from './utils.js';
import { generarProblemaSetCover } from './problema.js';
import { setCoverProgramacionDinamica } from './set-cover-dp.js';
import { setCoverBusquedaLocal } from './set-cover-local.js';

const algoritmos = {
    "dp": setCoverProgramacionDinamica,
    "local": setCoverBusquedaLocal,
};

document.addEventListener('alpine:init', () => {
    Alpine.data('setCoverForm', () => ({
        // configuracion del algoritmo
        algoritmo: 'dp',

        // configuración del problema
        cantElementos: 5,
        cantSubconjuntos: 5,
        tamMinSubconjunto: 1,
        tamMaxSubconjunto: 3,
        problema: null,

        // opciones de solucion
        ejecuciones: 1,

        // resultado de la resolución
        resultados: [],

        generar() {
            const { universo, subconjuntos } = generarProblemaSetCover(
                this.cantElementos,
                this.cantSubconjuntos,
                this.tamMinSubconjunto,
                this.tamMaxSubconjunto
            );

            this.resultados = [];
            this.problema = {
                universo,
                subconjuntos,
            };

            this.resolverHandler();
        },

        obtenerSolucion() {
            const { universo, subconjuntos } = this.problema;
            const algoritmo = algoritmos[this.algoritmo];
            const { resultado: solucion, tiempo } = medirTiempo(algoritmo, universo, subconjuntos);

            return {
                solucion,
                tiempo,
            };
        },

        resolverHandler() {
            this.resultados = [this.obtenerSolucion()];
        },

        compararHandler() {
            this.resultados = [];
            for (let i = 0; i < this.ejecuciones; i++) {
                this.resultados.push(this.obtenerSolucion());
            }
        },

        mostrarSolucion(solucion) {
            const cantidadElementos = solucion.reduce((total, s) => total + (s ? 1 : 0), 0);
            const string = solucion
                .map((s,i) => s ? `S${i+1} [${this.problema.subconjuntos[i]}]` : false)
                .filter(Boolean) // solo conservo los subconjuntos seleccionados
                .join(', ');

            return `${string} (${cantidadElementos} elementos)`;
        },
    }));
});
