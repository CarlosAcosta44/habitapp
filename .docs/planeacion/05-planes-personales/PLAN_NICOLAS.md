# PLAN_NICOLAS

**Integrante:** Nicolas (D3)  
**Rol:** Full-stack (D3) orientado a usuario, perfil, hábitos, reportes y QA frontend  
**Proyecto:** HabitApp  
**Documento base:** `.docs/planeacion/00-general/plan-maestro-habitapp.md`  

## Responsabilidades

- Mantener módulos de hábitos, perfil y usuario del frontend.
- Apoyar integración con backend NestJS desde el API client.
- Generar y mantener tipos de Supabase.
- Desarrollar reportes y ranking.
- Liderar pruebas E2E críticas junto con Juan.

## Objetivos

- Corregir ownership y seguridad en hábitos.
- Extraer lógica pesada de perfil hacia services.
- Preparar tipos Supabase confiables.
- Implementar reportes backend y ranking con cache cuando aplique.
- Validar flujos críticos con Playwright.

## Módulos bajo su responsabilidad

- Hábitos.
- Perfil.
- Users.
- Supabase types.
- Reports.
- Ranking.
- QA frontend.
- E2E.

## Features asignadas

| Rama | Prioridad | Objetivo |
|------|-----------|----------|
| `feature/be-users-module` | P0 | ✅ Users endpoints iniciales |
| `feature/fe-habito-ownership` | P0 | ✅ Validar ownership en services |
| `feature/fe-perfil-service` | P1 | Extraer PerfilService |
| `feature/fe-supabase-types` | P1 | Generar `database.types.ts` |
| `feature/fe-unify-habit-create` | P1 | ✅ Unificar flujo crear hábito |
| `feature/fe-require-user-helper` | P1 | ✅ Helper `requireUser/requireRole` |
| `feature/be-reports-ranking` | P1 | Ranking con cache |
| `feature/be-reports-user` | P2 | Reporte resumen usuario |
| `chore/e2e-critical-flows` | P0 | Playwright flujos críticos |

## Checklist inicial

- [x] Leer plan maestro.
- [x] Leer requerimientos frontend.
- [x] Revisar services y repositories actuales de hábitos.
- [x] Revisar perfil actual y responsabilidades mezcladas.
- [x] Confirmar schema Supabase y scripts SQL.
- [x] Confirmar criterios de ownership por `idusuario`.

## Checklist por tarea

- [x] Validar usuario autenticado con `getUser()` o helper acordado.
- [x] Evitar queries Supabase directas desde UI.
- [x] Mantener patrón service/repository en frontend.
- [x] Regenerar tipos si cambia schema.
- [x] Agregar prueba manual de IDOR cuando aplique.
- [x] Documentar cambios de contratos.

## Checklist por rama

Antes de iniciar:

- [x] Crear rama desde `develop`.
- [x] Confirmar issue o feature del plan maestro.
- [x] Identificar si el cambio afecta frontend, backend o ambos.
- [x] Confirmar datos necesarios de Supabase.

Antes de abrir PR:

- [x] PR apunta a `develop`.
- [x] Validación de ownership documentada si aplica.
- [x] No hay queries directas desde UI si existe service/repository.
- [x] Tipos actualizados si cambió schema.
- [x] Se probó usuario autenticado y usuario no autorizado cuando aplique.
- [x] Se actualizó documentación si cambia contrato o flujo.

## Cronograma personal

| Periodo | Actividad |
|---------|-----------|
| Fase 1 | Ownership hábitos, PerfilService, apoyo auth hardening |
| Fase 2 | Supabase types, flujo único crear hábito, helpers auth |
| Fase 3 | Reports/ranking backend y apoyo cobertura services |
| Fase 4 | E2E críticos e integración frontend-backend |
| Fase 5 | Validación de reportes y soporte release |

## Trabajo con agentes

Agente frontend domain:
- Revisar habits, perfil, services y repositories.

Agente backend reports:
- Revisar endpoints `reports` y cache.

Agente QA:
- Preparar Playwright para login, hábito, perfil, ranking y reportes.

## Plantilla de handoff

```md
## Resumen
- Qué flujo de usuario se tocó.

## Datos validados
- Usuario, hábito, perfil, ranking o reporte usado.

## Validación
- Pruebas manuales o automatizadas.

## Riesgos
- Riesgos pendientes.

## Siguiente paso
- Acción recomendada.
```

## Prioridades

1. Ownership hábitos.
2. PerfilService.
3. Tipos Supabase.
4. API client e integración.
5. Reports/ranking.
6. E2E.

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| IDOR en hábitos | Validar ownership en service y RLS |
| Tipos desactualizados | Regenerar luego de migraciones |
| Perfil con demasiada lógica UI | Extraer service y componentes |
| Ranking lento | Cache backend y queries revisadas |

## Definición de terminado

- Ownership validado.
- Tipos actualizados si aplica.
- PR pequeño y revisable.
- Evidencia de prueba manual o E2E.
- Documentación actualizada si cambia contrato.
- Sin lógica de negocio pesada en páginas.
- Sin regresiones visibles en hábitos, perfil o ranking.
