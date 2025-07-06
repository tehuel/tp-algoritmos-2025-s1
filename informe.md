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

## Ejercicio 2: Busqueda Local

Para el ejercicio de busqueda local se implementó una solución simple para intentar minimizar la cantidad de subconjuntos seleccionados para una solución.

Se inicia con una solución válida pero no mínima (todos los subconjuntos seleccionados), y se van deseleccionando subconjuntos de forma aleatoria hasta que no queden subconjuntos que puedan ser eliminados.

Con esto nos aseguramos una solución mínima (no hay subconjuntos innecesarios), pero puede ser que no lleguemos a una solución óptima (la cantidad de subconjuntos seleccionados es la menor posible).

Al formulario de pruebas se le agregó la posibilidad de seleccionar estrategia de resolución, y también la opción para volver a resolver el mismo problema. Antes de esto, cada ejecución creaba y resolvía un nuevo problema, ahora podemos probar correr el mismo problema varias veces para ver si encontramos diferentes soluciones (esto es util dada la aleatoriedad de la seleccion de candidados para eliminar dentro de la busqueda local)

## Ajuste de Parámetros en Búsqueda Local

