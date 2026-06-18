# Formato de Control QA y Testing — HabitApp

Este documento contiene las 5 tablas exactas correspondientes a las hojas de tu archivo Excel. Cubre los 30 requerimientos más críticos de la fase actual (MVP y Backend NestJS).

---

## 1. Hoja: Requerimientos y Progreso

| ID | Tipo | Módulo | Requerimiento | Prioridad | Estado | Progreso % | Responsable | Capa Técnica |
|---|---|---|---|---|---|---|---|---|
| RF-01.1 | Funcional | Autenticación | Registro seguro con email y contraseña | Alta | Casi completo | 90% | Breiner | Supabase Auth + Server Action |
| RF-01.2 | Funcional | Autenticación | Login y logout seguro con validación JWT | Alta | Parcial | 80% | Breiner | Supabase Auth + Header |
| RF-01.3 | Funcional | Autenticación | Perfil automático al registrarse (trigger) | Alta | Casi completo | 80% | Carlos | Supabase Trigger SQL |
| RF-01.4 | Funcional | Usuarios | Editar perfil (nombre, avatar, zona horaria) | Media | Casi completo | 85% | Nicolás | Frontend UI + Server Action |
| RF-01.5 | Funcional | Usuarios | Roles de sistema: Usuario, Entrenador, Admin | Alta | Parcial | 65% | Carlos | NestJS RolesGuard |
| RF-01.6 | Funcional | Autenticación | Middleware protección rutas de dashboard | Alta | Casi completo | 85% | Breiner | Next.js Middleware |
| RF-01.7 | Funcional | Admin | Panel para activar/desactivar usuarios | Media | Parcial | 25% | Juan | NestJS AdminModule |
| RF-02.1 | Funcional | Hábitos | Crear hábitos con nombre, color y frecuencia | Alta | Casi completo | 90% | Nicolás | Next.js Server Action |
| RF-02.2 | Funcional | Hábitos | Frecuencia de hábitos (diaria, semanal) | Media | Parcial | 65% | Nicolás | Lógica de validación frontend |
| RF-02.3 | Funcional | Hábitos | Asignar etiquetas personalizadas a hábitos | Baja | Casi completo | 90% | Nicolás | Supabase Repository |
| RF-02.4 | Funcional | Hábitos | Editar y archivar hábitos existentes | Alta | Parcial | 75% | Nicolás | Service + Validación Ownership |
| RF-02.5 | Funcional | Hábitos | Eliminar hábitos sin registros diarios | Media | Parcial | 55% | Nicolás | Service (condición count = 0) |
| RF-02.6 | Funcional | Hábitos | Filtrar y mostrar solo hábitos activos | Alta | Casi completo | 90% | Nicolás | Consulta filtrada Supabase |
| RF-03.1 | Funcional | Seguimiento | Marcar hábito completado o desmarcarlo | Alta | Casi completo | 85% | Nicolás | RegistroService + UI |
| RF-03.2 | Funcional | Seguimiento | Registrar fecha exacta (offset cliente a UTC) | Alta | Parcial | 85% | Carlos | Backend NestJS Date parsing |
| RF-03.4 | Funcional | Seguimiento | Porcentaje de hábitos completados del día | Media | Parcial | 80% | Nicolás | Dashboard cálculo |
| RF-04.1 | Funcional | Estadísticas | Calcular racha actual (consecutiva) | Alta | Parcial | 80% | Nicolás | Lógica de cálculo NestJS |
| RF-04.2 | Funcional | Estadísticas | Registrar racha histórica máxima | Media | Parcial | 70% | Nicolás | Repository + Casos borde |
| RF-04.3 | Funcional | Estadísticas | Heatmap de actividad (últimos 90 días) | Baja | Parcial | 40% | Nicolás | UI Component + Backend query |
| RF-05.1 | Funcional | Gamificación | Asignar puntos al completar hábito | Alta | Parcial | 55% | Carlos | Servicio Gamificación NestJS |
| RF-05.2 | Funcional | Gamificación | Misiones autogeneradas por plantillas | Media | Pendiente | 25% | Juan | Cron/Template Engine NestJS |
| RF-05.3 | Funcional | Gamificación | Acumular puntos totales en el perfil | Alta | Parcial | 75% | Carlos | NestJS PointsService |
| RF-05.4 | Funcional | Ranking | Ranking global ordenado por puntos | Alta | Parcial | 50% | Carlos | CRON Job + Redis Cache NestJS |
| RF-06.1 | Funcional | Entrenador | Crear rutinas personalizadas de hábitos | Alta | Parcial | 60% | Juan | Frontend + Backend CoachModule |
| RF-07.1 | Funcional | Comunidad | Muro de novedades unidireccional | Media | Casi completo | 85% | Juan | UI + Repository |
| RF-08.1 | Funcional | Notific. | Preferencias de recordatorios de hábitos | Baja | Pendiente | 15% | Nicolás | LocalStorage / NestJS |
| RNF-01.1| No Funcional| Seguridad | Row Level Security (RLS) en Supabase | Alta | Parcial | 80% | Carlos | Supabase SQL Policies |
| RNF-01.3| No Funcional| Seguridad | Validar sesión (`getUser()`) en mutations | Alta | Parcial | 50% | Breiner | Next.js Server Actions |
| RNF-01.5| No Funcional| Seguridad | `service_role` oculto en cliente | Alta | Casi completo | 95% | Carlos | Revisión de variables Next.js |
| RNF-04.2| No Funcional| Arquitectura| Backend Modular NestJS funcional | Alta | Parcial | 30% | Carlos | Controladores y Servicios API |

---

## 2. Hoja: Test Cases (Casos de Prueba)

| Test Case ID | Módulo | Req. Asociado | Objetivo | Precondiciones | Datos de Prueba | Pasos | Resultado Esperado | Resultado Obtenido | Estado | Tester | Fecha | Evidencia |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Autenticación | RF-01.1 | Validar registro exitoso. | Ninguna | email: nuevo@test.com, pass: 123456 | 1. Llenar form. 2. Clic en registrar. | Redirige a dashboard, perfil creado en BD. | (Vacio) | Pendiente | Breiner | | |
| TC-002 | Autenticación | RF-01.2 | Validar login. | Usuario existe en BD | email: test@test.com, pass: 123456 | 1. Ingresar datos. 2. Iniciar sesión. | JWT asignado, acceso al dashboard. | (Vacio) | Pendiente | Juan | | |
| TC-003 | Autenticación | RF-01.6 | Middleware protege rutas. | Sin sesión iniciada | N/A | 1. Navegar a `/dashboard`. | Redirección inmediata a `/login`. | (Vacio) | Pendiente | Nicolás | | |
| TC-004 | Usuarios | RF-01.4 | Actualizar perfil. | Sesión iniciada | Nombre: "Carlos", Zona: "UTC-5" | 1. Ir a perfil. 2. Editar. 3. Guardar. | Nombre cambia en UI y en public.user_profiles. | (Vacio) | Pendiente | Carlos | | |
| TC-005 | Usuarios | RF-01.5 | Validar RolesGuard. | JWT de Usuario | N/A | 1. Hacer petición GET a `/api/admin`. | Backend rechaza con HTTP 403 Forbidden. | (Vacio) | Pendiente | Juan | | |
| TC-006 | Hábitos | RF-02.1 | Crear hábito nuevo. | Sesión iniciada | Hábito: "Leer", Etiqueta: "Salud" | 1. Llenar modal. 2. Guardar. | Hábito visible en la lista del día. | (Vacio) | Pendiente | Nicolás | | |
| TC-007 | Hábitos | RF-02.4 | Bloquear edición IDOR. | Sesión de Usuario A | UUID de hábito de Usuario B | 1. Intentar PATCH a hábito B. | Error de validación de propiedad (HTTP 401/403). | (Vacio) | Pendiente | Carlos | | |
| TC-008 | Seguimiento | RF-03.1 | Marcar completado. | Hábito activo | N/A | 1. Clic en checkbox del hábito. | Icono cambia, se inserta registro en `habit_records`. | (Vacio) | Pendiente | Nicolás | | |
| TC-009 | Seguimiento | RF-03.2 | Fin de día UTC. | Cliente en UTC-5 | Hora: 23:50 UTC-5 | 1. Completar hábito. 2. Revisar BD. | Backend registra la fecha alineada al día local del usuario. | (Vacio) | Pendiente | Carlos | | |
| TC-010 | Gamificación | RF-05.1 | Otorgar puntos. | Hábito completado | N/A | 1. Validar endpoint de completar. | Perfil suma puntos mediante lógica de NestJS. | (Vacio) | Pendiente | Carlos | | |
| TC-011 | Ranking | RF-05.4 | CRON Ranking. | Puntos modificados | N/A | 1. Forzar ejecución CRON. 2. Ver `/ranking`. | Cache se renueva, usuario cambia de posición. | (Vacio) | Pendiente | Juan | | |
| TC-012 | Comunidad | RF-07.1 | Cargar Muro. | Hay artículos | N/A | 1. Navegar a comunidad. | Se ven los últimos artículos ordenados por fecha. | (Vacio) | Pendiente | Breiner | | |
| TC-013 | Seguridad | RNF-01.1 | RLS Aislamiento. | 2 Usuarios | Token de UserA | 1. REST GET `habits` sin filtro. | Sólo devuelve los hábitos pertenecientes a UserA. | (Vacio) | Pendiente | Carlos | | |
| TC-014 | Arquitectura | RNF-04.2 | Health Check NestJS. | Backend corriendo | N/A | 1. GET `/api/v1/health`. | Retorna `{ "status": "ok" }`. | (Vacio) | Pendiente | Breiner | | |
| TC-015 | Autenticación | RF-01.2 | Logout efectivo. | Sesión iniciada | N/A | 1. Clic en Logout. 2. Ir atrás. | Cookie eliminada, middleware bloquea el regreso. | (Vacio) | Pendiente | Juan | | |
| TC-016 | Admin | RF-01.7 | Bloquear usuario. | Sesión de Admin | UUID usuario normal | 1. Panel admin. 2. Desactivar. | El usuario bloqueado no puede acceder a `/dashboard`. | (Vacio) | Pendiente | Nicolás | | |
| TC-017 | Hábitos | RF-02.5 | Eliminar hábito limpio. | Hábito sin registros | N/A | 1. Clic en eliminar. | Hábito borrado físicamente de la base de datos. | (Vacio) | Pendiente | Breiner | | |
| TC-018 | Hábitos | RF-02.4 | Archivar hábito viejo. | Hábito con registros | N/A | 1. Clic en archivar. | Estado pasa a archivado, registros se mantienen intactos. | (Vacio) | Pendiente | Juan | | |
| TC-019 | Seguimiento | RF-03.4 | Progreso diario UI. | 4 hábitos activos | 2 completados | 1. Ver barra progreso. | La barra muestra 50%. | (Vacio) | Pendiente | Nicolás | | |
| TC-020 | Estadísticas | RF-04.1 | Incrementar racha. | Racha actual: 2 | Completar hoy | 1. Completar hábito. | Racha en UI sube a 3 inmediatamente. | (Vacio) | Pendiente | Carlos | | |
| TC-021 | Gamificación | RF-05.2 | Cumplir misión. | Misión: 3 días seguidos | Cumplir 3 días | 1. Llegar a la meta. | Sistema otorga recompensa extra y genera notificación. | (Vacio) | Pendiente | Juan | | |
| TC-022 | Coach | RF-06.1 | Coach crea rutina. | Sesión de Entrenador | Nombre: "Básica" | 1. Formulario rutinas. | Rutina creada y asociada al coach_id. | (Vacio) | Pendiente | Breiner | | |
| TC-023 | Notificaciones| RF-08.1 | Toggle recordatorios. | N/A | N/A | 1. Preferencias -> Desactivar. | Preferencia guardada (localStorage o BD). | (Vacio) | Pendiente | Nicolás | | |
| TC-024 | Seguridad | RNF-01.3 | Error sesión inválida. | Token caducado | N/A | 1. Ejecutar Server Action. | Server action detecta sesión nula y lanza error controlado. | (Vacio) | Pendiente | Carlos | | |
| TC-025 | Hábitos | RF-02.2 | Validación frecuencia. | Frecuencia Semanal | Días: L-X-V | 1. Crear hábito. | El sistema exige marcar los días a la semana correctos. | (Vacio) | Pendiente | Juan | | |
| TC-026 | Hábitos | RF-02.6 | Filtro hábitos activos. | 1 activo, 1 archivado | N/A | 1. Ver vista "Hoy". | Sólo se muestra el hábito activo. | (Vacio) | Pendiente | Breiner | | |
| TC-027 | Estadísticas | RF-04.3 | Cargar Heatmap. | Registros pasados | N/A | 1. Ver detalle de hábito. | Cuadrícula de 90 días coloreada según cumplimiento. | (Vacio) | Pendiente | Nicolás | | |
| TC-028 | Gamificación | RF-05.3 | Lógica de puntos API. | N/A | N/A | 1. POST API gamificación. | Payload protegido, suma matemática correcta en `user_points`. | (Vacio) | Pendiente | Carlos | | |
| TC-029 | Admin | RF-01.7 | Cambio rol masivo. | Sesión Admin | N/A | 1. PATCH `/api/admin/roles`. | Roles actualizados correctamente para lista de IDs. | (Vacio) | Pendiente | Juan | | |
| TC-030 | Seguridad | RNF-01.5 | Revisar `.env` leak. | App desplegada | N/A | 1. Revisar tab "Network". | Las peticiones al backend NO muestran la key privada. | (Vacio) | Pendiente | Breiner | | |

---

## 3. Hoja: Trazabilidad

| Requerimiento | Caso de Prueba | Estado | Módulo | Observaciones |
|---|---|---|---|---|
| RF-01.1 | TC-001 | Pendiente | Autenticación | Validar redirección automática al dashboard. |
| RF-01.2 | TC-002, TC-015 | Pendiente | Autenticación | Logout debe limpiar la cookie httponly. |
| RF-01.6 | TC-003 | Pendiente | Autenticación | Revisar matcher del middleware en `middleware.ts`. |
| RF-01.4 | TC-004 | Pendiente | Usuarios | Confirmar que el form tiene validación Zod. |
| RF-01.5 | TC-005 | Pendiente | Usuarios | Depende del RolesGuard en NestJS. |
| RF-02.1 | TC-006 | Pendiente | Hábitos | Server action ya integrado. Faltan pruebas. |
| RF-02.4 | TC-007, TC-018 | Pendiente | Hábitos | Crucial validar IDOR para evitar exposición. |
| RF-03.1 | TC-008 | Pendiente | Seguimiento | El servicio debe manejar la concurrencia. |
| RF-03.2 | TC-009 | Pendiente | Seguimiento | El offset del cliente es esencial aquí. |
| RF-05.1 | TC-010 | Pendiente | Gamificación | Sin triggers, revisar latencia API. |
| RF-05.4 | TC-011 | Pendiente | Ranking | CRON no debe ejecutarse más de 1 vez por hora. |
| RF-07.1 | TC-012 | Pendiente | Comunidad | Carga perezosa (lazy load) para el muro. |
| RNF-01.1 | TC-013 | Pendiente | Seguridad | Revisar políticas `SELECT`, `INSERT`, `UPDATE` en Supabase. |
| RNF-04.2 | TC-014 | Pendiente | Arquitectura | Endpoint base para monitorización Vercel. |
| RF-01.7 | TC-016, TC-029 | Pendiente | Admin | Rutas protegidas exclusivamente para admin. |
| RF-02.5 | TC-017 | Pendiente | Hábitos | Verificar restricción de clave foránea. |
| RF-03.4 | TC-019 | Pendiente | Seguimiento | Cálculo reactivo en el frontend. |
| RF-04.1 | TC-020 | Pendiente | Estadísticas | Retorna el número actualizado inmediatamente. |
| RF-05.2 | TC-021 | Pendiente | Gamificación | Lógica de misiones en backend pendiente. |
| RF-06.1 | TC-022 | Pendiente | Entrenador | Diseño de tablas asociativas de rutinas. |
| RF-08.1 | TC-023 | Pendiente | Notific. | Prioridad baja en MVP. |
| RNF-01.3 | TC-024 | Pendiente | Seguridad | Uso obligatorio de `supabase.auth.getUser()`. |
| RF-02.2 | TC-025 | Pendiente | Hábitos | UI para seleccionar días de la semana. |
| RF-02.6 | TC-026 | Pendiente | Hábitos | Optimizar query para no traer archivados. |
| RF-04.3 | TC-027 | Pendiente | Estadísticas | Componente de mapa de calor UI. |
| RF-05.3 | TC-028 | Pendiente | Gamificación | Evitar condiciones de carrera sumando puntos. |
| RNF-01.5 | TC-030 | Pendiente | Seguridad | Análisis estático del código. |

---

## 4. Hoja: Control de Defectos (Bugs)

| Bug ID | Módulo | Descripción | Severidad | Prioridad | Estado | Reportado Por | Fecha | Evidencia | Req. Asociado |
|---|---|---|---|---|---|---|---|---|---|
| BUG-001 | Autenticación | Uso de `getSession()` en código de servidor en lugar de `getUser()`. Puede validar sesiones falsas. | Alta | P0 | Abierto | Carlos | 2026-06-18 | EV-BUG-01 | RNF-01.3 |
| BUG-002 | Navegación | Referencias hardcodeadas a rutas `/dashboard/*` que rompen al recargar. | Media | P1 | Resuelto | Breiner | 2026-06-17 | EV-BUG-02 | RF-01.6 |
| BUG-003 | Hábitos | La acción de editar hábito no valida correctamente el ID del usuario contra el de la sesión (IDOR). | Crítica | P0 | Abierto | Carlos | 2026-06-18 | EV-BUG-03 | RF-02.4 |
| BUG-004 | Autenticación | `NEXT_PUBLIC_SITE_URL` no configurado en Vercel, el callback auth falla en producción. | Alta | P0 | Abierto | Breiner | 2026-06-18 | EV-BUG-04 | RF-01.2 |
| BUG-005 | Gamificación | Triggers de puntos en Supabase chocan con la nueva lógica del backend NestJS causando doble conteo. | Alta | P1 | Abierto | Juan | 2026-06-18 | EV-BUG-05 | RF-05.1 |
| BUG-006 | Comunidad | Error 404 al navegar desde la card del muro hacia el detalle del artículo. | Media | P2 | Abierto | Juan | 2026-06-18 | EV-BUG-06 | RF-07.1 |
| BUG-007 | Seguridad | Variable `SUPABASE_SERVICE_ROLE_KEY` expuesta en el cliente. | Crítica | P0 | Resuelto | Carlos | 2026-06-17 | EV-BUG-07 | RNF-01.5 |
| BUG-008 | UI | El modal de crear hábito se sale de la pantalla en dispositivos móviles pequeños. | Baja | P3 | Abierto | Nicolás | 2026-06-18 | EV-BUG-08 | RNF-03.1 |
| BUG-009 | Hábitos | Guardar hábito sin nombre no lanza mensaje de error en UI, se queda procesando. | Media | P2 | Abierto | Nicolás | 2026-06-18 | EV-BUG-09 | RNF-03.3 |
| BUG-010 | Seguimiento | Marcar completado a las 23:00 UTC-5 lo registra en el día siguiente (UTC). | Alta | P1 | Abierto | Carlos | 2026-06-18 | EV-BUG-10 | RF-03.2 |

---

## 5. Hoja: Evidencias

| ID Evidencia | Caso de Prueba | Tipo Evidencia | Descripción | Ruta/Archivo | Responsable |
|---|---|---|---|---|---|
| EV-001 | TC-001 | Screenshot | Formulario de registro completado exitosamente | `/evidencias/TC-001-registro.png` | Breiner |
| EV-002 | TC-002 | Screenshot | JWT visible en el Application tab de DevTools | `/evidencias/TC-002-jwt.png` | Juan |
| EV-003 | TC-003 | Log/TXT | Consola Next.js bloqueando middleware redirect | `/evidencias/TC-003-middleware-log.txt` | Nicolás |
| EV-004 | TC-007 | Log/JSON | Respuesta HTTP 403 Forbidden al testear IDOR | `/evidencias/TC-007-idor-403.json` | Carlos |
| EV-005 | TC-013 | Log/JSON | Payload RLS validado mostrando sólo `user_id` válido | `/evidencias/TC-013-rls-payload.json`| Carlos |
| EV-BUG-01| N/A (BUG) | Extracto Código| Captura del código usando `getSession` en servidor | `/evidencias/BUG-001-code.png` | Carlos |
| EV-BUG-03| N/A (BUG) | Log/JSON | Petición Postman exitosa alterando hábito ajeno | `/evidencias/BUG-003-postman.json` | Carlos |
| EV-BUG-10| N/A (BUG) | Screenshot | Fecha de BD guardada como +1 día por error UTC | `/evidencias/BUG-010-timezone.png` | Carlos |
