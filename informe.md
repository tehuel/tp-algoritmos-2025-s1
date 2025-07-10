# Trabajo Práctico: Algoritmos

Alumnos:
- Torres Baldi, Tehuel
- Lattanzio, Bruno



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

## Variación de Parámetros en Búsqueda Local

Para empezar a trabajar con distintos parámetros, se incluyó la posibilidad de resolver el mismo ejercicio varias veces, presentando un listado de todos los resultados, y el tiempo que tomó cada ejecucion.

Una variación que se puede optar por elegir es cambiar el criterio para seleccionar conjuntos, por ejemplo ordenar esos conjuntos de acuerdo a la cantidad de elementos que tiene cada conjunto. Para poder entender que diferencia hay entre intentar eliminar primero los conjuntos más grandes o los más pequeños.

Algo interesante (al momento de hacer pruebas) es que se mantiene primero el reordenamiento aleatorio de los candidatos y luego se ordena, si es necesario, por tamaño de subconjuntos, asi que siempre se mantiene una cierta impredecibilidad.

Al momento de hacer pruebas grandes se empieza a senir la demora en el tiempo de procesamiento, por lo que se agregó la posibilidad de mostrar estado de "loading", y dibujar cada uno de los resultados a medida que se va consiguiendo. Esto no evita que el programa "se cuelgue", pero ayuda a que la experiencia sea un poco mejor. En este punto un pendiente interesante para agregar sería contar con la posibilidad de calcular un valor totalizado o promediado al finalizar la ejecucion de todas las iteraciones.

## Implementar algoritmo GRASP

Para ir mejorando la ejecucion de diferentes casos se agregaron algunas funcionalidades:
- Exportar a CSV: para generar un archivo CSV con todas las soluciones encontradas.
- Guardar en LocalStorage: para persistir la ultima configuración usada y que el formulario no se reinicie cada vez que se recarga la página.
- Reorganización del formulario: para tener por separado las configuraciones del universo del problema vs las configuraciones del algoritmo.

### Implementación Inicial

En una implementación inicial de GRASP se consideran los siguientes parámetros:

```
iteraciones = 100, // número máximo de iteraciones del GRASP
candidatosMax = 3, // número máximo de candidatos a eliminar en cada iteración
aleatoriedad = 0.5, // probabilidad de seleccionar un subconjunto aleatorio
```

La implementación considera una solución inicial trivial (seleccionar todos los subconjuntos) y a partir de ahi ir seleccionando un número `candidadosMax` de subconjuntos candidatos a eliminar de la solución. Cada candidato tiene una probabilidad `aleatoriedad` de ser eliminado. Esta eliminacion de candidatos se repite `iteraciones` veces.

El criterio de "calidad" con el que se avanza es la cantidad de subconjuntos elegidos como solución (una solución mejor es una solución con menor cantidad de subconjuntos).

En un paso final se consulta si la solucion obtenida al finalizar las iteraciones es una solución mínima. Este chequeo siempre daba falso, las soluciones alcanzadas por esta implementacion no cumplen la condición de ser soluciones minimas, siempre tienen elementos "redundandes". Eliminando el chequeo de minimalidad la funcion devuelve soluciones, pero obviamente, no son soluciones minimas.

No es una solución muy satisfactoria, por lo que se busca una alternativa.

### Implementación en fases

Para esta implementación de GRASP se busca resolver el problema en fases:
- Una fase inicial de construcción de solución: Usando una estrategia greedy (seleccionando primero los subconjuntos que tengan una mayor cobertura de los elementos restantes del universo) con una probabilidad aleatoria `aleatoriedad` de no elegir el absoluto mejor, sino alguno de los `candidatosMax` mejores.
- Una fase de búsqueda local, donde se busca eliminar subconjuntos mientras los seleccionados sigan siendo solución del problema.
- Todo esto repetido para `iteraciones`.

En esta segunda iteración se ve una significante mejoría en la calidad de las soluciones. El algoritmo greedy usado para armar soluciones considerando sólo los mejores candidatos.

## Gráficos

Para graficar las soluciones se usa chartjs. Por falta de tiempo no se llegó a implementar una solucion de gráficos más completa.