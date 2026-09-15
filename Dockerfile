FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN corepack pnpm install --frozen-lockfile
COPY . .

# La URL de la API se compila dentro del bundle (Vite resuelve env vars en build time,
# no en runtime), así que hay que pasarla al construir la imagen:
# docker build --build-arg VITE_API_URL=https://api.tudominio.com/api .
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL

RUN corepack pnpm build

FROM nginx:1.27-alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
