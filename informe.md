# Trabajo Práctico: Algoritmos

## Ejercicio 1: Programación Dinámica

La primera implementación del problema Set Cover fue realizada en JavaScript utilizando una estrategia de programación dinámica. Esta técnica evaluaba cada posible combinación de subconjuntos para verificar si representaba una solución válida al problema.

En una implementación inicial, debido a un malentendido de la consigna, estábamos devolviendo únicamente el tamaño mínimo de la solución, es decir, la cantidad mínima de subconjuntos necesarios para cubrir el universo.

Luego de realizar una consulta, se modificó la implementación con dos cambios importantes:

- Se requiere devolver un listado de soluciones.

- El listado debe incluir únicamente las soluciones que sean mínimas, es decir, aquellas en las que todos los subconjuntos seleccionados son necesarios y no hay subconjuntos adicionales en la solución.

Se actualizó la implementación para considerar todas las soluciones. Para verificar si una lista de subconjuntos es solución se revisa si todos los elementos del universo están cubiertos

```
Función esUniversoCubierto(seleccionados, conjuntos, U):
    cubiertos = nuevo conjunto vacío

    Para cada conjunto en conjuntos:
        Si el conjunto está seleccionado:
            Agregar todos sus elementos a cubiertos

    Para cada elemento en U:
        Si el elemento no está en cubiertos:
            Retornar falso

    Retornar verdadero
```

Ahora, además de revisar si es solución, también nos interesa revisar si es solucion minima:

```
Función esSolucionMinima(seleccionados, sets, U):
    Para cada conjunto seleccionado:
        Quitar temporalmente ese conjunto de la selección
        Si el universo U sigue cubierto sin ese conjunto:
            Retornar falso  // No es mínima, hay un conjunto innecesario

    Retornar verdadero  // Todos los conjuntos seleccionados son necesarios
```

Para facilitar pruebas también se construyó un formulario para parametrizar la generación y resolución de nuevos problemas.