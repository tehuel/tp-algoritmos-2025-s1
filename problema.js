generarArrayUniverso = (n) => Array.from({ length: n }, (_, i) => i + 1);
obtenerEnteroRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
obtenerElementoRandom = (array) => array[Math.floor(Math.random() * array.length)];

function generarProblemaSetCover(cantElementos, cantSubconjuntos, tamMinSubconjunto, tamMaxSubconjunto) {
    const problema = {
        universo: generarArrayUniverso(cantElementos),
        subconjuntos: []
    };

    for (let i = 0; i < cantSubconjuntos; i++) {
        const tamSubconjunto = obtenerEnteroRandom(tamMinSubconjunto, tamMaxSubconjunto);
        const elementosSubconjunto = new Set();
        while (elementosSubconjunto.size < tamSubconjunto) {
            elementosSubconjunto.add(obtenerElementoRandom(problema.universo));
        }
        problema.subconjuntos.push(Array.from(elementosSubconjunto));
    }
    
    return problema;
}
