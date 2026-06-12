FROM node:22-bullseye-slim
# Imagen base: Node 22 en Debian Bullseye slim (menos vulnerabilidades que algunas imágenes alpine antiguas)
WORKDIR /app
# Establece el directorio de trabajo dentro del contenedor
COPY package*.json ./
# Copia los archivos de dependencias (package.json y package-lock.json si existe)
RUN npm ci --omit=dev && npm cache clean --force
# Instala las dependencias en modo producción y limpia la cache de npm para reducir el tamaño
COPY . .
# Copia el resto del código de la aplicación al contenedor
ENV NODE_ENV=production
# Variable de entorno para indicar que la app corre en producción
ENV PORT=8080
# Puerto en el que la aplicación escuchará
EXPOSE 8080
# Expone el puerto 8080 en el contenedor
# Ejecutar como usuario no root por seguridad
RUN useradd --user-group --create-home --shell /bin/false appuser || true
USER appuser
CMD ["node", "index.js"]
# Comando por defecto para arrancar la aplicación