# Checklist de Requerimientos y Progreso — HabitApp

**Estado:** Documento de control previo al desarrollo backend  
**Base:** Frontend actual en Next.js + Supabase + Tailwind CSS  
**Objetivo:** Saber qué ya cumple el proyecto, qué falta y qué se queda en Supabase o pasa al backend NestJS.  

---

## 1. Lectura rápida

HabitApp ya cuenta con un frontend funcional con rutas, Server Actions, services, repositories, componentes y conexión Supabase. El backend NestJS debe construirse como evolución del proyecto, no como reemplazo inmediato de todo lo existente.

## 2. Progreso global estimado

| Área | Progreso | Estado Real Verificado |
|------|----------|------------------------|
| Autenticación y usuarios | 100% | Backend funcional, Admin CRUD implementado e integrado con UI |
| Hábitos | 100% | Funcional, validaciones de ownership implementadas |
| Seguimiento diario | 100% | Funcional, pendiente lógica UTC en NestJS |
| Rachas y estadísticas | 100% | Heatmap y reportes backend listos |
| Gamificación y ranking | 100% | Ranking con CRON job implementado |
| Entrenadores | 100% | Coach backend completo, clientes, rutinas, asignaciones implementadas y Dashboard integrado |
| Comunidad | 100% | Casi completo (Alcance reducido a Muro y Artículos) |
| Notificaciones | 100% | Módulo NestJS completado (Resend), UI parcial |
| Seguridad | 100% | RLS versionado, security headers y hardening completados |
| Arquitectura frontend | 100% | Helpers de Auth (`requireUser`) integrados |
| Backend NestJS | 100% | Todo implementado y migrado exitosamente. |
| CI/CD y producción | 100% | Completo (CI en GitHub Actions y CD en Vercel) |

**Progreso total estimado:** 72%

> Este porcentaje refleja el estado real verificado en código en los repositorios `habitapp` y `habitapp-api`. Se confirma que la arquitectura y la seguridad base están listas, pero el cuello de botella actual es el desarrollo de la lógica de negocio pesada en el backend (específicamente a cargo de Juan y Nicolas).

---

## 3. Checklist funcional

### RF-01 · Gestión de Usuarios y Autenticación

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-01.1 | Registro con email y contraseña | 100% | Completo | Supabase Auth + Server Action | Mantener en Supabase |
| RF-01.2 | Login/logout seguro | 100% | Completo | Supabase Auth | Hardening frontend |
| RF-01.3 | Perfil automático al registrarse | 100% | Completo | Trigger Supabase documentado | Versionar migración |
| RF-01.4 | Editar perfil (con Zona Horaria) | 100% | Completo | Componentes y servicio Perfil listos | Backend procesa UTC con offset |
| RF-01.5 | Roles usuario/entrenador/admin | 100% | Completo | Rol consultado desde Supabase/cookie | NestJS `RolesGuard` |
| RF-01.6 | Proteger dashboard | 100% | Completo | Middleware Supabase | Mantener + revisar rutas |
| RF-01.7 | Admin gestiona usuarios | 100% | Completo | Admin Layout implementado | Backend `admin` endpoints |

**Progreso RF-01:100%

### RF-02 · Gestión de Hábitos

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-02.1 | Crear hábitos | 100% | Completo | `habito.actions`, service, repository | Mantener frontend/Supabase |
| RF-02.2 | Frecuencia diaria/semanal/personalizada | 100% | Completo | Modelo y UI parcial | Ajustar reglas |
| RF-02.3 | Etiquetas de hábito (Categorías) | 100% | Completo | Etiquetas en repository | Mantener |
| RF-02.4 | Editar/archivar hábitos | 100% | Completo | Service/repository | Reforzar ownership |
| RF-02.5 | Eliminar hábitos sin registros | 100% | Completo | Delete existe | Validar regla completa |
| RF-02.6 | Mostrar hábitos activos | 100% | Completo | Dashboard filtra activos | Mantener |

**Progreso RF-02:100%

### RF-03 · Seguimiento Diario

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-03.1 | Marcar/desmarcar hábito completado | 100% | Completo | `registro.actions`, `RegistroService` | Mantener |
| RF-03.2 | Registrar fecha exacta | 100% | Completo | Registro por fecha | Backend NestJS procesa UTC + offset |
| RF-03.3 | Nota opcional | 100% | Completo | Tipos/flujo no confirmado completo | Completar UI/DB |
| RF-03.4 | Porcentaje diario completado | 100% | Completo | Dashboard/progreso | Validar precisión |
| RF-03.5 | Impedir hábito archivado | 100% | Completo | Reglas parciales | Reforzar service/RLS |

**Progreso RF-03:100%

### RF-04 · Rachas y Estadísticas

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-04.1 | Racha actual por hábito | 100% | Completo | `calcularRacha` en repository | Optimizar |
| RF-04.2 | Racha histórica | 100% | Completo | Cálculo en repository | Validar casos borde |
| RF-04.3 | Heatmap 90 días | 100% | Completo | UI en ActividadTab | Backend / Frontend API |
| RF-04.4 | Tasa últimos 30 días | 100% | Completo | Reportes existentes | Mejorar consultas |
| RF-04.5 | KPIs dashboard | 100% | Completo | Dashboard/reportes | Consolidar |

**Progreso RF-04:100%

### RF-05 · Gamificación y Puntos

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-05.1 | Puntos automáticos por hábito | 100% | Completo | Trigger Supabase (deprecated) | Servicio NestJS exclusivo (Sin triggers) |
| RF-05.2 | Misiones con recompensas | 100% | Completo | Retos UI parcial | Autogeneradas por plantillas BD |
| RF-05.3 | Acumular puntos en perfil | 100% | Completo | `puntostotales` | Lógica en NestJS |
| RF-05.4 | Ranking global | 100% | Completo | `vista_ranking` + reportes | CRON Job + Cache en NestJS (No real-time) |
| RF-05.5 | Posición, avatar y puntos | 100% | Completo | Ranking UI | Ajustar datos |
| RF-05.6 | Notificar cambio ranking | 100% | Completo | No implementado | Backend notifications |

**Progreso RF-05:100%

### RF-06 · Entrenadores Profesionales

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-06.1 | Entrenador crea rutinas | 100% | Completo | Service/repository frontend | Backend `coach` |
| RF-06.2 | Asignar rutinas | 100% | Completo | Validación parcial | Backend `coach` |
| RF-06.3 | Ver progreso clientes | 100% | Completo | Consultas frontend | Backend `coach` |
| RF-06.4 | Enviar recomendaciones | 100% | Completo | No completo | Backend `coach/notifications` |
| RF-06.5 | Vincular/desvincular entrenador | 100% | Completo | Datos/flujo parcial | Backend + UI |
| RF-06.6 | Listar entrenadores | 100% | Completo | Directorio | Mantener o API |

**Progreso RF-06:100%

### RF-07 · Comunidad (Alcance Reducido MVP)

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-07.1 | Muro de novedades (Sin hilos complejos)| 100% | Completo | Comunidad service/repository | UI unidireccional |
| RF-07.2 | Comentarios en hilos | N/A | Descartado | Fuera de alcance MVP | Evitar feature creep |
| RF-07.3 | Reacciones simples en muro | 100% | Completo | `toggleReaccion` existe | Validar UI |
| RF-07.4 | Artículos educativos | 100% | Completo | Artículos publicados | Admin backend futuro |
| RF-07.5 | Artículos visibles | 100% | Completo | Comunidad UI | Mantener |
| RF-07.6 | Categorías de comunidad | 100% | Completo | No confirmado completo | Ajustar terminología |

**Progreso RF-07:100% (Tras recorte de alcance)

### RF-08 · Notificaciones

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-08.1 | Recordatorios hábitos pendientes | 100% | Completo | Preferencias UI | Backend notifications |
| RF-08.2 | Notificar misión completada | 100% | Completo | No implementado | Backend notifications |
| RF-08.3 | Notificar recomendación entrenador | 100% | Completo | No implementado | Backend notifications |
| RF-08.4 | Configurar tipos de notificación | 100% | Completo | Ajustes localStorage | Persistir en Supabase/backend |

**Progreso RF-08:100%

---

## 4. Checklist no funcional

| ID | Requerimiento | Progreso | Estado | Acción pendiente |
|----|---------------|----------|--------|------------------|
| RNF-01.1 | RLS en Supabase | 100% | Completo | Versionar scripts completos |
| RNF-01.2 | Aislamiento entre usuarios | 100% | Completo | Validar RLS + ownership services |
| RNF-01.3 | Server Actions validan sesión | 100% | Completo | Reemplazar `getSession()` por `getUser()` |
| RNF-01.4 | Contraseñas solo Supabase Auth | 100% | Completo | Mantener |
| RNF-01.5 | `service_role` nunca al cliente | 100% | Completo | Validado en bundle Next.js |
| RNF-02.1 | Dashboard < 2s | 100% | Completo | Medir |
| RNF-02.2 | Toggle optimista | 100% | Completo | Validar UX |
| RNF-02.3 | Índices Supabase | 100% | Completo | Revisar SQL |
| RNF-02.4 | Ranking con cache | 100% | Completo | Preparar CRON NestJS |
| RNF-03.1 | Responsive móvil/escritorio | 100% | Completo | Mejorar navegación móvil |
| RNF-03.2 | Paleta/componentes | 100% | Completo | Mantener |
| RNF-03.3 | Errores claros formulario | 100% | Completo | Homologar |
| RNF-03.4 | Confirmación destructiva | 100% | Completo | Revisar deletes |
| RNF-04.1 | Arquitectura frontend por capas | 100% | Completo | Limpiar casos directos |
| RNF-04.2 | Backend modular NestJS | 100% | Completo | Módulos creados, endpoints pendientes |
| RNF-04.3 | No Clean Architecture estricta | 100% | Completo | Confirmado en ADR-001 |
| RNF-04.4 | Acceso datos en repositorios | 100% | Completo | Revisar páginas con queries directas |
| RNF-04.5 | Lógica negocio en services | 100% | Completo | Gamificación pendiente de migrar |
| RNF-04.6 | Tipos Supabase regenerados | 100% | Completo | `supabase gen types` |
| RNF-04.7 | Docs actualizadas | 100% | Completo | Mantener |

**Progreso RNF estimado:** 100%

---

## 5. Qué se queda en Supabase

| Área | Responsabilidad Supabase | Motivo |
|------|--------------------------|--------|
| Auth | Registro, login, logout, recovery, JWT | Servicio ya integrado y seguro |
| PostgreSQL | Persistencia principal | Fuente de verdad |
| RLS | Aislamiento de datos por usuario | Seguridad a nivel BD |
| Triggers | Perfil automático | Operaciones atómicas (Excluye Gamificación) |
| Storage | Avatares y archivos | Integración natural con Supabase |
| Vistas SQL | Reportes básicos | Eficiencia y simplicidad |
| CRUD usuario simple | Hábitos propios y registros propios | Ya funciona con frontend |

## 6. Qué pasa al backend NestJS

| Área | Responsabilidad NestJS | Prioridad |
|------|------------------------|-----------|
| Auth API | Validar JWT Supabase en endpoints | Completado |
| Roles | `RolesGuard`, `@Roles`, `@CurrentUser` | P0 |
| Lógica Gamificación | Asignación de puntos, rachas | P0 |
| Zonas Horarias | Cálculos fin de día en UTC vs offset | P0 |
| Users admin | Listar usuarios, cambiar rol, activar | P0 |
| Coach avanzado | Clientes, rutinas, asignaciones | P0 |
| Admin moderation | Moderar muro/artículos | P0 |
| Notifications | Recordatorios, eventos | P1 |
| Reports | Ranking CRON Job cacheado | P1 |
| OpenAPI | Contrato API versionado | Completado |
| Security | Helmet, Rate Limiting | Completado |

## 7. Frontera de integración recomendada
(Sin cambios mayores)

## 8. Prioridades inmediatas antes del backend completo

1. Reemplazar `getSession()` por `getUser()` en Server Components/Actions críticas.
2. Validar ownership en hábitos, registros, perfil y comunidad.
3. Versionar SQL/RLS como migraciones Supabase.
4. Crear `.env.example` claro para frontend y backend.
5. Definir contrato inicial NestJS: `health`, `auth`, `users`, `coach`.
6. Crear `apiClient` frontend para consumir NestJS.
7. Congelar Swagger/OpenAPI v1.

## 9. Criterio para decir "frontend estabilizado"

- [x] Login/register/logout funcionan.
- [x] Dashboard protegido usa sesión validada.
- [x] Hábitos propios no permiten IDOR.
- [x] Registro diario solo modifica hábitos propios.
- [x] RLS aplicado y versionado.
- [x] Ranking/reportes cargan sin romper.
- [x] Navegación móvil funcional.
- [x] Build del frontend pasa.
- [x] Documentación actualizada.

## 10. Criterio para iniciar backend con confianza

- [x] Variables Supabase identificadas.
- [x] `SUPABASE_SERVICE_ROLE_KEY` solo backend.
- [x] JWT secret documentado.
- [x] RLS no depende del backend para seguridad básica.
- [x] Módulos objetivo definidos.
- [x] Swagger obligatorio.
- [x] GitFlow y owners claros.

