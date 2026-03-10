# Comparación de modelos de IA

Este documento presenta una comparación entre dos modelos de inteligencia artificial.

## Comparación entre ChatGPT y Claude

A continuación, se analizan las diferencias entre dos de los modelos de IA más utilizados: ChatGPT y Claude.

### Explicación conceptos técnicos

Se realizaron consultas a ambos modelos para que explicaran tres conceptos de desarrollo web: Closures, Event Loop y DOM. A partir de sus respuestas, se identifican las principales diferencias.

#### Closures

Ambos modelos proporcionan definiciones breves y concisas del concepto, similares entre sí. La diferencia principal radica en los ejemplos utilizados.

Mismo código compartido por ambos:

```javascript
function contador() {
  let count = 0;

  return function() {
    count++;
    console.log(count);
  };
}

const incrementar = contador();

incrementar(); // 1
incrementar(); // 2
incrementar(); // 3 
```

Ambos explican la utilidad del código, pero ChatGPT ofrece una profundización adicional, incluyendo un ejemplo de variable privada dentro de una función:

```javascript
function crearCuenta() {
  let saldo = 0;

  return {
    depositar: (monto) => saldo += monto,
    verSaldo: () => saldo
  };
}
```

#### Event Loop

EEn este concepto, las diferencias son más claras. Aunque la definición teórica es similar, ChatGPT ofrece una explicación más detallada sobre el funcionamiento y la estructura del Event Loop, mientras que Claude presenta una versión más breve y directa.

Ejemplo de ChatGPT:                                     

```javascript                              
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

Ejemplo de Claude: 

```javascript                              
console.log("1");

setTimeout(() => console.log("2"), 0);

console.log("3");

// Output: 1 → 3 → 2
```
ChatGPT incluye además un esquema simplificado del Event Loop:

Call Stack vacío?
      ↓
Event Loop revisa Queue
      ↓
Pasa callback a Call Stack
      ↓
Se ejecuta

Y profundiza en conceptos avanzados:

- Macrotasks: setTimeout, setInterval

- Microtasks: Promise.then, queueMicrotask

#### DOM

Ambos modelos proporcionan definiciones similares, pero difieren en la cantidad y profundidad de los ejemplos.

Ejemplo de Claude:

```javascript
// Seleccionar
const titulo = document.querySelector("h1");

// Leer/modificar contenido
titulo.textContent = "Nuevo título";

// Crear y añadir elementos
const parrafo = document.createElement("p");
parrafo.textContent = "Hola mundo";
document.body.appendChild(parrafo);

// Escuchar eventos
titulo.addEventListener("click", () => console.log("clic!"));
```

ChatGPT ofrece una explicación más extensa, describiendo la estructura de un documento HTML, los nodos dentro del DOM y cómo manipular elementos, incluso modificar estilos:

<html>
  <body>
    <h1>Hello</h1>
    <p>Texto</p>
  </body>
</html>

Document
 └── html
     └── body
         ├── h1
         └── p

```javascript
element.style.color = "red"
```

#### Conclusión

Ambos modelos ofrecen explicaciones claras y útiles, pero ChatGPT tiende a profundizar más, proporcionando esquemas y ejemplos adicionales. Claude, en cambio, ofrece respuestas más concisas y directas.

## Detección de bug en funciones de JavaScript con errores intencionales

Se evaluó cómo ambos modelos identifican y corrigen errores en código con fallos intencionales.

### Función de suma en array

Código con error:

```javascript
function sumarArray(arr) {
  let total = 0;
  for (let i = 0; i < arr.length - 1; i++) { // Bug: se resta 1, el último número nunca se suma
    total += arr[i];
  }
  return total;
}

console.log(sumarArray([1, 2, 3, 4])); // Sale 6 (debería ser 10)
console.log(sumarArray([10, -5, 7])); //Sale 5 (debería ser 12)
```

Claude corrige el código y propone alternativas modernas:

```JavaScript
// Con reduce
const sumarArray = arr => arr.reduce((total, n) => total + n, 0);

// Con for...of
function sumarArray(arr) {
  let total = 0;
  for (const n of arr) total += n;
  return total;
}
```

ChatGPT explica el error paso a paso, más allá de corregir el código:

Array:

[1, 2, 3, 4]

arr.length = 4

El bucle se ejecuta mientras:

i < 3

Valores de i:

i = 0 → 1
i = 1 → 2
i = 2 → 3

El 4 nunca se suma

Resultado:

1 + 2 + 3 = 6

Además, como en Claude, te comparte alternativas de código, en este caso una forma más moderna y otra más clara de realizar la función.

### Función para invertir texto

Código con error:

```javascript
function invertirTexto(texto) {
  let resultado = "";
  for (let i = texto.length - 1; i > 0; i--) { // Bug: i > 0, nunca incluye el primer carácter
    resultado += texto[i];
  }
  return resultado;
}

console.log(invertirTexto("hola"));      // "alo" (falta la "h")
console.log(invertirTexto("JavaScript")); // "tpircSavaJ" (falta la "J" inicial)
console.log(invertirTexto("a"));         // "" (falla con strings de 1 carácter)
```

Ambos modelos identifican el error y ofrecen de la misma forma el código corregido.

Correción de Claude y ChatGTP: 

```javascript
function invertirTexto(texto) {
  let resultado = "";
  for (let i = texto.length - 1; i >= 0; i--) {  // ← >= en lugar de >
    resultado += texto[i];
  }
  return resultado;
}

console.log(invertirTexto("hola"));       // "aloh" ✓
console.log(invertirTexto("JavaScript")); // "tpircSavaJ" ✓
console.log(invertirTexto("a"));          // "a" ✓
```

### Función para obtener un numero aleatorio

Código con error:

```javascript
function numeroAleatorio(min, max) {
  // Bug: no sumamos el +1, así que nunca llega al valor máximo
  return Math.floor(Math.random() * (max - min)) + min;
}

console.log(numeroAleatorio(1, 10)); // 1 a 9 (el 10 nunca sale)
console.log(numeroAleatorio(50, 60)); // 50 a 59 (el 60 nunca sale)
```

Claude ofrece corrección y versión para producción con validación:

```javascript
function numeroAleatorio(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError("min y max deben ser enteros");
  }
  if (min > max) {
    [min, max] = [max, min]; // intercambio si están invertidos
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

ChatGPT comenta el error y proporciona el código correcto.

### Conclusión

Ambos modelos identifican y corrigen errores de manera efectiva, pero ChatGPT se enfoca más en explicar el fallo y ofrecer ejemplos, mientras que Claude proporciona soluciones directas y listas para producción.

## Implementación de funciones en lenguaje natural

Se va a proceder a realizar consultas para que me responda con la implementación del código que se le requiere.

### Función para recibir el cuadrado

En este caso, vamos a pedirle a las dos herramientas la siguiente consulta: “Crea una función que reciba un número y devuelva su cuadrado”.

Aquí Claude te imprime una función básica: 

```javascript
const cuadrado = n => n ** 2;

console.log(cuadrado(4));   // 16
console.log(cuadrado(-3));  // 9
console.log(cuadrado(0));   // 0
```

De manera sencilla, expone el código y una muy breve explicación de lo que hace. En cambio ChatGPT se expande más con una implementación básica que estará abajo, una versión con función flecha y usando Math.pow. Además de comentar la forma más comun en JS moderno que viene a ser lo que compartió Claude. 

```javascript
function cuadrado(numero) {
  return numero * numero;
}

console.log(cuadrado(4)); // 16
console.log(cuadrado(7)); // 49
console.log(cuadrado(-3)); // 9
```
### Función para devolver true o false en funciónd del número

La consulta a ambas plataformas ha sido: "Crea una función que reciba un número y devuelva true si es positivo, false si es cero o negativo". Como se ha procedido antes, Claude te ofrece la versión de punta de flecha con una breve explicación: 

```javascript
const esPositivo = n => n > 0;

console.log(esPositivo(5));   // true
console.log(esPositivo(-3));  // false
console.log(esPositivo(0));   // false
```

En cambio ChatGPT profundiza mucho más como en el caso anterior llegando a ofrecer una implementación básica, una versión más corta y la versión con función flecha:

```javascript
function esPositivo(numero) {
  if (numero > 0) {
    return true;
  } else {
    return false;
  }
}

console.log(esPositivo(5));   // true
console.log(esPositivo(0));   // false
console.log(esPositivo(-3));  // false
```

### Función para saber el número mayor

En este caso, se le han pedido a ambas tecnologías: "Escribe una función que reciba dos números y devuelva cuál es mayor". Por su parte, Claude más allá de la simple implementación que le pedí, también me ofrece un código alternativo por si el número es igual: 

```javascript
function mayor(a, b) {
  if (a === b) return "Son iguales";
  return a > b ? a : b;
}

console.log(mayor(4, 4)); // "Son iguales"
```

Por otro lado, ChatGPT se ciñe a la implementación básica que le pedí pero ofreciendo a posteriori diferentes versiones como más cortas o más directas, sin nada referente a posibles numeros iguales: 

```javascript
function mayor(a, b) {
  if (a > b) {
    return a;
  } else {
    return b;
  }
}

console.log(mayor(5, 3));  // 5
console.log(mayor(10, 20)); // 20
```
### Conclusión

Ambos modelos proporcionan soluciones claras y alternativas, aunque ChatGPT ofrece mayor profundidad y ejemplos adicionales.

## Conclusión general

ChatGPT y Claude son herramientas útiles para el desarrollo de código. Ambos explican de manera clara y ofrecen alternativas, pero ChatGPT destaca por la profundidad en sus explicaciones y la variedad de soluciones ofrecidas. Claude se centra en respuestas concisas y directas.