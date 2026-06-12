# Proyecto E-commerce

Este repositorio contiene una aplicación de comercio electrónico desarrollada con Node.js. Está pensado como un proyecto de aprendizaje y práctica para una comisión de Node JS.

## Descripción

La aplicación permite gestionar productos, carritos y compras en un entorno de tienda en línea. Incluye lógica para el manejo de rutas, controladores, modelos y vistas o APIs según la implementación.

## Instalación

1. Clona el repositorio:
   git clone <URL-del-repositorio>
2. Entra a la carpeta del proyecto:
   cd e-commerce-gabriel-shulman
3. Instala las dependencias:
   npm install

## Uso

1. Inicia el servidor:
   npm start
2. Abre el navegador en:
   http://localhost:3000

## Estructura del proyecto

- `src/` o `backend/`: código fuente de la aplicación
- `models/`: definición de datos y esquemas
- `routes/`: rutas de la aplicación
- `controllers/`: lógica para cada ruta
- `public/` o `views/`: archivos estáticos o plantillas

## Tecnologías

- Node.js
- Express
- MongoDB / SQL (según implementación)
- JavaScript

## Notas

Este README es una guía básica. Ajusta las instrucciones según la configuración real del proyecto y los comandos disponibles.
# Instalación y ejecución del proyecto

## 1. Clonar el repositorio

1. Abre una terminal o símbolo del sistema.
2. Ve a la carpeta donde quieres guardar el proyecto.
3. Ejecuta el comando:
   git clone <URL_DEL_REPOSITORIO>
4. Entra en la carpeta del proyecto:
   cd ecommerce

---

## 2. Instalar dependencias

1. Comprueba que Node.js y npm están instalados:
   node -v && npm -v
2. En la carpeta del proyecto ejecuta:
   npm install
3. Espera a que termine la instalación de todas las dependencias.

---

## 3. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade las siguientes variables y completa los valores según tu configuración:

MONGO_DB_USER=
MONGO_DB_PASSWORD=
MONGO_DB_NAME=
MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=1h

PORT=8080

MAIL_USER=
MAIL_PASS=

3. Guarda el archivo `.env`.

## 4. Ejecutar el proyecto localmente

1. Inicia el servidor con uno de los siguientes comandos:
   node index.js
   o
   npm start
2. Abre el navegador en:
   http://localhost:8080
3. Accede a la documentación Swagger en:
   http://localhost:8080/api-docs

# Ejecución con Docker

## 1. Construir imagen

docker build -t ecommerce:1.0 .

## 2. Ejecutar contenedor

docker run -p 8080:8080 --env-file .env ecommerce:1.0

Aplicación disponible en:

http://localhost:8080


# Ejecutar tests

Ejecutar todos los tests funcionales:

npm test

Ejecutar un archivo específico:

npx jest tests/products.test.js

Ejecutar con cobertura:

npx jest --coverage

---

# Verificación rápida

Comprobar que el proyecto funciona correctamente:

* Aplicación accesible en `http://localhost:8080`
* Swagger accesible en `/api-docs`
* Conexión correcta con MongoDB
* Tests ejecutando sin errores
* Contenedor Docker iniciado correctamente
