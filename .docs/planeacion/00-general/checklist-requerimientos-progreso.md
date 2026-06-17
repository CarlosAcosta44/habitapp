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
| Autenticación y usuarios | 75% | Funcional, requiere hardening |
| Hábitos | 80% | Funcional, requiere ownership fuerte |
| Seguimiento diario | 75% | Funcional, requiere validaciones finales |
| Rachas y estadísticas | 60% | Parcial, falta heatmap/reportes robustos |
| Gamificación y ranking | 55% | Parcial, falta misiones/notificaciones |
| Entrenadores | 45% | Parcial, debe migrar a backend |
| Comunidad | 65% | Parcial funcional |
| Notificaciones | 20% | UI/preferencias parcial, falta backend |
| Seguridad | 55% | Supabase Auth existe, falta RLS/migraciones/hardening |
| Arquitectura frontend | 75% | Capas presentes, requiere limpieza |
| Backend NestJS | 15% | Planificado/iniciado, falta implementación completa |
| CI/CD y producción | 100% | Completo (CI en GitHub Actions y CD en Vercel) |

**Progreso total estimado:** 55%

> Este porcentaje es de planificación. No reemplaza pruebas funcionales ni auditoría técnica.

---

## 3. Checklist funcional

### RF-01 · Gestión de Usuarios y Autenticación

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-01.1 | Registro con email y contraseña | 90% | Casi completo | Supabase Auth + Server Action | Mantener en Supabase |
| RF-01.2 | Login/logout seguro | 80% | Parcial | Supabase Auth | Hardening frontend |
| RF-01.3 | Perfil automático al registrarse | 80% | Parcial | Trigger Supabase documentado | Versionar migración |
| RF-01.4 | Editar perfil | 60% | Parcial | Página perfil existente | Mejorar service/validación |
| RF-01.5 | Roles usuario/entrenador/admin | 65% | Parcial | Rol consultado desde Supabase/cookie | NestJS `RolesGuard` |
| RF-01.6 | Proteger dashboard | 85% | Casi completo | Middleware Supabase | Mantener + revisar rutas |
| RF-01.7 | Admin gestiona usuarios | 10% | Pendiente | No completo | Backend `admin` |

**Progreso RF-01:** 67%

### RF-02 · Gestión de Hábitos

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-02.1 | Crear hábitos | 90% | Casi completo | `habito.actions`, service, repository | Mantener frontend/Supabase |
| RF-02.2 | Frecuencia diaria/semanal/personalizada | 65% | Parcial | Modelo y UI parcial | Ajustar reglas |
| RF-02.3 | Categoría de hábito | 90% | Casi completo | Categorías en repository | Mantener |
| RF-02.4 | Editar/archivar hábitos | 75% | Parcial | Service/repository | Reforzar ownership |
| RF-02.5 | Eliminar hábitos sin registros | 55% | Parcial | Delete existe | Validar regla completa |
| RF-02.6 | Mostrar hábitos activos | 90% | Casi completo | Dashboard filtra activos | Mantener |

**Progreso RF-02:** 78%

### RF-03 · Seguimiento Diario

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-03.1 | Marcar/desmarcar hábito completado | 85% | Casi completo | `registro.actions`, `RegistroService` | Mantener |
| RF-03.2 | Registrar fecha exacta | 85% | Casi completo | Registro por fecha | Mantener |
| RF-03.3 | Nota opcional | 40% | Parcial | Tipos/flujo no confirmado completo | Completar UI/DB |
| RF-03.4 | Porcentaje diario completado | 80% | Parcial | Dashboard/progreso | Validar precisión |
| RF-03.5 | Impedir hábito archivado | 60% | Parcial | Reglas parciales | Reforzar service/RLS |

**Progreso RF-03:** 70%

### RF-04 · Rachas y Estadísticas

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-04.1 | Racha actual por hábito | 80% | Parcial | `calcularRacha` en repository | Optimizar |
| RF-04.2 | Racha histórica | 70% | Parcial | Cálculo en repository | Validar casos borde |
| RF-04.3 | Heatmap 90 días | 35% | Pendiente parcial | No confirmado completo | Frontend/reportes |
| RF-04.4 | Tasa últimos 30 días | 55% | Parcial | Reportes existentes | Mejorar consultas |
| RF-04.5 | KPIs dashboard | 70% | Parcial | Dashboard/reportes | Consolidar |

**Progreso RF-04:** 62%

### RF-05 · Gamificación y Puntos

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-05.1 | Puntos automáticos por hábito | 75% | Parcial | Trigger/script Supabase | Versionar migración |
| RF-05.2 | Misiones con recompensas | 25% | Pendiente parcial | Retos UI parcial | Backend o Supabase |
| RF-05.3 | Acumular puntos en perfil | 75% | Parcial | `puntostotales` | Mantener Supabase |
| RF-05.4 | Ranking global | 75% | Parcial | `vista_ranking` + reportes | Cache backend |
| RF-05.5 | Posición, avatar y puntos | 70% | Parcial | Ranking UI | Ajustar datos |
| RF-05.6 | Notificar cambio ranking | 0% | Pendiente | No implementado | Backend notifications |

**Progreso RF-05:** 53%

### RF-06 · Entrenadores Profesionales

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-06.1 | Entrenador crea rutinas | 60% | Parcial | Service/repository frontend | Backend `coach` |
| RF-06.2 | Asignar rutinas | 60% | Parcial | Validación parcial | Backend `coach` |
| RF-06.3 | Ver progreso clientes | 45% | Parcial | Consultas frontend | Backend `coach` |
| RF-06.4 | Enviar recomendaciones | 20% | Pendiente parcial | No completo | Backend `coach/notifications` |
| RF-06.5 | Vincular/desvincular entrenador | 35% | Pendiente parcial | Datos/flujo parcial | Backend + UI |
| RF-06.6 | Listar entrenadores | 70% | Parcial | Comunidad/directorio | Mantener o API |

**Progreso RF-06:** 48%

### RF-07 · Comunidad

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-07.1 | Crear hilos de foro | 60% | Parcial | Comunidad service/repository | Completar UI/reglas |
| RF-07.2 | Comentarios en hilos | 75% | Parcial | `comentar` existe | Validar rutas |
| RF-07.3 | Reacciones | 70% | Parcial | `toggleReaccion` existe | Validar UI |
| RF-07.4 | Artículos educativos | 60% | Parcial | Artículos publicados | Admin backend futuro |
| RF-07.5 | Artículos visibles | 75% | Parcial | Comunidad UI | Mantener |
| RF-07.6 | Categoría y búsqueda | 45% | Parcial | No confirmado completo | Completar frontend |

**Progreso RF-07:** 64%

### RF-08 · Notificaciones

| ID | Requerimiento | Progreso | Estado | Actualmente | Futuro |
|----|---------------|----------|--------|-------------|--------|
| RF-08.1 | Recordatorios hábitos pendientes | 15% | Pendiente | Preferencias UI/localStorage | Backend notifications |
| RF-08.2 | Notificar misión completada | 0% | Pendiente | No implementado | Backend notifications |
| RF-08.3 | Notificar recomendación entrenador | 0% | Pendiente | No implementado | Backend notifications |
| RF-08.4 | Configurar tipos de notificación | 35% | Parcial | Ajustes localStorage | Persistir en Supabase/backend |

**Progreso RF-08:** 13%

---

## 4. Checklist no funcional

| ID | Requerimiento | Progreso | Estado | Acción pendiente |
|----|---------------|----------|--------|------------------|
| RNF-01.1 | RLS en Supabase | 55% | Parcial | Versionar scripts como migraciones |
| RNF-01.2 | Aislamiento entre usuarios | 55% | Parcial | Validar RLS + ownership services |
| RNF-01.3 | Server Actions validan sesión | 50% | Parcial | Reemplazar `getSession()` por `getUser()` donde aplique |
| RNF-01.4 | Contraseñas solo Supabase Auth | 100% | Completo | Mantener |
| RNF-01.5 | `service_role` nunca al cliente | 85% | Casi completo | Mantener solo backend |
| RNF-02.1 | Dashboard < 2s | 50% | No medido | Medir |
| RNF-02.2 | Toggle optimista | 60% | Parcial | Validar UX |
| RNF-02.3 | Índices Supabase | 70% | Parcial | Revisar SQL |
| RNF-02.4 | Ranking con cache/vista | 60% | Parcial | Vista existe; cache backend futuro |
| RNF-03.1 | Responsive móvil/escritorio | 70% | Parcial | Mejorar navegación móvil |
| RNF-03.2 | Paleta/componentes | 80% | Casi completo | Mantener |
| RNF-03.3 | Errores claros formulario | 70% | Parcial | Homologar |
| RNF-03.4 | Confirmación destructiva | 45% | Parcial | Revisar deletes |
| RNF-04.1 | Arquitectura frontend por capas | 80% | Casi completo | Limpiar casos directos |
| RNF-04.2 | Backend modular NestJS | 15% | Pendiente | Construir |
| RNF-04.3 | No Clean Architecture estricta | 100% | Completo | Mantener decisión |
| RNF-04.4 | Acceso datos en repositorios | 75% | Parcial | Revisar páginas con queries directas |
| RNF-04.5 | Lógica negocio en services | 70% | Parcial | Extraer lógica de páginas |
| RNF-04.6 | Tipos Supabase regenerados | 40% | Pendiente parcial | `supabase gen types` |
| RNF-04.7 | Docs actualizadas | 85% | Casi completo | Mantener |

**Progreso RNF estimado:** 65%

---

## 5. Qué se queda en Supabase

| Área | Responsabilidad Supabase | Motivo |
|------|--------------------------|--------|
| Auth | Registro, login, logout, recovery, JWT | Servicio ya integrado y seguro |
| PostgreSQL | Persistencia principal | Fuente de verdad |
| RLS | Aislamiento de datos por usuario | Seguridad a nivel BD |
| Triggers | Perfil automático, puntos, operaciones atómicas | Consistencia transaccional |
| Storage | Avatares y archivos | Integración natural con Supabase |
| Vistas SQL | Ranking/reportes básicos | Eficiencia y simplicidad |
| CRUD usuario simple | Hábitos propios y registros propios | Ya funciona con frontend |

## 6. Qué pasa al backend NestJS

| Área | Responsabilidad NestJS | Prioridad |
|------|------------------------|-----------|
| Auth API | Validar JWT Supabase en endpoints | P0 |
| Roles | `RolesGuard`, `@Roles`, `@CurrentUser` | P0 |
| Supabase service role | Operaciones privilegiadas server-side | P0 |
| Users admin | Listar usuarios, cambiar rol, activar/desactivar | P0 |
| Coach avanzado | Clientes, rutinas, asignaciones, progreso | P0 |
| Admin moderation | Moderar foros/comentarios/artículos | P0 |
| Notifications | Recordatorios, eventos, email/push futuro | P1 |
| Reports | Ranking cacheado, resumen usuario | P1 |
| OpenAPI | Contrato API versionado | P0 |
| Rate limiting/security headers | Protección API | P0 producción |

## 7. Frontera de integración recomendada

| Flujo | Ahora | Después |
|-------|------|---------|
| Login/register/logout | Supabase desde frontend | Se mantiene |
| CRUD hábitos propios | Frontend + Supabase + RLS | Se mantiene inicialmente |
| Registro diario | Frontend + Supabase + RLS | Se mantiene inicialmente |
| Perfil básico | Frontend + Supabase | Mejorar service; backend si requiere admin |
| Ranking | Frontend consulta vista | Backend con cache |
| Admin usuarios | Pendiente/parcial | Backend NestJS |
| Entrenador rutinas | Frontend parcial | Backend NestJS |
| Notificaciones | Local/UI parcial | Backend NestJS |
| Moderación comunidad | Parcial | Backend NestJS |

## 8. Prioridades inmediatas antes del backend completo

1. Reemplazar `getSession()` por `getUser()` en Server Components/Actions críticas.
2. Validar ownership en hábitos, registros, perfil y comunidad.
3. Versionar SQL/RLS como migraciones Supabase.
4. Crear `.env.example` claro para frontend y backend.
5. Definir contrato inicial NestJS: `health`, `auth`, `users`, `coach`.
6. Crear `apiClient` frontend para consumir NestJS.
7. Congelar Swagger/OpenAPI v1.

## 9. Criterio para decir "frontend estabilizado"

- [ ] Login/register/logout funcionan.
- [ ] Dashboard protegido usa sesión validada.
- [ ] Hábitos propios no permiten IDOR.
- [ ] Registro diario solo modifica hábitos propios.
- [ ] RLS aplicado y versionado.
- [ ] Ranking/reportes cargan sin romper.
- [ ] Navegación móvil funcional.
- [ ] Build del frontend pasa.
- [ ] Documentación actualizada.

## 10. Criterio para iniciar backend con confianza

- [ ] Variables Supabase identificadas.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo backend.
- [ ] JWT secret documentado.
- [ ] RLS no depende del backend para seguridad básica.
- [ ] Módulos objetivo definidos.
- [ ] Swagger obligatorio.
- [ ] GitFlow y owners claros.

