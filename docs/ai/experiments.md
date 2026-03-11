# Experimentos con IA

En este documento se registrarán los experimentos realizados con la IA, incluyendo elementos como objetivos y resultados, entre otros.

## Ejercicios de programación básicos sin IA

Problema 1: Suma de números en un array

function sumaArray(arr) {
    let suma = 0;
    for (let i = 0; i < arr.length; i++) {
        suma += arr[i];
    }
    return suma;
}

Problema 2: Invertir un string

function invertirString(str) {
    return str.split('').reverse().join('');
}

Problema 3: Contar vocales en un string

function contarVocales(str) {
    const vocales = 'aeiouAEIOU';
    let contador = 0;
    for (let char of str) {
        if (vocales.includes(char)) contador++;
    }
    return contador;
}

## Ejercicios de programación básicos con IA

Problema 1 usando reduce

function sumaArrayIA(arr) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

Problema 2 usando un bucle for

function invertirStringIA(str) {
    let invertido = '';
    for (let i = str.length - 1; i >= 0; i--) {
        invertido += str[i];
    }
    return invertido;
}

Problema 3 usando expresión regular

function contarVocalesIA(str) {
    const coincidencias = str.match(/[aeiou]/gi);
    return coincidencias ? coincidencias.length : 0;
}

## Conclusiones ejercicios básico sin y con IA

A través de los experimentos realizados, se observa que la IA es una herramienta poderosa para optimizar y agilizar la programación. Al utilizarla, el tiempo de implementación se reduce significativamente y el código tiende a ser más conciso y en algunos casos más eficiente. Además, la IA puede proponer enfoques alternativos que un programador podría no considerar inmediatamente, aportando nuevas perspectivas sobre cómo resolver un problema.

En resumen, la combinación de ambos métodos ofrece el mejor balance: la IA agiliza tareas repetitivas y propone soluciones creativas, mientras que la resolución manual asegura un conocimiento sólido de los conceptos. Para proyectos reales, esto sugiere que usar la IA como apoyo complementario, y no como sustituto del pensamiento lógico, es la estrategia más efectiva para mejorar productividad, calidad de código y comprensión del problema.

## Tareas relacionada con el proyecto sin IA

Tarea 1: Filtrar tareas por prioridad

function filtrarPorPrioridad(prioridad) {
    const filtradas = [];
    for (const tarea of tareas) {
        if (tarea.prioridad === prioridad) filtradas.push(tarea);
    }
    mostrarTareasFiltradas(filtradas);
}

Tarea 2: Marcar todas como completadas

function marcarTodasCompletadas() {
    for (const tarea of tareas) {
        tarea.completada = true;
    }
    guardarTareas();
    renderActual();
}

Tarea 3: Buscar tareas por palabra

function buscarPorPalabra(palabra) {
    const texto = palabra.trim().toLowerCase();
    const resultado = [];
    for (const tarea of tareas) {
        if (tarea.texto.toLowerCase().includes(texto)) {
            resultado.push(tarea);
        }
    }
    mostrarTareasFiltradas(resultado);
}

## Tareas relacionada con el proyecto con IA

Tarea 1: Filtrar tareas por prioridad usando filter

const filtrarPorPrioridadIA = (prioridad) =>
    mostrarTareasFiltradas(tareas.filter(t => t.prioridad === prioridad));

Tarea 2: Marcar todas como completadas usando forEach

const marcarTodasCompletadasIA = () => {
    tareas.forEach(t => t.completada = true);
    guardarTareas();
    renderActual();
};

Tarea 3: Buscar tareas por palabra usando filter + includes

const buscarPorPalabraIA = (palabra) => {
    const texto = palabra.trim().toLowerCase();
    mostrarTareasFiltradas(
        tareas.filter(t => t.texto.toLowerCase().includes(texto))
    );
};

## Conclusiones tareas del proyecto sin y con IA

Al comparar las soluciones sin IA y con IA, queda claro que cada enfoque tiene un impacto diferente en la estructura y el estilo del código. Las soluciones manuales tienden a ser más explícitas y detalladas, mostrando claramente cada paso lógico, mientras que las versiones asistidas por IA suelen ser más concisas, haciendo un uso más intensivo de funciones integradas y patrones modernos de JavaScript.

En términos de eficiencia, la IA permite escribir menos líneas y lograr el mismo resultado con menos esfuerzo, lo que puede acelerar el desarrollo en proyectos grandes. Sin embargo, el código generado automáticamente puede requerir una revisión adicional para asegurar que se adapte correctamente a la lógica específica del proyecto y que sea mantenible a largo plazo.
