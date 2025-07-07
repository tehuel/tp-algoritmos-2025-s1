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
        algoritmo: 'dp',
        cantElementos: 5,
        cantSubconjuntos: 5,
        tamMinSubconjunto: 1,
        tamMaxSubconjunto: 3,
        ajustesHash: null,
        problema: null,
        resultado: null,

        generar() {
            const { universo, subconjuntos } = generarProblemaSetCover(
                this.cantElementos,
                this.cantSubconjuntos,
                this.tamMinSubconjunto,
                this.tamMaxSubconjunto
            );

            this.resultado = null;
            this.problema = {
                universo,
                subconjuntos,
            };
        },

        resolver() {
            const { universo, subconjuntos } = this.problema;
            const algoritmo = algoritmos[this.algoritmo];
            const { resultado: solucion, tiempo } = medirTiempo(algoritmo, universo, subconjuntos);
            
            this.resultado = { 
                solucion, 
                tiempo,
            };
        },

        mostrarSolucion(solucion) {
            return solucion
            .map((s,i) => s ? `S${i+1} [${this.problema.subconjuntos[i]}]` : false)
            .filter(Boolean)
            .join(', ');
        },
    }));
});
