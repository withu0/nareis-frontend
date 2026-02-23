# Frontend - Vite/React build, nginx serve
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - nginx (static only; API proxying can be done by reverse proxy)
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
