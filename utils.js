function medirTiempo(fn, ...args) {
    const inico = performance.now();
    const resultado = fn(...args);
    const fin = performance.now();

    return {
        resultado,
        tiempo: fin - inico
    };
}