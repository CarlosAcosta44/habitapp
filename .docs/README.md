# Documentación HabitApp

Esta carpeta centraliza la documentación mantenible del proyecto HabitApp.

## Estructura

```text
.docs/
├── planeacion/
│   ├── 00-general/
│   ├── 03-base-datos/
│   ├── 04-tecnologia/
│   ├── 05-planes-personales/
│   ├── frontend/
│   ├── backend/
│   └── historico/
├── assets/
├── base-datos/
├── anexos/
└── presentaciones/
```

## Documentos principales

| Documento | Uso |
|-----------|-----|
| `planeacion/00-general/plan-maestro-habitapp.md` | Plan maestro oficial vigente |
| `planeacion/frontend/` | Documentación del frontend ya realizado |
| `planeacion/backend/arquitectura-backend-nestjs.md` | Decisión arquitectónica oficial del backend |
| `planeacion/historico/plan-backend-24h-v0-presentado.md` | Entrega inmediata ya presentada |
| `planeacion/04-tecnologia/stack-tecnologico-y-gitflow.md` | Stack, GitFlow y Git semántico |
| `planeacion/05-planes-personales/PLAN_CARLOS.md` | Guía personal de Carlos |
| `planeacion/05-planes-personales/PLAN_BREINER.md` | Guía personal de Breiner |
| `planeacion/05-planes-personales/PLAN_NICOLAS.md` | Guía personal de Nicolas |
| `planeacion/05-planes-personales/PLAN_JUAN.md` | Guía personal de Juan |

## Decisión vigente

HabitApp evoluciona hacia un proyecto híbrido: frontend existente en Next.js, Supabase y Tailwind CSS; backend propio en NestJS con arquitectura modular inspirada en principios de Clean Architecture. No se utilizará una Clean Architecture estricta con `domain/`, `application/`, `infrastructure/` y `presentation/` por cada módulo.

## Frontend realizado

El frontend actual fue construido con Next.js, Supabase, Tailwind CSS, TypeScript y React. Su objetivo es entregar la experiencia principal de HabitApp:

- Registro, login y recuperación de contraseña mediante Supabase Auth.
- Gestión de hábitos, rachas, puntos y progreso.
- Comunidad, foros, ranking y perfil de usuario.
- Integración directa con Supabase en los flujos que todavía permanecen en frontend.
- Arquitectura por capas en frontend: UI/Page, Server Actions, Services, Repositories y Supabase.

El frontend debe estabilizarse antes de migrar flujos complejos al backend. Las prioridades son seguridad, rutas, ownership de datos, navegación móvil, CI y documentación.

## Backend NestJS en construcción

El backend propio se construye con NestJS y Supabase. NestJS se usará para lógica privilegiada, administración, entrenador, notificaciones, reportes e integraciones que requieren mayor control o uso seguro de `service_role`.

Razones de la elección:

1. **TypeScript compartido:** NestJS permite mantener coherencia técnica con el frontend Next.js.
2. **Estructura modular:** Los módulos `auth`, `users`, `coach`, `admin`, `notifications` y `reports` permiten crecer sin crear una estructura excesivamente compleja.
3. **Integración segura con Supabase:** Supabase mantiene Auth, PostgreSQL, RLS y Storage; NestJS valida JWT, roles y operaciones privilegiadas.
4. **Seguridad y validación:** Guards, decorators, pipes y DTOs permiten controlar permisos y contratos de entrada.
5. **Swagger/OpenAPI:** El backend expone documentación de API para que frontend y backend trabajen con contrato claro.

Flujo objetivo de una petición:

1. El usuario usa el frontend Next.js.
2. El frontend obtiene JWT desde Supabase Auth.
3. El frontend llama a NestJS con `Authorization: Bearer <token>`.
4. NestJS valida el JWT y roles con guards.
5. El service aplica reglas de negocio.
6. El repository consulta Supabase.
7. NestJS responde JSON al frontend.

## Fuente de verdad documental

- El plan activo es `planeacion/00-general/plan-maestro-habitapp.md`.
- La documentación del frontend está en `planeacion/frontend/`.
- La arquitectura backend está en `planeacion/backend/`.
- Los planes personales están en `planeacion/05-planes-personales/`.
- Los documentos de entregas ya presentadas están en `planeacion/historico/`.
