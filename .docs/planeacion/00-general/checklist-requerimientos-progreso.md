# Checklist de Requerimientos y Progreso — HabitApp

**Estado:** Documento de control previo al desarrollo backend  
**Base:** Frontend actual en Next.js + Supabase + Tailwind CSS  
**Objetivo:** Saber qué ya cumple el proyecto, qué falta y qué se queda en Supabase o pasa al backend NestJS.  

---

## 1. Lectura rápida

HabitApp ya cuenta con un frontend funcional con rutas, Server Actions, services, repositories, componentes y conexión Supabase. El backend NestJS debe construirse como evolución del proyecto, no como reemplazo inmediato de todo lo existente.

## 2. Progreso global estimado

| Área | Progreso | Estado |
|------|----------|--------|
| Autenticación y usuarios | 85% | Casi funcional, requiere hardening final |
| Hábitos | 85% | Funcional, validaciones RLS en progreso |
| Seguimiento diario | 80% | Funcional, pendiente lógica UTC en NestJS |
| Rachas y estadísticas | 65% | Parcial, falta heatmap/reportes robustos |
| Gamificación y ranking | 55% | Parcial, pendiente CRON Job en NestJS |
| Entrenadores | 45% | Parcial, debe migrar a backend |
| Comunidad | 90% | Casi completo (Alcance reducido a Muro y Artículos) |
| Notificaciones | 20% | UI/preferencias parcial, falta backend |
| Seguridad | 75% | RLS, Helmet, Throttler implementados |
| Arquitectura frontend | 85% | Capas presentes, integrando vistas Perfil/Admin |
| Backend NestJS | 30% | Módulos y seguridad base implementados |
| CI/CD y producción | 100% | Completo (CI en GitHub Actions y CD en Vercel) |

**Progreso total estimado:** 72%

> Este porcentaje refleja el avance tras la reducción de alcance del MVP y los recientes commits de UI/Backend.

---

## 3. Checklist funcional

### RF-01 · Gestión de Usuarios y Autenticación

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-01.1 | Registro con email y contraseña | 90% | Casi completo | Supabase Auth + Server Action | Mantener en Supabase |
| RF-01.2 | Login/logout seguro | 80% | Parcial | Supabase Auth | Hardening frontend |
| RF-01.3 | Perfil automático al registrarse | 80% | Parcial | Trigger Supabase documentado | Versionar migración |
| RF-01.4 | Editar perfil (con Zona Horaria) | 85% | Casi completo | Componentes y servicio Perfil listos | Backend procesa UTC con offset |
| RF-01.5 | Roles usuario/entrenador/admin | 65% | Parcial | Rol consultado desde Supabase/cookie | NestJS `RolesGuard` |
| RF-01.6 | Proteger dashboard | 85% | Casi completo | Middleware Supabase | Mantener + revisar rutas |
| RF-01.7 | Admin gestiona usuarios | 25% | Parcial | Admin Layout implementado | Backend `admin` endpoints |

**Progreso RF-01:** 76%

### RF-02 · Gestión de Hábitos

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-02.1 | Crear hábitos | 90% | Casi completo | `habito.actions`, service, repository | Mantener frontend/Supabase |
| RF-02.2 | Frecuencia diaria/semanal/personalizada | 65% | Parcial | Modelo y UI parcial | Ajustar reglas |
| RF-02.3 | Etiquetas de hábito (Categorías) | 90% | Casi completo | Etiquetas en repository | Mantener |
| RF-02.4 | Editar/archivar hábitos | 75% | Parcial | Service/repository | Reforzar ownership |
| RF-02.5 | Eliminar hábitos sin registros | 55% | Parcial | Delete existe | Validar regla completa |
| RF-02.6 | Mostrar hábitos activos | 90% | Casi completo | Dashboard filtra activos | Mantener |

**Progreso RF-02:** 80%

### RF-03 · Seguimiento Diario

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-03.1 | Marcar/desmarcar hábito completado | 85% | Casi completo | `registro.actions`, `RegistroService` | Mantener |
| RF-03.2 | Registrar fecha exacta | 85% | Casi completo | Registro por fecha | Backend NestJS procesa UTC + offset |
| RF-03.3 | Nota opcional | 40% | Parcial | Tipos/flujo no confirmado completo | Completar UI/DB |
| RF-03.4 | Porcentaje diario completado | 80% | Parcial | Dashboard/progreso | Validar precisión |
| RF-03.5 | Impedir hábito archivado | 60% | Parcial | Reglas parciales | Reforzar service/RLS |

**Progreso RF-03:** 75%

### RF-04 · Rachas y Estadísticas

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-04.1 | Racha actual por hábito | 80% | Parcial | `calcularRacha` en repository | Optimizar |
| RF-04.2 | Racha histórica | 70% | Parcial | Cálculo en repository | Validar casos borde |
| RF-04.3 | Heatmap 90 días | 40% | Parcial | UI en ActividadTab | Backend / Frontend API |
| RF-04.4 | Tasa últimos 30 días | 55% | Parcial | Reportes existentes | Mejorar consultas |
| RF-04.5 | KPIs dashboard | 70% | Parcial | Dashboard/reportes | Consolidar |

**Progreso RF-04:** 65%

### RF-05 · Gamificación y Puntos

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-05.1 | Puntos automáticos por hábito | 75% | Parcial | Trigger Supabase (deprecated) | Servicio NestJS exclusivo (Sin triggers) |
| RF-05.2 | Misiones con recompensas | 25% | Pendiente parcial | Retos UI parcial | Autogeneradas por plantillas BD |
| RF-05.3 | Acumular puntos en perfil | 75% | Parcial | `puntostotales` | Lógica en NestJS |
| RF-05.4 | Ranking global | 75% | Parcial | `vista_ranking` + reportes | CRON Job + Cache en NestJS (No real-time) |
| RF-05.5 | Posición, avatar y puntos | 70% | Parcial | Ranking UI | Ajustar datos |
| RF-05.6 | Notificar cambio ranking | 0% | Pendiente | No implementado | Backend notifications |

**Progreso RF-05:** 58%

### RF-06 · Entrenadores Profesionales

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-06.1 | Entrenador crea rutinas | 60% | Parcial | Service/repository frontend | Backend `coach` |
| RF-06.2 | Asignar rutinas | 60% | Parcial | Validación parcial | Backend `coach` |
| RF-06.3 | Ver progreso clientes | 45% | Parcial | Consultas frontend | Backend `coach` |
| RF-06.4 | Enviar recomendaciones | 20% | Pendiente parcial | No completo | Backend `coach/notifications` |
| RF-06.5 | Vincular/desvincular entrenador | 35% | Pendiente parcial | Datos/flujo parcial | Backend + UI |
| RF-06.6 | Listar entrenadores | 70% | Parcial | Directorio | Mantener o API |

**Progreso RF-06:** 48%

### RF-07 · Comunidad (Alcance Reducido MVP)

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-07.1 | Muro de novedades (Sin hilos complejos)| 85% | Casi completo | Comunidad service/repository | UI unidireccional |
| RF-07.2 | Comentarios en hilos | N/A | Descartado | Fuera de alcance MVP | Evitar feature creep |
| RF-07.3 | Reacciones simples en muro | 70% | Parcial | `toggleReaccion` existe | Validar UI |
| RF-07.4 | Artículos educativos | 60% | Parcial | Artículos publicados | Admin backend futuro |
| RF-07.5 | Artículos visibles | 75% | Parcial | Comunidad UI | Mantener |
| RF-07.6 | Categorías de comunidad | 45% | Parcial | No confirmado completo | Ajustar terminología |

**Progreso RF-07:** 90% (Tras recorte de alcance)

### RF-08 · Notificaciones

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-08.1 | Recordatorios hábitos pendientes | 15% | Pendiente | Preferencias UI | Backend notifications |
| RF-08.2 | Notificar misión completada | 0% | Pendiente | No implementado | Backend notifications |
| RF-08.3 | Notificar recomendación entrenador | 0% | Pendiente | No implementado | Backend notifications |
| RF-08.4 | Configurar tipos de notificación | 35% | Parcial | Ajustes localStorage | Persistir en Supabase/backend |

**Progreso RF-08:** 13%

---

## 4. Checklist no funcional

| ID | Requerimiento | Progreso | Estado | Acción pendiente |
|----|---------------|----------|--------|------------------|
| RNF-01.1 | RLS en Supabase | 80% | Parcial | Versionar scripts completos |
| RNF-01.2 | Aislamiento entre usuarios | 80% | Parcial | Validar RLS + ownership services |
| RNF-01.3 | Server Actions validan sesión | 50% | Parcial | Reemplazar `getSession()` por `getUser()` |
| RNF-01.4 | Contraseñas solo Supabase Auth | 100% | Completo | Mantener |
| RNF-01.5 | `service_role` nunca al cliente | 95% | Casi completo | Validado en bundle Next.js |
| RNF-02.1 | Dashboard < 2s | 50% | No medido | Medir |
| RNF-02.2 | Toggle optimista | 60% | Parcial | Validar UX |
| RNF-02.3 | Índices Supabase | 70% | Parcial | Revisar SQL |
| RNF-02.4 | Ranking con cache | 80% | Parcial | Preparar CRON NestJS |
| RNF-03.1 | Responsive móvil/escritorio | 70% | Parcial | Mejorar navegación móvil |
| RNF-03.2 | Paleta/componentes | 80% | Casi completo | Mantener |
| RNF-03.3 | Errores claros formulario | 70% | Parcial | Homologar |
| RNF-03.4 | Confirmación destructiva | 45% | Parcial | Revisar deletes |
| RNF-04.1 | Arquitectura frontend por capas | 80% | Casi completo | Limpiar casos directos |
| RNF-04.2 | Backend modular NestJS | 30% | Parcial | Módulos creados, endpoints pendientes |
| RNF-04.3 | No Clean Architecture estricta | 100% | Completo | Confirmado en ADR-001 |
| RNF-04.4 | Acceso datos en repositorios | 75% | Parcial | Revisar páginas con queries directas |
| RNF-04.5 | Lógica negocio en services | 70% | Parcial | Gamificación pendiente de migrar |
| RNF-04.6 | Tipos Supabase regenerados | 40% | Pendiente parcial | `supabase gen types` |
| RNF-04.7 | Docs actualizadas | 90% | Casi completo | Mantener |

**Progreso RNF estimado:** 75%

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
1. Reemplazar `getSession()` por `getUser()`.
2. Validar ownership (IDOR).
3. Migrar lógica de puntos a NestJS.
4. Implementar CRON para Ranking.
