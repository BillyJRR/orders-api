# orders-api

API REST de pedidos construida con NestJS, TypeScript y PostgreSQL, organizada con Clean Architecture.

> Estado: en desarrollo. Proyecto personal de portafolio.

## Qué demuestra

- Arquitectura por capas (domain, application, infrastructure, presentation) con la regla de dependencia verificada por oxlint.
- PostgreSQL con migraciones SQL versionadas y reversibles.
- Validación de entrada, manejo de errores de dominio y documentación OpenAPI.
- Entorno reproducible con Docker y Docker Compose.

## Arranque rápido

```bash
cp .env.example .env
docker compose up -d --build
docker compose run --rm api npm run migration:run:prod
docker compose run --rm api npm run seed:prod
```

Swagger: http://localhost:3000/docs

## Arquitectura

Cada módulo se divide en cuatro capas. Las dependencias apuntan hacia adentro: presentation e infrastructure dependen de application, y application depende de domain.

## Modelo de datos

Ver [docs/er-diagram.md](docs/er-diagram.md).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | API con recarga automática |
| `npm run migration:run` | Aplica migraciones |
| `npm run migration:revert` | Revierte la última migración |
| `npm run seed` | Carga productos de ejemplo |
| `npm run lint` | Valida estilo y reglas de arquitectura |

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/users` | Público (registro, siempre crea rol `customer`) |
| POST | `/auth/login` | Público |
| GET | `/users/me` | Autenticado |
| GET | `/products`, `/products/:id` | Público |
| POST | `/products` | Solo `admin` |
| POST | `/orders` | Autenticado |
| GET | `/orders`, `/orders/:id` | Autenticado (el dueño o `admin`) |
| GET | `/health` | Público |

## Decisiones de seguridad

- Guard JWT global: todo requiere token salvo lo marcado como público.
- Contraseñas con scrypt (Node `crypto`), sal aleatoria por contraseña y comparación en tiempo constante.
- El registro no acepta el campo `role` (protección contra asignación masiva).
- Las órdenes se crean en una transacción con bloqueo de filas para evitar sobreventa.

## Limitaciones conocidas

- Sin refresh tokens ni login social.
- Sin límite de intentos de login (rate limiting).
- El login responde más rápido cuando el email no existe (posible enumeración por tiempos).
- Una sola moneda; no hay endpoints de pago ni cancelación todavía (las transiciones existen en el dominio).

## Roadmap

- [x] Base del proyecto, datos y módulo de productos
- [x] Autenticación JWT, roles y órdenes
- [ ] Pruebas unitarias y e2e + CI
- [ ] Procesamiento asíncrono con SQS
- [ ] Despliegue en AWS