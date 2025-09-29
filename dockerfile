FROM node:20-alpine
WORKDIR /app


# Instala bash
RUN apk add --no-cache bash

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# (Opcional) que las capas RUN usen bash:
SHELL ["/bin/bash", "-lc"]


# Mantener el contenedor levantado (sin servidor)
CMD ["sh", "-c", "echo 'Entorno listo. Usa: docker compose exec app npx m run <script>'; tail -f /dev/null"]
