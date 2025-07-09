import { medirTiempo } from './utils.js';
import { generarProblemaSetCover } from './problema.js';

import { setCoverProgramacionDinamica } from './set-cover-dp.js';
import { setCoverBusquedaLocal } from './set-cover-local.js';
import { setCoverGrasp } from './set-cover-grasp.js';

const algoritmos = {
    "dp": setCoverProgramacionDinamica,
    "local": setCoverBusquedaLocal,
    "grasp": setCoverGrasp,
};

document.addEventListener('alpine:init', () => {
    Alpine.data('setCoverForm', () => ({
        loading: false,

        // configuracion del algoritmo
        algoritmo: 'dp',
        configuracionAlgoritmo: {
            ordenarConjuntos: 'no', // solo para busqueda local
        },

        // configuración del problema
        cantElementos: 5,
        cantSubconjuntos: 5,
        tamMinSubconjunto: 1,
        tamMaxSubconjunto: 3,
        problema: null,

        // opciones de solucion
        ejecuciones: 10,

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

        async obtenerSolucion() {
            const { universo, subconjuntos } = this.problema;
            const algoritmo = algoritmos[this.algoritmo];

            const { resultado: solucion, tiempo } = await medirTiempo(algoritmo, universo, subconjuntos);
            return {
                solucion,
                tiempo,
            };
        },

        async resolverHandler() {
            this.loading = true;
            this.resultados = [await this.obtenerSolucion()];
            this.loading = false;
        },

        async compararHandler() {
            this.loading = true;
            this.resultados = [];
            for (let i = 0; i < this.ejecuciones; i++) {
                this.resultados.push(await this.obtenerSolucion());
            }
            this.loading = false;
        },

        mostrarSolucion(solucion) {
            const cantidadElementos = solucion.reduce((total, s) => total + (s ? 1 : 0), 0);
            const string = solucion
                .map((s, i) => s ? `S${i + 1} [${this.problema.subconjuntos[i]}]` : false)
                .filter(Boolean) // solo conservo los subconjuntos seleccionados
                .join(', ');

            return `(${cantidadElementos} elementos) - ${string}`;
        },

        // Exportar el problema completo y los resultados a un archivo CSV
        // Cada fila será un resultado, y contendrá: Universo;Subconjuntos;Algoritmo;Solución;Tiempo (ms)
        exportarCsv() {
            const csvRows = [];
            const header = 'Universo;Subconjuntos;Algoritmo;Solución;Tiempo (ms)';
            csvRows.push(header);

            console.log('Exportando resultados a CSV...', this.resultados);

            this.resultados.forEach(({ solucion, tiempo }) => {
                solucion.forEach((s, i) => {
                    const subconjuntosSeleccionados = this.problema.subconjuntos
                        .map((ss, i) => s[i] ? `S${i + 1} [${ss}]` : null)
                        .filter(Boolean)
                        .join(', ');

                    const row = [
                        this.problema.universo.join(', '),
                        this.problema.subconjuntos.map(s => `[${s}]`).join(', '),
                        this.algoritmo,
                        subconjuntosSeleccionados,
                        tiempo.toFixed(2),
                    ].join(';');

                    csvRows.push(row);
                });
            });

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'set_cover_results.csv';
            a.click();
            URL.revokeObjectURL(url);
        },
    }));
});
