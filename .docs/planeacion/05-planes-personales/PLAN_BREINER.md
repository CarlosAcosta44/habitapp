# PLAN_BREINER

**Integrante:** Breiner  
**Rol:** Frontend Lead + DevOps  
**Proyecto:** HabitApp  
**Documento base:** `.docs/planeacion/00-general/plan-maestro-habitapp.md`  

## Responsabilidades

- Liderar correcciones del frontend existente en Next.js, Supabase y Tailwind CSS.
- Mantener layout, navegación, auth UI y experiencia móvil.
- Configurar CI/CD del frontend y apoyar CI del backend.
- Apoyar despliegues Vercel y observabilidad.
- Revisar PRs frontend y validar consistencia visual.

## Objetivos

- Corregir rutas, autenticación y navegación móvil del frontend.
- Preparar CI para bloquear regresiones.
- Mantener el frontend estable mientras se integra NestJS.
- Apoyar módulos de notificaciones, Sentry y despliegue.

## Módulos bajo su responsabilidad

- Layout.
- Auth UI.
- Navegación móvil.
- CI/CD.
- Vercel.
- Notifications.
- Sentry.
- Deploy.

## Features asignadas

| Rama | Prioridad | Objetivo |
|------|-----------|----------|
| `feature/be-nest-bootstrap` | P0 | Bootstrap inicial NestJS ya presentado |
| `feature/be-health-module` | P0 | Health endpoint |
| `feature/fe-fix-dashboard-routes` | P0 | Eliminar rutas `/dashboard/*` |
| `feature/fe-auth-hardening` | P0 | Endurecer auth frontend |
| `feature/fe-env-example` | P0 | `.env.example` y gitignore |
| `feature/fe-mobile-nav` | P1 | Navegación móvil |
| `chore/fe-setup-ci` | P0 | CI frontend |
| `chore/be-setup-ci` | P0 | CI backend |
| `feature/be-notifications` | P1 | Módulo notificaciones |
| `feature/fe-admin-layout` | P0 | Layout admin |
| `feature/prod-sentry` | P0 | Sentry FE + BE |
| `feature/prod-monitoring` | P1 | Health + uptime |
| `chore/docs-privacy-terms` | P0 | Docs legales |

## Checklist inicial

- [ ] Leer plan maestro.
- [ ] Leer documentación frontend.
- [ ] Revisar rutas actuales del frontend.
- [ ] Confirmar variables `.env.local`.
- [ ] Confirmar scripts `lint`, `build` y `test` disponibles.
- [ ] Crear ramas desde `develop`.

## Checklist por tarea

- [ ] No romper flujo de login.
- [ ] No exponer secretos en `NEXT_PUBLIC_*`.
- [ ] Validar responsive en móvil.
- [ ] Mantener componentes consistentes con Tailwind.
- [ ] Actualizar documentación si cambia flujo.
- [ ] Ejecutar `npm run lint` si aplica.
- [ ] Ejecutar `npm run build` si aplica.

## Checklist por rama

Antes de iniciar:

- [ ] Crear rama desde `develop`.
- [ ] Usar prefijo correcto: `feature/*`, `bugfix/*` o `chore/*`.
- [ ] Confirmar issue asociado.
- [ ] Confirmar revisor.

Antes de abrir PR:

- [ ] El PR apunta a `develop`.
- [ ] La descripción incluye qué cambió y cómo probarlo.
- [ ] Se adjunta evidencia visual si el cambio afecta UI.
- [ ] Se verificó que login/logout siguen funcionando.
- [ ] Se verificó responsive en mobile si el cambio afecta layout.
- [ ] Se actualizaron docs si cambió flujo o configuración.

## Cronograma personal

| Periodo | Actividad |
|---------|-----------|
| Fase 1 | Rutas, auth hardening, `.env.example`, CI frontend |
| Fase 2 | Deploy preview, apoyo API client y revisión de integración |
| Fase 3 | Notifications, Docker/CI backend con apoyo de Carlos |
| Fase 4 | Admin layout y validación UI con backend |
| Fase 5 | Sentry, monitoring, despliegue y legal docs |

## Trabajo con agentes

Agente frontend:
- Revisar rutas, componentes, navegación y auth UI.

Agente DevOps:
- Revisar GitHub Actions, deploy previews y variables.

Agente QA:
- Probar login, navegación móvil, rutas protegidas y build.

## Plantilla de handoff

```md
## Resumen
- Qué se cambió.

## Validación
- Comandos o pruebas manuales.

## Evidencia visual
- Capturas o descripción del viewport probado.

## Riesgos
- Riesgos pendientes.

## Siguiente paso
- Acción recomendada.
```

## Prioridades

1. Rutas y auth frontend.
2. CI frontend.
3. Navegación móvil.
4. Admin layout.
5. Notificaciones y observabilidad.

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Romper login o callback | Smoke tests auth antes de PR |
| Variables mal nombradas | Revisar `.env.example` |
| UI móvil incompleta | Validar viewport 375px |
| CI bloquea por deuda previa | Separar fixes mínimos y deuda futura |

## Definición de terminado

- Rama correcta.
- Commits Conventional Commits.
- Build/lint verificado si aplica.
- PR hacia `develop`.
- Evidencia manual de pruebas frontend.
- Sin secretos en variables públicas.
- UI validada en desktop y mobile cuando aplique.
- Documentación actualizada si cambió configuración, flujo o despliegue.
