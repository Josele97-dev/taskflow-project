# Herramientas para el desarrollo de APIs

## Axios

Axios es una librería de JavaScript para hacer peticiones HTTP desde el navegador o desde Node.js. Es una alternativa a `fetch` con algunas ventajas:

- Convierte automáticamente las respuestas a JSON sin necesidad de llamar a `.json()`
- Gestiona mejor los errores, lanzando excepciones automáticamente cuando el servidor devuelve un 4xx o 5xx
- Permite configurar interceptores para añadir cabeceras o gestionar errores de forma global
- Tiene mejor soporte para cancelar peticiones

Se usa principalmente cuando se necesita más control sobre las peticiones HTTP o cuando el proyecto ya lo tiene como dependencia.

## Postman

Postman es una herramienta para probar APIs REST sin necesidad de escribir código. Permite:

- Hacer peticiones GET, POST, PUT, DELETE con cualquier cuerpo o cabecera
- Guardar colecciones de peticiones organizadas por proyecto
- Forzar errores intencionados para comprobar que el servidor responde correctamente
- Compartir colecciones con el equipo
- Automatizar pruebas con scripts

Se usa durante el desarrollo del backend para verificar que los endpoints funcionan correctamente antes de conectar el frontend.

## Sentry

Sentry es una plataforma de monitorización de errores en tiempo real. Cuando una aplicación en producción lanza un error, Sentry lo captura automáticamente y lo envía a un panel donde puedes ver:

- Qué error ocurrió y en qué línea del código
- Cuántas veces ha ocurrido
- Qué usuario lo experimentó
- La traza completa del error (stack trace)

Se usa en producción para detectar y corregir errores que los usuarios encuentran sin que el desarrollador tenga que estar mirando los logs manualmente.

## Swagger

Swagger es una herramienta para documentar APIs REST de forma interactiva. Genera automáticamente una página web donde se puede:

- Ver todos los endpoints disponibles con sus parámetros y respuestas
- Probar la API directamente desde el navegador
- Compartir la documentación con otros desarrolladores o con el frontend

Se usa para que cualquier persona que consuma la API sepa exactamente cómo funciona sin tener que leer el código fuente.