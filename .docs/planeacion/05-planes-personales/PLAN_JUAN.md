# PLAN_JUAN

**Integrante:** Juan  
**Rol:** Full-stack (D4) orientado a comunidad, coach, admin y pruebas backend  
**Proyecto:** HabitApp  
**Documento base:** `.docs/planeacion/00-general/plan-maestro-habitapp.md`  

## Responsabilidades

- Mantener comunidad y flujos relacionados del frontend.
- Implementar módulos backend de coach y admin.
- Apoyar pruebas backend y documentación Swagger.
- Integrar UI de coach/admin con API NestJS.
- Revisar flujos de moderación, rutinas y asignaciones.

## Objetivos

- Corregir navegación y limpieza de comunidad.
- Construir CoachModule avanzado.
- Construir AdminModule para usuarios y moderación.
- Integrar UI admin/coach con backend.
- Apoyar E2E críticos junto con Nicolas.

## Módulos bajo su responsabilidad

- Comunidad.
- Coach.
- Admin.
- Moderación.
- Rutinas.
- Asignaciones.
- Tests backend.
- Swagger de módulos coach/admin.

## Features asignadas

| Rama | Prioridad | Objetivo |
|------|-----------|----------|
| `feature/be-coach-module` | P0 | Endpoint inicial coach clients |
| `feature/fe-cleanup-dead-code` | P2 | Limpieza técnica frontend |
| `bugfix/fe-foro-navigation` | P2 | Navegación foro detalle |
| `feature/be-admin-users` | P0 | Admin CRUD usuarios |
| `feature/be-admin-moderation` | P0 | Moderación admin |
| `feature/be-coach-routines` | P0 | CRUD rutinas |
| `feature/be-coach-assign` | P0 | Asignar rutina |
| `feature/be-coach-progress` | P1 | Progreso pupilo |
| `chore/be-services-coverage` | P1 | Cobertura services backend |
| `feature/fe-admin-users-ui` | P0 | UI gestión usuarios |
| `feature/fe-coach-dashboard-api` | P0 | Entrenador via API |
| `chore/e2e-critical-flows` | P0 | E2E críticos |

## Checklist inicial

- [ ] Leer plan maestro.
- [ ] Leer arquitectura backend NestJS.
- [ ] Revisar flujos actuales de comunidad.
- [ ] Revisar requisitos de entrenador y admin.
- [ ] Confirmar roles necesarios para coach/admin.
- [ ] Confirmar endpoints objetivo en Swagger.

## Checklist por tarea

- [ ] Endpoints coach protegidos con rol entrenador.
- [ ] Endpoints admin protegidos con rol admin.
- [ ] Repositories validan relación entrenador-pupilo cuando aplique.
- [ ] DTOs documentados con Swagger.
- [ ] Services contienen reglas de negocio.
- [ ] Tests unitarios agregados si la lógica lo amerita.
- [ ] UI consume API, no queries directas en flujos migrados.

## Trabajo con agentes

Agente backend:
- Implementar módulos `coach` y `admin`.

Agente frontend:
- Integrar UI de admin/coach con API.

Agente QA:
- Probar roles, moderación, asignación de rutina y progreso.

## Prioridades

1. Coach clients.
2. Admin users.
3. Admin moderation.
4. Coach routines.
5. Coach assign/progress.
6. UI admin/coach.
7. E2E.

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Usuario sin rol accede a admin | RolesGuard y pruebas 403 |
| Entrenador ve pupilo incorrecto | Validar relación entrenador-pupilo |
| Swagger incompleto | Revisar DTOs y decorators antes del PR |
| UI sigue consultando Supabase directo | Migrar por flujo y revisar imports |

## Definición de terminado

- Endpoint protegido con guards.
- Swagger actualizado.
- Prueba manual de 401/403.
- PR hacia `develop`.
- Evidencia funcional del flujo admin/coach.
