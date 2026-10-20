# ============================================
# ESTÁGIO 1 — BUILD
# ============================================
FROM node:20-alpine AS build
WORKDIR /app

# Cache de dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia o resto e builda
COPY . .
# VITE_API_URL é build-time; passe via --build-arg
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ============================================
# ESTÁGIO 2 — RUNTIME (Nginx)
# ============================================
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove o conteúdo default do Nginx
RUN rm -rf ./*

# Copia o build do Vite
COPY --from=build /app/dist .

# Configuração do Nginx: SPA fallback + cache
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]