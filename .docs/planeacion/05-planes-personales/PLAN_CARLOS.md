# PLAN_CARLOS

**Integrante:** Carlos  
**Rol:** Tech Lead, Software Architect y Backend Lead  
**Proyecto:** HabitApp  
**Estado:** Guía operativa para iniciar desarrollo  
**Documento base:** `.docs/planeacion/00-general/plan-maestro-habitapp.md`  

---

## 1. Responsabilidades

Carlos es responsable de dirigir la evolución de HabitApp desde un frontend funcional en Next.js/Supabase hacia un proyecto híbrido con backend propio en NestJS.

Responsabilidades principales:

- Custodiar la arquitectura oficial del backend NestJS.
- Mantener la integración segura entre NestJS y Supabase.
- Definir estándares técnicos para controllers, services, repositories, DTOs, entities, guards y Swagger.
- Coordinar trabajo con agentes o desarrolladores sin romper GitFlow.
- Revisar PRs críticos de seguridad, arquitectura, `common/`, `auth/`, `supabase/`, guards, Swagger y migraciones.
- Asegurar que el frontend existente se corrija antes de migrar flujos complejos al backend.
- Mantener el plan maestro y este plan personal actualizados.

## 2. Objetivos

- Corregir imperfecciones críticas del frontend existente.
- Construir un backend NestJS modular, mantenible y simple.
- Evitar Clean Architecture estricta por módulo.
- Mantener Supabase como Auth, PostgreSQL, RLS y Storage.
- Usar NestJS para lógica privilegiada, administración, entrenador, notificaciones, reportes y operaciones con `service_role`.
- Dejar Swagger/OpenAPI como contrato real entre frontend y backend.
- Trabajar con ramas pequeñas, commits semánticos y PRs revisables.

## 3. Módulos bajo responsabilidad de Carlos

- Arquitectura.
- Backend NestJS.
- Integración Supabase.
- Seguridad.
- Swagger/OpenAPI.
- GitFlow.
- Git semántico.
- Revisiones técnicas.

## 4. Arquitectura que debe defender Carlos

```text
src/
├── config/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   ├── interceptors/
│   ├── pipes/
│   └── dto/
├── supabase/
├── auth/
├── health/
├── users/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dto/
│   ├── entities/
│   └── users.module.ts
├── coach/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dto/
│   ├── entities/
│   └── coach.module.ts
├── admin/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dto/
│   ├── entities/
│   └── admin.module.ts
├── notifications/
├── reports/
└── main.ts
```

Regla clave: no crear `domain/`, `application/`, `infrastructure/` y `presentation/` por cada módulo.

## 5. Roadmap personal

| Orden | Foco | Resultado |
|-------|------|-----------|
| 1 | Leer contexto vigente | Entender frontend existente, deuda y plan maestro |
| 2 | Seguridad base | RLS, variables, `service_role`, JWT y roles claros |
| 3 | Backend base | `config`, `common`, `supabase`, `auth`, `health` |
| 4 | Módulos iniciales | `users` y `coach` con repositories y Swagger |
| 5 | Contratos | OpenAPI versionado y API client frontend |
| 6 | Admin/Coach avanzado | Operaciones privilegiadas fuera del frontend |
| 7 | Producción | hardening, rate limit, CI, monitoring y release |

## 6. Entregables

| Entregable | Archivo/Rama | Criterio de aceptación |
|------------|--------------|------------------------|
| Arquitectura backend documentada | `chore/docs-adr-nestjs-modular-architecture` | Documento aprobado y alineado al plan maestro |
| Auth backend | `feature/be-supabase-auth` | JWT inválido da 401, rol incorrecto da 403 |
| Supabase seguro | `feature/be-supabase-auth` | `service_role` solo existe en backend |
| Migraciones/RLS | `feature/be-supabase-migrations` | SQL versionado y políticas revisadas |
| OpenAPI v1 | `feature/be-openapi-v1` | Swagger exportado y versionado |
| API client frontend | `feature/fe-api-client` | Frontend consume `/users/me` desde NestJS |
| Proxy actions | `feature/fe-api-proxy-actions` | Server Actions llaman backend sin duplicar lógica |
| Security hardening | `feature/prod-security-headers` | Rate limit, headers y configuración segura |

## 7. Features asignadas

| Rama | Prioridad | Objetivo |
|------|-----------|----------|
| `feature/be-supabase-auth` | P0 | Guards JWT, RolesGuard, CurrentUser, SupabaseService |
| `feature/be-supabase-migrations` | P0 | Migraciones Supabase CLI y RLS completo |
| `feature/fe-api-client` | P0 | Cliente API frontend con JWT |
| `feature/be-openapi-v1` | P0 | Contrato Swagger/OpenAPI |
| `feature/fe-api-proxy-actions` | P0 | Server Actions hacia backend NestJS |
| `feature/prod-security-headers` | P0 | CSP, HSTS, throttling y headers seguros |
| `chore/docs-adr-nestjs-modular-architecture` | P1 | Decisión arquitectónica formal |

## 8. Issues asignados

| Issue | Prioridad | Resultado esperado |
|-------|-----------|--------------------|
| ISSUE-002 | P0 | Supabase JWT Auth Guards |
| ISSUE-010 | P0 | Migraciones Supabase CLI + RLS completo |
| ISSUE-020 | P0 | API Client frontend |
| ISSUE-021 | P0 | OpenAPI spec v1 congelada |
| ISSUE-023 | P1 | ADR arquitectura modular NestJS |
| ISSUE-043 | P0 | Server Actions proxy backend |
| ISSUE-053 | P0 | Security headers + rate limiting |
| ISSUE-055 | P1 | Load test k6 |
| ISSUE-056 | P0 | Release v1.0.0 |

## 9. Checklist inicial de Carlos

Antes de iniciar desarrollo:

- [x] Leer `.docs/planeacion/00-general/plan-maestro-habitapp.md`.
- [x] Leer `.docs/planeacion/02-backend/arquitectura-backend-nestjs.md`.
- [x] Leer `.docs/planeacion/01-frontend/requerimientos-frontend.md`.
- [x] Confirmar ramas `main` y `develop`.
- [x] Confirmar que no se hará push directo a `main`.
- [x] Confirmar variables necesarias de Supabase.
- [x] Confirmar dónde vive el backend NestJS (`habitapp-api` o carpeta/repo acordado).
- [x] Confirmar que `SUPABASE_SERVICE_ROLE_KEY` nunca se use en frontend.

## 10. Checklist por rama

Antes de crear una rama:

- [ ] La rama sale de `develop`.
- [ ] El nombre cumple GitFlow: `feature/*`, `bugfix/*`, `chore/*`, `hotfix/*` o `release/*`.
- [ ] La rama tiene un objetivo único.
- [ ] Existe issue o tarea asociada.
- [ ] Está claro quién revisa.

Durante el desarrollo:

- [ ] Commits con Conventional Commits.
- [ ] Sin secretos en código, logs ni documentación.
- [ ] DTOs documentados con Swagger.
- [ ] Services contienen lógica de negocio.
- [ ] Repositories contienen acceso a Supabase.
- [ ] Controllers no consultan Supabase directamente.
- [ ] Guards aplicados donde corresponde.

Antes de PR:

- [ ] `npm run lint` ejecutado si aplica.
- [ ] `npm run test` ejecutado si aplica.
- [ ] `npm run build` ejecutado si aplica.
- [ ] Swagger actualizado si cambia API.
- [ ] README o documentación actualizada si cambia flujo.
- [ ] PR apunta a `develop`.
- [ ] PR explica qué cambió, cómo probarlo y riesgos.

## 11. Trabajo con agentes

Usa esta sección para dividir tareas entre agentes sin perder coherencia.

### Agente Arquitectura

Objetivo:
- Revisar estructura de módulos, nombres, dependencias y consistencia con el plan maestro.

Contexto obligatorio:
- `PLAN_CARLOS.md`.
- `plan-maestro-habitapp.md`.
- `arquitectura-backend-nestjs.md`.

Checklist:
- [ ] No propone Clean Architecture estricta por módulo.
- [ ] Valida controllers/services/repositories/dto/entities.
- [ ] Detecta acoplamientos innecesarios.
- [ ] Entrega observaciones con archivo y línea.

### Agente Seguridad

Objetivo:
- Revisar JWT, roles, RLS, `service_role`, variables y endpoints protegidos.

Checklist:
- [ ] `service_role` solo en backend.
- [ ] No hay `NEXT_PUBLIC_*` para secretos privados.
- [ ] Endpoints admin usan `RolesGuard`.
- [ ] Requests sin token devuelven 401.
- [ ] Rol insuficiente devuelve 403.
- [ ] Logs no imprimen JWT ni keys.

### Agente Backend NestJS

Objetivo:
- Implementar módulos y endpoints siguiendo la arquitectura definida.

Checklist:
- [ ] Crea `*.module.ts`.
- [ ] Crea controller, service, repository, dto y entity si aplica.
- [ ] Usa inyección de dependencias de NestJS.
- [ ] Agrega DTOs con `class-validator`.
- [ ] Agrega Swagger con `@ApiTags`, `@ApiBearerAuth` y `@ApiProperty`.
- [ ] No accede a Supabase desde controllers.

### Agente Frontend Integración

Objetivo:
- Conectar Server Actions o API client del frontend con NestJS sin romper el frontend existente.

Checklist:
- [ ] Mantiene flujo frontend actual cuando aún no se migra.
- [ ] Usa API client centralizado.
- [ ] Envía JWT de Supabase al backend.
- [ ] Maneja 401/403/500 de forma clara.
- [ ] No duplica reglas de negocio backend.

### Agente Documentación

Objetivo:
- Mantener docs consistentes después de cada cambio técnico.

Checklist:
- [ ] Actualiza plan maestro si cambia roadmap.
- [ ] Actualiza Swagger/OpenAPI si cambia API.
- [ ] Actualiza `PLAN_CARLOS.md` si cambia responsabilidad.
- [ ] Usa rutas `.docs/planeacion/01-frontend`, `.docs/planeacion/02-backend` o `.docs/planeacion/06-historico`.

### Agente QA

Objetivo:
- Validar que el cambio funciona y no rompe flujos críticos.

Checklist:
- [ ] Prueba login.
- [ ] Prueba endpoint health.
- [ ] Prueba endpoint protegido con token válido.
- [ ] Prueba endpoint protegido sin token.
- [ ] Prueba rol incorrecto.
- [ ] Documenta evidencia manual o automatizada.

## 12. Plantilla de handoff para agentes

Cada agente debe entregar su resultado con este formato:

```md
## Resumen
- Qué se hizo.

## Archivos tocados
- Ruta 1
- Ruta 2

## Validación
- Comando ejecutado o prueba manual.

## Riesgos
- Riesgos restantes.

## Siguiente paso sugerido
- Acción concreta.
```

## 13. Checklist de arquitectura backend

- [ ] `config/` centraliza variables y validación de entorno.
- [ ] `common/decorators` contiene `@Roles()` y `@CurrentUser()`.
- [ ] `common/guards` contiene guards reutilizables.
- [ ] `common/filters` contiene manejo global de errores si aplica.
- [ ] `common/interceptors` no registra datos sensibles.
- [ ] `supabase/` encapsula cliente Supabase.
- [ ] `auth/` valida JWT y roles.
- [ ] `users/` resuelve perfil y gestión de usuarios.
- [ ] `coach/` resuelve pupilos y rutinas.
- [ ] `admin/` resuelve operaciones privilegiadas.
- [ ] `notifications/` y `reports/` se construyen después de base segura.

## 14. Checklist de seguridad

- [ ] No hay secretos en commits.
- [ ] No hay `service_role` en frontend.
- [ ] `.env.example` no contiene valores reales.
- [ ] JWT se valida con secret correcto.
- [ ] Guards devuelven 401/403 según caso.
- [ ] Swagger no expone secretos.
- [ ] Rate limit planificado para endpoints públicos o sensibles.
- [ ] RLS sigue activo en Supabase.
- [ ] Operaciones admin pasan por NestJS.

## 15. Checklist Swagger/OpenAPI

- [ ] Swagger disponible en `/api/docs`.
- [ ] API usa prefijo `/api/v1`.
- [ ] Cada controller tiene `@ApiTags`.
- [ ] Endpoints protegidos tienen `@ApiBearerAuth`.
- [ ] Request DTOs tienen `@ApiProperty`.
- [ ] Responses principales están documentadas.
- [ ] `openapi.yaml` se exporta cuando se congele contrato.

## 16. Checklist GitFlow y commits

- [ ] Rama creada desde `develop`.
- [ ] Rama con prefijo correcto.
- [ ] Commits en formato `<tipo>(<scope>): <descripción>`.
- [ ] PR hacia `develop`.
- [ ] Squash merge para features.
- [ ] Merge commit solo para releases si se acuerda.

Ejemplos válidos:

```bash
feat(auth): implementar guard jwt de supabase
feat(users): agregar endpoint users me
fix(auth): corregir respuesta 403 en roles guard
docs(backend): actualizar arquitectura nestjs
chore(ci): agregar workflow backend
```

## 17. Prioridades

1. Seguridad y secretos.
2. RLS y migraciones confiables.
3. Backend base NestJS.
4. Swagger/OpenAPI.
5. Integración frontend-backend.
6. Admin y Coach avanzado.
7. Observabilidad y producción.

## 18. Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Exponer `SUPABASE_SERVICE_ROLE_KEY` | Crítico | Revisiones, secret scanning y variable solo backend |
| Sobrediseñar backend | Alto | Mantener arquitectura modular simple |
| Romper frontend existente | Alto | Migrar por módulo y mantener pruebas smoke |
| Drift Swagger/API | Alto | Exportar OpenAPI y revisar en PR |
| RLS incompleto | Alto | Migraciones versionadas y revisión manual |
| Demasiados agentes tocando lo mismo | Medio | Un agente por rama y handoff obligatorio |

## 19. Próximos pasos

- [ ] Confirmar ubicación real del backend NestJS.
- [ ] Crear o continuar rama `feature/be-supabase-auth`.
- [ ] Implementar base `config`, `common`, `supabase` y `auth`.
- [ ] Validar health endpoint.
- [ ] Preparar Swagger base.
- [ ] Revisar RLS y scripts SQL en `.docs/base-datos/sql`.
- [ ] Crear checklist de PR para backend.

## 20. Definición de terminado

Una tarea de Carlos se considera terminada cuando:

- El código compila.
- La rama cumple GitFlow.
- Los commits cumplen Conventional Commits.
- La seguridad fue revisada.
- Swagger/documentación fue actualizada si aplica.
- Hay evidencia de prueba manual o automatizada.
- El cambio puede ser revisado por otro integrante o agente sin contexto adicional.
