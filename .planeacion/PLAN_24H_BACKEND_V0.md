# PLAN DE ENTREGA INMEDIATA (24 HORAS) - MVP BACKEND V0.1

**Documento:** Guía de ejecución rápida para Backend V0.1
**Responsable (Único):** Kairos (Tech Lead / Software Architect / Backend Lead)
**Prioridad:** Entrega rápida, arquitectura limpia, buena presentación, base sólida. NO optimizar para producción todavía.

## 1. Objetivo de la entrega

Demostrar que HabitApp **inició la transición a arquitectura híbrida** con un backend NestJS funcional, que:
1. Arranca, expone documentación Swagger y responde a health checks.
2. Valida JWT emitidos por **Supabase Auth**.
3. Lee datos reales de **Supabase PostgreSQL** (`gestion.usuarios`, relaciones).
4. Expone endpoints mínimos de **Usuarios** y **Entrenador**.
5. Sigue convenciones profesionales (módulos, guards, DTOs, validación).

## 2. Alcance del MVP Backend V0.1

- Backend independiente (repo `habitapp-api`).
- Configuración global (CORS, Swagger, ValidationPipe).
- Validación Auth con guards de NestJS.
- Endpoints protegidos por roles.

## 3. Estado Actual y Tareas Completadas

✅ Repositorio GitHub creado: `habitapp-api`
✅ Rama `develop` creada
✅ Git configurado correctamente
✅ SSH configurado correctamente con GitHub
✅ Push a GitHub funcionando mediante SSH

## 4. Cronograma Detallado y Siguiente Paso (Próximas 24 horas)

El desarrollo del backend V0.1 será realizado **únicamente por Kairos**, simplificando el flujo de ramas y eliminando los bloqueos por reviews cruzados.

### Siguiente tarea INMEDIATA:
👉 **Paso 1: Bootstrap de la aplicación NestJS.** (Generar proyecto con Nest CLI, limpiar archivos base, configurar variables de entorno iniciales y el prefijo global `/api/v1`).

### Secuencia de Tareas Pendientes (Orden de ejecución)

| # | Tarea | Estado |
|---|-------|--------|
| 1 | **NestJS Bootstrap:** `nest new`, limpiar base, configurar `.env` y global prefix `/api/v1` | **Bloqueante** (Siguiente) |
| 2 | **Config & Health:** Módulos `config` y `health` (`GET /health`), integración de Swagger | Pendiente |
| 3 | **Supabase & Auth:** Implementar `SupabaseService` (service_role), estrategias JWT, `SupabaseJwtGuard`, `RolesGuard` | Pendiente |
| 4 | **Users Module:** DTOs, Repository, Endpoints (`GET /users/me`, `GET /users`, `PATCH /users/:id/role`) | Pendiente |
| 5 | **Coach Module:** DTOs, Repository, Endpoint (`GET /coach/clients`) | Pendiente |
| 6 | **Documentación & QA:** Revisión final, `.env.example`, README con instrucciones | Puede posponerse |

## 5. Arquitectura Mínima

```text
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       ▼ HTTPS
┌─────────────────────────────────────┐
│     Frontend — Next.js 16           │
└──────────────┬──────────────────────┘
               │ Authorization: Bearer <JWT Supabase>
               ▼
┌─────────────────────────────────────┐
│     Backend — NestJS V0.1           │
│  (repo: habitapp-api)               │
└─────────────────────────┬───────────┘
                          │ service_role (server only)
                          ▼
┌─────────────────────────────────────┐
│          Supabase                   │
└─────────────────────────────────────┘
```

## 6. Estructura Inicial del Repositorio NestJS

```text
habitapp-api/
├── src/
│   ├── main.ts                 # Bootstrap, Swagger, CORS, API prefix
│   ├── app.module.ts           # Root module
│   ├── config/                 # config.module.ts, variables de entorno tipadas
│   ├── common/                 # guards/, decorators/, filters/, interceptors/
│   ├── supabase/               # supabase.module.ts, supabase.service.ts
│   ├── auth/                   # estrategias passport JWT
│   ├── health/                 # health.controller.ts
│   ├── users/                  # modulo usuarios, repositorios, DTOs
│   └── coach/                  # modulo entrenador, repositorios, DTOs
├── .env.example
├── package.json
└── README.md
```

## 7. Dependencias Mínimas

### Producción
```bash
npm i @nestjs/config @nestjs/swagger @nestjs/passport @nestjs/jwt passport passport-jwt @supabase/supabase-js class-validator class-transformer
```

### Desarrollo
```bash
npm i -D @types/passport-jwt supertest @types/supertest
```

## 8. Endpoints Mínimos para Mañana

1. `GET /api/v1/health` (Sin Auth) - Health check rápido.
2. `GET /api/v1/users/me` (Auth: JWT válido) - Devuelve perfil asociado al JWT.
3. `GET /api/v1/users` (Auth: Admin) - Lista de usuarios en la base de datos.
4. `PATCH /api/v1/users/:id/role` (Auth: Admin) - Cambiar el rol a un usuario.
5. `GET /api/v1/coach/clients` (Auth: Entrenador) - Listado de pupilos asignados.

## 9. GitFlow Simplificado (Un Desarrollador)

Como único desarrollador para esta fase inmediata:
- Trabaja preferiblemente desde `develop` o en ramas temporales por módulo (ej: `feature/users-module`) y fuziónalas a `develop` directamente.
- No hay necesidad de PR reviews ni aprobaciones externas.
- Al terminar la presentación / V0.1, haz un PR/merge de `develop` a `main` y taggea `v0.1.0-backend`.

## 10. Commits Semánticos Recomendados

Mantén la disciplina semántica para dejar una base profesional:
- `chore: inicializar repositorio con NestJS CLI`
- `feat(config): agregar validación de entorno`
- `feat(supabase): agregar servicio Supabase con service_role`
- `feat(auth): implementar guards JWT y RolesGuard`
- `feat(health): agregar endpoint de healthcheck`
- `feat(users): implementar endpoints y queries para perfiles`
- `feat(coach): implementar GET clients`
- `docs: actualizar README de arranque`

## 11. Riesgos de la Entrega Inmediata

- **Secretos Desactualizados:** El `SUPABASE_JWT_SECRET` debe coincidir con el dashboard de Supabase para poder validar los tokens emitidos en frontend.
- **Service Role Expuesto:** Jamás comitear el `SUPABASE_SERVICE_ROLE_KEY`. Debe estar solo en `.env`.
- **Datos Seed para Demo:** Si no tienes un usuario administrador o entrenador configurado, edita manualmente en la base de datos de Supabase temporalmente para que la demo funcione.

## 12. Checklist de Entrega

- [ ] La app se levanta con `npm run start:dev` en `localhost:4000`.
- [ ] Swagger accesible y documentado en `/api/docs`.
- [ ] El guard rechaza requests sin token (`401`) y roles no autorizados (`403`).
- [ ] El flujo de la demostración funciona de principio a fin (con Postman o la UI Swagger + un JWT generado en frontend).
- [ ] El código está limpio y respeta la estructura propuesta.
