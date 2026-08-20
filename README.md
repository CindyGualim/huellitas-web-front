# Huellitas de la Calle — Frontend

Sitio público y panel administrativo de la ONG Huellitas de la Calle. React + Vite + Tailwind, consumiendo la API del [repositorio de backend](https://github.com/DufreyM/huellitas-web).

## Requisitos previos

- Node.js 18 o superior
- pnpm (`corepack enable` si no lo tenés instalado)
- El backend corriendo localmente (ver su propio README) — este frontend no funciona sin la API

## Variables de entorno

Copiá `.env.example` a `.env`:

```
VITE_API_URL=http://localhost:3001/api
```

Debe apuntar a la URL donde esté corriendo la API del backend.

## Instalación y arranque

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar el servidor de desarrollo
pnpm dev
```

Por defecto queda disponible en `http://localhost:5173`.

Para generar el build de producción:

```bash
pnpm build
```

## Pruebas

```bash
pnpm test
```

Corre la suite de Vitest + Testing Library (`**/*.test.ts(x)`) sobre el flujo de login, el manejo de sesión (`AuthContext`) y el cliente de la API.

## Acceso al panel administrativo

Con el backend corriendo y un usuario creado (`prisma/createAdmin.js` en el repo del backend), entrá a `/login` con esas credenciales. Las rutas bajo `/admin` están protegidas y redirigen a `/login` si no hay sesión activa.

## Estructura del proyecto

```
src/app/
├── pages/           # Vistas públicas y admin/ (conectadas a la API real)
├── components/      # Componentes compartidos (Layout, AdminLayout, PrimaryButton, admin/)
├── context/         # AuthContext (sesión, token, login/logout)
├── lib/             # Cliente de la API (api.ts) y mapeos de enums del backend (petMappings.ts)
└── data/            # Datos de ejemplo usados solo por páginas que todavía no se conectaron a la API (Help.tsx)
```
