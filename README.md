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

## Roadmap

- [x] Base del proyecto, datos y módulo de productos
- [ ] Autenticación JWT, roles y órdenes
- [ ] Pruebas unitarias y e2e + CI
- [ ] Procesamiento asíncrono con SQS
- [ ] Despliegue en AWS