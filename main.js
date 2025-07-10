import { medirTiempo, informacionSolucion} from './utils.js';
import { generarProblemaSetCover } from './problema.js';

import { setCoverProgramacionDinamica } from './set-cover-dp.js';
import { setCoverBusquedaLocal } from './set-cover-local.js';
import { setCoverGrasp } from './set-cover-grasp.js';

const algoritmos = {
    "dp": setCoverProgramacionDinamica,
    "local": setCoverBusquedaLocal,
    "grasp": setCoverGrasp,
};

const configuracionAlgoritmosInicial = () => ({
    // solo para busqueda local
    ordenarConjuntos: 'no',

    // solo para GRASP
    iteraciones: 100, // número de iteraciones del GRASP
    candidatosMax: 3, // número máximo de candidatos a eliminar en cada iteración
    aleatoriedad: 0.5, // probabilidad de seleccionar un subconjunto aleatorio  
});

document.addEventListener('alpine:init', () => {
    Alpine.data('setCoverForm', () => ({
        loading: false,
        problema: null,
        resultados: [],

        form: {
            // configuracion del algoritmo
            algoritmo: 'dp',
            rondas: [],

            // configuración del problema
            cantElementos: 5,
            cantSubconjuntos: 5,
            tamMinSubconjunto: 1,
            tamMaxSubconjunto: 3,

            // opciones de repeticion de soluciones

            // opciones de solucion
            ejecuciones: 10,
        },

        // Guardar el formulario en localStorage
        guardarFormulario() {
            localStorage.setItem('setCoverForm', JSON.stringify(this.form));
        },

        // Cargar el formulario desde localStorage
        cargarFormulario() {
            const data = localStorage.getItem('setCoverForm');
            if (data) {
                const form = JSON.parse(data);
                // Copiar propiedades manualmente para mantener la reactividad
                Object.keys(this.form).forEach(key => {
                    if (typeof this.form[key] === 'object' && this.form[key] !== null && form[key]) {
                        Object.assign(this.form[key], form[key]);
                    } else {
                        this.form[key] = form[key];
                    }
                });
            }
        },

        generar() {
            const { universo, subconjuntos } = generarProblemaSetCover(
                this.form.cantElementos,
                this.form.cantSubconjuntos,
                this.form.tamMinSubconjunto,
                this.form.tamMaxSubconjunto
            );

            this.resultados = [];
            this.problema = {
                universo,
                subconjuntos,
            };

            this.guardarFormulario();
            this.resolverHandler();
        },

        async obtenerSolucion(ronda = 0) {
            const { universo, subconjuntos } = this.problema;
            const algoritmo = algoritmos[this.form.algoritmo];
            const config = this.form.rondas[ronda] || configuracionAlgoritmosInicial();
            
            const { resultado: solucion, tiempo } = await medirTiempo(algoritmo, universo, subconjuntos, config);
            return {
                solucion,
                tiempo,
                informacion: solucion.map((s) => informacionSolucion(s, subconjuntos, universo)),
            };
        },

        async resolverHandler() {
            this.loading = true;
            this.resultados = [];
            this.resultados = [await this.obtenerSolucion()];
            this.loading = false;
            this.guardarFormulario();
        },

        async compararHandler() {
            this.loading = true;
            this.resultados = [];
            for (let i = 0; i < this.form.rondas.length; i++) {
                this.resultados[i] = [];

                for (let j = 0; j < this.form.ejecuciones; j++) {
                    const resultadoEjecucion = await this.obtenerSolucion(i);
                    this.resultados[i].push(resultadoEjecucion);
                }
            }
            this.loading = false;
            console.log('Resultados obtenidos:', JSON.parse(JSON.stringify(this.resultados)));
            this.graficarResultados();
            this.guardarFormulario();
        },

        mostrarSolucion(solucion) {
            const cantidadElementos = solucion.reduce((total, s) => total + (s ? 1 : 0), 0);
            const string = solucion
                .map((s, i) => s ? `S${i + 1} [${this.problema.subconjuntos[i]}]` : false)
                .filter(Boolean) // solo conservo los subconjuntos seleccionados
                .join(', ');

            return `(${cantidadElementos} elementos) - ${string}`;
        },

        agregarRonda() {
            this.form.rondas.push({
                ...configuracionAlgoritmosInicial(),
            });
            this.guardarFormulario();
        },

        eliminarRonda(index) {
            if (this.form.rondas.length > 1) {
                this.form.rondas.splice(index, 1);
                this.guardarFormulario();
            }
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
            this.guardarFormulario();
        },

        // Graficar los resultados obtenidos
        graficarResultados() {
            const ctx = document.getElementById('graficoResultados').getContext('2d');
            const datasets = this.resultados.map((ronda, index) => ({
                label: `Ronda ${index + 1}`,
                data: ronda.map(res => res.tiempo),
                fill: false,
            }));

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: this.form.ejecuciones }, (_, i) => `Ejecución ${i + 1}`),
                    datasets,
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Tiempo (ms)',
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Ejecuciones',
                            },
                        },
                    },
                },
            });
        },

        // Al inicializar, cargar el formulario si existe en localStorage
        init() {
            this.cargarFormulario();
        }
    }));
});
