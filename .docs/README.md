# Documentación HabitApp

Esta carpeta centraliza la documentación mantenible del proyecto HabitApp.

## Estructura

```text
.docs/
├── planeacion/
│   ├── 00-general/
│   ├── 01-frontend/
│   ├── 02-backend/
│   ├── 03-base-datos/
│   ├── 04-tecnologia/
│   ├── 05-planes-personales/
│   └── 06-historico/
├── assets/
├── base-datos/
├── anexos/
└── presentaciones/
```

## Documentos principales

| Documento | Uso |
|-----------|-----|
| `planeacion/00-general/plan-maestro-habitapp.md` | Plan maestro oficial vigente |
| `planeacion/00-general/checklist-requerimientos-progreso.md` | Checklist de cumplimiento, progreso y frontera Supabase/NestJS |
| `planeacion/01-frontend/` | Documentación del frontend ya realizado |
| `planeacion/02-backend/arquitectura-backend-nestjs.md` | Decisión arquitectónica oficial del backend |
| `planeacion/06-historico/plan-backend-24h-v0-presentado.md` | Entrega inmediata ya presentada |
| `planeacion/04-tecnologia/stack-tecnologico-y-gitflow.md` | Stack, GitFlow y Git semántico |
| `planeacion/05-planes-personales/PLAN_CARLOS.md` | Guía personal de Carlos |
| `planeacion/05-planes-personales/PLAN_BREINER.md` | Guía personal de Breiner |
| `planeacion/05-planes-personales/PLAN_NICOLAS.md` | Guía personal de Nicolas |
| `planeacion/05-planes-personales/PLAN_JUAN.md` | Guía personal de Juan |

## Criterio de numeración

Las carpetas de `planeacion/` usan prefijos numéricos para mantener un orden de lectura estable. La numeración correcta es:

1. `00-general`: visión, plan maestro y checklist de progreso.
2. `01-frontend`: documentación del frontend ya construido.
3. `02-backend`: arquitectura y decisiones del backend NestJS.
4. `03-base-datos`: modelo y referencia de datos.
5. `04-tecnologia`: stack, GitFlow y Git semántico.
6. `05-planes-personales`: planes individuales de trabajo.
7. `06-historico`: entregas o planes ya presentados que no son la guía activa.

Si antes parecía saltarse `01` y `02`, era por una reorganización intermedia donde esas carpetas habían quedado con nombres semánticos (`frontend`, `backend`, `historico`) en vez de prefijos numéricos. Ya quedó corregido.

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

El backend propio se construye en el repositorio `habitapp-api` con NestJS y Supabase. El nombre `habitapp-api` es adecuado porque comunica con claridad que es la API backend del producto y evita mezclar responsabilidades con el frontend `habitapp`.

NestJS se usará para lógica privilegiada, administración, entrenador, notificaciones, reportes e integraciones que requieren mayor control o uso seguro de `service_role`.

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

## Documentación para `habitapp-api`

No se recomienda copiar toda la carpeta `.docs` al repositorio `habitapp-api`, porque esta documentación contiene contexto del frontend, diseños, base de datos, anexos y planes personales del equipo completo.

Lo recomendado es copiar al backend solo un subconjunto mínimo:

- `planeacion/02-backend/arquitectura-backend-nestjs.md`.
- `planeacion/00-general/checklist-requerimientos-progreso.md`.
- `planeacion/00-general/plan-maestro-habitapp.md` como referencia o resumen.
- `planeacion/04-tecnologia/stack-tecnologico-y-gitflow.md`.

En `habitapp-api` debería existir su propio `README.md` con:

- propósito del backend;
- arquitectura modular NestJS;
- variables de entorno;
- scripts de desarrollo;
- Swagger/OpenAPI;
- conexión segura a Supabase;
- reglas de GitFlow y Conventional Commits;
- enlace al plan maestro del frontend si el repositorio está en la misma organización.

## Fuente de verdad documental

- El plan activo es `planeacion/00-general/plan-maestro-habitapp.md`.
- La documentación del frontend está en `planeacion/01-frontend/`.
- La arquitectura backend está en `planeacion/02-backend/`.
- Los planes personales están en `planeacion/05-planes-personales/`.
- Los documentos de entregas ya presentadas están en `planeacion/06-historico/`.
