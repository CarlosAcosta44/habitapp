# Documento Maestro de QA y Testing — HabitApp

Este documento estandarizado contiene el registro, progreso y control de calidad de la fase actual (MVP y Backend NestJS). Se ha estructurado lógicamente y alineado estrictamente con el entorno real de HabitApp.

---

## 1. Requerimientos Funcionales y No Funcionales (Fase MVP & Backend NestJS)

| ID | Tipo | Módulo | Requerimiento | Prioridad | Estado | Progreso | Responsable | Capa Técnica |
|---|---|---|---|---|---|---|---|---|
| RF-1 | Funcional | Autenticación | Registro seguro con email y contraseña | Alta | Casi completo | 90% | Breiner | Supabase Auth + Server Action |
| RF-2 | Funcional | Autenticación | Login y logout seguro con validación JWT | Alta | Parcial | 80% | Breiner | Supabase Auth + Header |
| RF-3 | Funcional | Autenticación | Perfil automático al registrarse (trigger) | Alta | Casi completo | 80% | Carlos | Supabase Trigger SQL |
| RF-4 | Funcional | Usuarios | Editar perfil (nombre, avatar, zona horaria) | Media | Casi completo | 85% | Nicolás | Frontend UI + Server Action |
| RF-5 | Funcional | Usuarios | Roles de sistema: Usuario, Entrenador, Admin | Alta | Parcial | 65% | Carlos | NestJS RolesGuard |
| RF-6 | Funcional | Autenticación | Middleware protección rutas de dashboard | Alta | Casi completo | 85% | Breiner | Next.js Middleware |
| RF-7 | Funcional | Admin | Panel para activar/desactivar y cambiar roles | Media | Parcial | 25% | Juan | NestJS AdminModule |
| RF-8 | Funcional | Hábitos | Crear hábitos con nombre, categoría y frecuencia | Alta | Casi completo | 90% | Nicolás | Next.js Server Action |
| RF-9 | Funcional | Hábitos | Frecuencia de hábitos (días específicos de la semana) | Media | Parcial | 65% | Nicolás | Lógica de validación frontend |
| RF-10 | Funcional | Hábitos | Asignar categorías predefinidas a hábitos | Baja | Casi completo | 90% | Nicolás | Supabase Repository |
| RF-11 | Funcional | Hábitos | Editar y archivar hábitos existentes | Alta | Parcial | 75% | Nicolás | Service + Validación Ownership |
| RF-12 | Funcional | Hábitos | Eliminar hábitos sin registros diarios limpios | Media | Parcial | 55% | Nicolás | Service (condición count = 0) |
| RF-13 | Funcional | Hábitos | Filtrar y mostrar solo hábitos activos | Alta | Casi completo | 90% | Nicolás | Consulta filtrada Supabase |
| RF-14 | Funcional | Seguimiento | Marcar hábito completado o deshacer marca | Alta | Casi completo | 85% | Nicolás | RegistroService + UI |
| RF-15 | Funcional | Seguimiento | Registrar fecha exacta mitigando offset UTC | Alta | Parcial | 85% | Carlos | Backend NestJS Date parsing |
| RF-16 | Funcional | Seguimiento | Porcentaje de hábitos completados del día | Media | Parcial | 80% | Nicolás | Dashboard cálculo UI |
| RF-17 | Funcional | Estadísticas | Calcular racha actual (días consecutivos) | Alta | Parcial | 80% | Nicolás | Lógica de cálculo NestJS |
| RF-18 | Funcional | Estadísticas | Registrar racha histórica máxima | Media | Parcial | 70% | Nicolás | Repository + Casos borde |
| RF-19 | Funcional | Estadísticas | Heatmap de actividad (últimos 90 días) | Baja | Parcial | 40% | Nicolás | UI Component + Backend query |
| RF-20 | Funcional | Gamificación | Asignar puntos automáticos al completar hábito | Alta | Parcial | 55% | Carlos | Trigger SQL / NestJS |
| RF-21 | Funcional | Gamificación | Participar y cumplir retos grupales en comunidad | Media | Pendiente | 25% | Juan | NestJS Tareas/Retos |
| RF-22 | Funcional | Gamificación | Acumular puntos totales y bloquear carrera doble | Alta | Parcial | 75% | Carlos | NestJS PointsService |
| RF-23 | Funcional | Ranking | Ranking global ordenado por puntaje total | Alta | Parcial | 50% | Carlos | Vista SQL + NestJS |
| RF-24 | Funcional | Entrenador | Entrenadores crean rutinas asociadas a su perfil | Alta | Parcial | 60% | Juan | Frontend + Backend CoachModule |
| RF-25 | Funcional | Comunidad | Muro de artículos y retos de comunidad | Media | Casi completo | 85% | Juan | UI + Repository |
| RF-26 | Funcional | Notific. | Preferencias de recordatorios en perfil de usuario | Baja | Pendiente | 15% | Nicolás | LocalStorage / NestJS |
| RNF-1 | No Funcional| Seguridad | Row Level Security (RLS) en tablas Supabase | Alta | Parcial | 80% | Carlos | Supabase SQL Policies |
| RNF-2 | No Funcional| Seguridad | Validar sesión (`getUser()`) en Next.js Server Actions | Alta | Parcial | 50% | Breiner | Next.js Server Actions |
| RNF-3 | No Funcional| Seguridad | `service_role` jamás expuesto en el cliente JS | Alta | Casi completo | 95% | Carlos | Configuración `.env` |
| RNF-4 | No Funcional| Arquitectura| API NestJS modular, responsiva y en funcionamiento | Alta | Parcial | 30% | Carlos | Health Controller |

---

## 2. Casos de Prueba (Test Cases) Detallados

*Nota: Todos los escenarios de esta fase y las evidencias recopiladas deben ejecutarse durante el sprint de **Junio de 2026**.*

| Test Case ID | Módulo | Req. Asociado | Objetivo | Precondiciones | Datos de Prueba | Pasos | Resultado Esperado | Resultado Obtenido | Estado | Tester | Fecha | Evidencia |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-1 | Auth | RF-1 | Validar registro exitoso. | Ninguna | email: `breiner@habitapp.com`, pass: `Pass2026*` | 1. Navegar a `/auth/register`.<br>2. Ingresar el correo y contraseña.<br>3. Hacer clic en "Registrarse". | Redirección a `/dashboard`. Perfil visible en base de datos. | Se completó el registro y redireccionó sin errores. | Aprobado | Breiner | 2026-06-05 | EV-1 |
| TC-2 | Auth | RF-2 | Validar inicio de sesión. | Usuario existe | email: `juan@habitapp.com`, pass: `Pass2026*` | 1. Navegar a `/auth/login`.<br>2. Digitar credenciales válidas y hacer clic en entrar.<br>3. Abrir DevTools (F12) > Application. | Sesión iniciada. El token JWT de Supabase es visible y válido en Cookies. | Se verificó el JWT en Application > Cookies con éxito. | Aprobado | Juan | 2026-06-06 | EV-2 |
| TC-3 | Auth | RF-6 | Middleware protege rutas privadas. | Sesión cerrada | N/A | 1. Abrir ventana de incógnito.<br>2. Navegar directamente a `http://localhost:3000/dashboard`. | Intercepción inmediata. El navegador redirige al login sin mostrar el dashboard. | Middleware interceptó la petición correctamente. | Aprobado | Nicolás | 2026-06-07 | EV-3 |
| TC-4 | Usuarios | RF-4 | Actualizar datos del perfil. | Logueado | Nombre: "Carlos Acosta", Zona: "UTC-5" | 1. En el menú, ir a "Mi Perfil".<br>2. Cambiar el nombre a "Carlos Acosta".<br>3. Seleccionar "UTC-5" en zona horaria y guardar. | El nombre se actualiza en tiempo real en la barra superior y en `gestion.usuarios`. | Cambios reflejados correctamente en el header en tiempo real. | Aprobado | Carlos | 2026-06-08 | EV-4 |
| TC-5 | Usuarios | RF-5 | Validar protección de RolesGuard. | Logueado como "Usuario" | N/A | 1. Abrir Postman.<br>2. Configurar petición `GET /api/admin/users`.<br>3. Adjuntar token JWT del Usuario regular. | NestJS rechaza la petición devolviendo error HTTP 403 Forbidden. | Backend rechazó el token y arrojó el 403 Forbidden. | Aprobado | Juan | 2026-06-09 | EV-5 |
| TC-6 | Hábitos | RF-8 | Crear un hábito desde cero. | Logueado | Hábito: "Correr 5km", Categoría: "Ejercicio", Meta: 1 veces | 1. Clic en "Nuevo Hábito".<br>2. Escribir "Correr 5km".<br>3. Seleccionar la categoría "Ejercicio".<br>4. Clic en "Crear". | El modal se cierra y el nuevo hábito aparece listado en la pantalla de "Hoy". | Apareció de inmediato en la lista del dashboard. | Aprobado | Nicolás | 2026-06-10 | EV-6 |
| TC-7 | Hábitos | RF-11 | Bloquear edición IDOR. | Logueado como Carlos | UUID de hábito de Breiner | 1. Obtener UUID de un hábito de otro usuario.<br>2. Lanzar petición PATCH a `/api/habits/{UUID_Ajeno}` modificando el nombre. | El backend deniega la acción por no coincidir el propietario (HTTP 401/403). | Falló la validación, el servidor permitió modificar el nombre (BUG IDOR). | Fallido | Carlos | 2026-06-11 | EV-BUG-3 |
| TC-8 | Seguim. | RF-14 | Marcar un hábito completado. | Logueado, hábito activo | Hábito: "Meditar" | 1. Ubicar el hábito "Meditar" en la lista diaria.<br>2. Hacer clic en la casilla de verificación vacía. | La casilla se marca visualmente (verde), el sistema emite feedback y graba en BD. | Actualización optimista exitosa y confirmada en BD. | Aprobado | Nicolás | 2026-06-11 | EV-7 |
| TC-9 | Seguim. | RF-15 | Alineación de fecha a zona local. | PC configurado en UTC-5 | Fecha: **15 de junio de 2026**, Hora local: 23:50 | 1. Cambiar hora de la PC a 23:50 UTC-5.<br>2. Marcar "Beber agua 2000ml" como completado.<br>3. Revisar BD. | El registro insertado en `registro_habitos` tiene fecha estricta de `2026-06-15`, no del día 16. | Error de desfase, se guardó en BD como 2026-06-16 debido a UTC (BUG). | Fallido | Carlos | 2026-06-15 | EV-BUG-10 |
| TC-10 | Gamific. | RF-20 | Asignar puntos automáticamente. | Logueado | Reto "Tomar el sol" (valor: 10 pts) | 1. Anotar puntaje actual en perfil.<br>2. Completar el hábito "Tomar el sol".<br>3. Revisar el contador de puntos. | Se suman los puntos en la UI de inmediato y se añade registro en `historial_puntos`. | Suma doble registrada por conflicto NestJS vs Supabase (BUG). | Fallido | Carlos | 2026-06-16 | EV-BUG-5 |
| TC-11 | Ranking | RF-23 | Actualización de Ranking. | Logueado | N/A | 1. Navegar a `/comunidad/ranking`.<br>2. Ejecutar manualmente el CRON de NestJS.<br>3. Refrescar la página. | La vista `vista_ranking` se recalcula y las posiciones cambian según puntos. | Posiciones actualizadas exitosamente sin demoras en la tabla. | Aprobado | Juan | 2026-06-16 | EV-8 |
| TC-12 | Comunid. | RF-25 | Cargar novedades de la comunidad. | Logueado | Artículos de Junio 2026 | 1. Hacer clic en "Comunidad" en la barra de navegación.<br>2. Revisar el muro principal de contenido. | Se listan los artículos (ej. sobre "Nutrición") y retos activos como "¡Mejores corredores!". | Los artículos renderizan correctamente de forma descendente en el muro. | Aprobado | Breiner | 2026-06-16 | EV-9 |
| TC-13 | Segurid. | RNF-1 | Aislamiento RLS en Base de Datos. | Token de Juan | N/A | 1. Ejecutar petición directa `SELECT * FROM seguimiento.habitos` a Supabase usando REST y el JWT de Juan. | La base de datos responde exclusivamente con las filas donde `idusuario` pertenece a Juan. | RLS actuó bien y excluyó los registros de otros usuarios en el response. | Aprobado | Carlos | 2026-06-17 | EV-10 |
| TC-14 | Arquitec.| RNF-4 | Respuesta del Health Check API. | Backend local activo | N/A | 1. Navegar en el explorador a `http://localhost:3001/api/v1/health`. | Se visualiza en formato JSON: `{ "status": "ok" }`. | Se obtuvo el JSON con status ok en 20ms. | Aprobado | Breiner | 2026-06-17 | EV-11 |
| TC-15 | Auth | RF-2 | Cerrar sesión y destrucción de cookie. | Logueado | N/A | 1. Clic en el Avatar (arriba a la derecha).<br>2. Seleccionar "Cerrar Sesión".<br>3. Usar la flecha de "Atrás" del navegador. | La cookie se invalida. El intento de retroceso es bloqueado hacia el login. | Middleware forzó volver a login de manera efectiva. | Aprobado | Juan | 2026-06-17 | EV-12 |
| TC-16 | Admin | RF-7 | Bloqueo de cuenta de usuario. | Logueado como "Administrador" | UUID del usuario Nicolás | 1. Navegar a `/admin/users`.<br>2. Seleccionar "Nicolás" y cambiar su estado a "Suspendido".<br>3. Intentar login como Nicolás. | Acceso denegado. Aparece mensaje de cuenta suspendida. | Mostró mensaje de "Cuenta Suspendida" al iniciar sesión. | Aprobado | Nicolás | 2026-06-17 | EV-13 |
| TC-17 | Hábitos | RF-12 | Eliminar hábito sin historial. | Hábito sin completar | Hábito nuevo: "Lectura rápida" | 1. Crear hábito "Lectura rápida".<br>2. Sin marcarlo ningún día, abrir opciones y hacer clic en "Eliminar".<br>3. Confirmar. | Hábito borrado. En la BD, el registro desaparece (DELETE). | Fila removida permanentemente de Supabase sin error de foreign key. | Aprobado | Breiner | 2026-06-18 | EV-14 |
| TC-18 | Hábitos | RF-11 | Archivar hábito antiguo. | Hábito con registros | Hábito viejo con registros del 10 de junio de 2026 | 1. Abrir opciones del hábito.<br>2. Seleccionar "Archivar".<br>3. Revisar sección "Hoy". | Desaparece de "Hoy" pero los registros históricos y puntos quedan intactos en BD. | Desapareció de la lista principal, puntos y rachas no variaron. | Aprobado | Juan | 2026-06-18 | EV-15 |
| TC-19 | Seguim. | RF-16 | UI de Progreso Diario. | 4 hábitos activos hoy | 2 hábitos completados | 1. Completar exactamente 2 de los 4 hábitos mostrados.<br>2. Mirar la barra principal superior. | La barra circular o lineal refleja un progreso exacto del 50%. | La barra circular pintó exactamente la mitad de color verde. | Aprobado | Nicolás | 2026-06-18 | EV-16 |
| TC-20 | Estadíst.| RF-17 | Reactividad de la racha actual. | Racha en 1 | Hábito pendiente de hoy, **18 de junio de 2026** | 1. Abrir detalle del hábito (racha actual: 1).<br>2. Marcar completado para hoy 18 de junio.<br>3. Mirar el badge de fuego. | El icono de racha se actualiza visualmente a "2" de inmediato. | Badge naranja mostró racha 2 exitosamente sin tener que recargar. | Aprobado | Carlos | 2026-06-18 | EV-17 |
| TC-21 | Gamific. | RF-21 | Completar reto de comunidad. | Inscrito en reto | Reto: "¡Mejores corredores!" | 1. Cumplir con las 4 tareas del reto (Beber agua, Correr, etc.).<br>2. Marcar la última como completada. | El sistema arroja confeti y asigna +200 puntos por cumplir el reto. | Se sumaron los 200 pts extras tras marcar última tarea de forma reactiva. | Aprobado | Juan | 2026-06-18 | EV-18 |
| TC-22 | Coach | RF-24 | Entrenador crea rutina. | Logueado como "Entrenador" | Nombre: "Básica", Tipo: "Ejercicio", Nivel: "Principiante" | 1. Ir a la pestaña "Mis Rutinas".<br>2. Llenar el formulario con los datos de prueba.<br>3. Guardar. | Rutina insertada en la tabla `seguimiento.rutinas` vinculada al `identrenador`. | Rutina persistida correctamente en la tabla y asignada al creador. | Aprobado | Breiner | 2026-06-18 | EV-19 |
| TC-23 | Notific. | RF-26 | Desactivar recordatorios diarios. | Logueado | N/A | 1. Ir a Configuración -> Notificaciones.<br>2. Apagar el switch "Recordatorios Diarios".<br>3. Pulsar F5. | Tras recargar, el switch permanece apagado leyendo la preferencia guardada. | Preferencia guardada en DB y cargada exitosamente al oprimir F5. | Aprobado | Nicolás | 2026-06-18 | EV-20 |
| TC-24 | Segurid. | RNF-2 | Server action intercepta sesión rota. | Token borrado | N/A | 1. Borrar manualmente la cookie desde DevTools.<br>2. Intentar crear un nuevo hábito haciendo clic en el modal. | El Server Action llama a `getUser()`, falla, devuelve error y fuerza redirección. | Petición exitosa pese a token borrado por mal uso de getSession() (BUG). | Fallido | Carlos | 2026-06-18 | EV-BUG-1 |
| TC-25 | Hábitos | RF-9 | Validación de días de frecuencia. | Hoy es Martes, **16 de junio de 2026** | Frecuencia: Lunes, Miércoles, Viernes | 1. Crear hábito marcando sólo L-M-V.<br>2. Confirmar creación.<br>3. Revisar la vista "Hoy". | Como hoy es Martes 16 de junio, el hábito NO aparece en la lista activa del día. | Hábito oculto correctamente en el filtro del martes 16 de junio. | Aprobado | Juan | 2026-06-16 | EV-21 |
| TC-26 | Hábitos | RF-13 | Filtro en vista de activos. | 1 activo, 1 archivado | N/A | 1. Asegurarse de tener estado mixto en BD.<br>2. Navegar a la pantalla principal "Hoy". | El frontend mapea únicamente el hábito que está activo; el archivado no se renderiza. | Frontend omitió correctamente el objeto archivado de la UI. | Aprobado | Breiner | 2026-06-18 | EV-22 |
| TC-27 | Estadíst.| RF-19 | Visualización del Heatmap. | Múltiples registros previos | Registros de la semana 2 de **junio de 2026** | 1. Abrir la página de detalle de un hábito.<br>2. Observar el componente de mapa de calor (cuadrícula). | Los cuadros correspondientes a los días completados de junio se pintan de verde intenso. | Celdas del 10 y 11 de junio se renderizaron con el color correcto. | Aprobado | Nicolás | 2026-06-18 | EV-23 |
| TC-28 | Gamific. | RF-22 | Manejo de concurrencia en puntos. | Logueado | Hábito a completar | 1. Usar un script o hacer doble clic hiperrápido al completar un hábito para enviar dos peticiones simultáneas. | NestJS procesa una sola suma válida, impidiendo que el usuario se infle de puntos mediante bugs. | NestJS frenó con éxito la segunda petición paralela (Lock aplicado). | Aprobado | Carlos | 2026-06-18 | EV-24 |
| TC-29 | Admin | RF-7 | Actualización de roles en lote. | Logueado como "Administrador" | 3 IDs de usuarios regulares | 1. En el panel de usuarios, seleccionar 3 casillas de la tabla.<br>2. Clic en "Asignar Entrenador". | Los 3 usuarios pasan simultáneamente a tener `idrol` de Entrenador en `gestion.usuarios`. | Patch múltiple ejecutado de forma transaccional y validado en UI. | Aprobado | Juan | 2026-06-18 | EV-25 |
| TC-30 | Segurid. | RNF-3 | Protección de llave privada Supabase. | App desplegada en local/Vercel | N/A | 1. En el navegador, abrir el código fuente (Ctrl+U).<br>2. Buscar la cadena de la Service Role Key. | Búsqueda sin resultados. La llave jamás se empaqueta en los assets JS descargados al cliente. | No se detectó ninguna cadena que coincida con la llave filtrada. | Aprobado | Breiner | 2026-06-18 | EV-26 |

---

## 3. Matriz de Trazabilidad

| Requerimiento | Casos de Prueba | Estado Actual | Módulo | Observaciones Críticas |
|---|---|---|---|---|
| RF-1 | TC-1 | Pendiente | Autenticación | Confirmar redirección automática y limpieza de estado de error. |
| RF-2 | TC-2, TC-15 | Pendiente | Autenticación | Probar exhaustivamente la vida útil del JWT. |
| RF-6 | TC-3 | Pendiente | Autenticación | Validar `matcher` en `middleware.ts` para rutas de coach y admin. |
| RF-4 | TC-4 | Pendiente | Usuarios | Confirmar validación de string y zona horaria con Zod. |
| RF-5 | TC-5 | Pendiente | Usuarios | RolesGuard en NestJS es la capa más crítica del RBAC. |
| RF-8 | TC-6 | Pendiente | Hábitos | Integración con Server Actions lista, falta testeo E2E. |
| RF-11 | TC-7, TC-18 | Pendiente | Hábitos | Peligro de IDOR si la capa service no valida el `user_id`. |
| RF-14 | TC-8 | Pendiente | Seguimiento | El optimistic update en UI debe ser rápido y revertirse si falla BD. |
| RF-15 | TC-9 | Pendiente | Seguimiento | Crítico que en la franja 20:00-23:59 UTC-N no salte al día UTC siguiente. |
| RF-20 | TC-10 | Pendiente | Gamificación | Monitorear rendimiento del trigger `sumar_puntos_habito`. |
| RF-23 | TC-11 | Pendiente | Ranking | El CRON no debe saturar la RAM si hay 100k usuarios concurrentes. |
| RF-25 | TC-12 | Pendiente | Comunidad | Aplicar lazy load si la tabla de artículos crece mucho. |
| RNF-1 | TC-13 | Pendiente | Seguridad | Las sentencias SQL `UPDATE`/`DELETE` también deben tener política RLS. |
| RNF-4 | TC-14 | Pendiente | Arquitectura | Health endpoint esencial para el monitoreo de uptime en Vercel. |
| RF-7 | TC-16, TC-29 | Pendiente | Admin | Asegurar protección doble: Middleware Next + Guards en NestJS. |
| RF-12 | TC-17 | Pendiente | Hábitos | Verificar la restricción de clave foránea `ON DELETE RESTRICT` si hay historial. |
| RF-16 | TC-19 | Pendiente | Seguimiento | Cálculo estrictamente reactivo derivado de los filtros de estado actual. |
| RF-17 | TC-20 | Pendiente | Estadísticas | Debe recalcularse si el usuario entra 2 días después y rompió la racha. |
| RF-21 | TC-21 | Pendiente | Gamificación | La lógica transaccional de los retos grupales debe correr en NestJS. |
| RF-24 | TC-22 | Pendiente | Entrenador | Revisar el FK hacia `seguimiento.entrenadores`. |
| RF-26 | TC-23 | Pendiente | Notific. | Prioridad MVP muy baja, candidato a postergarse. |
| RNF-2 | TC-24 | Pendiente | Seguridad | Uso obligatorio de `@supabase/ssr` `getUser()` y nunca depender de cookies crudas. |
| RF-9 | TC-25 | Pendiente | Hábitos | Manejo de arrays `[1,3,5]` en base de datos para filtrado diario. |
| RF-13 | TC-26 | Pendiente | Hábitos | Optimización a nivel de índice SQL en columna `estado` de hábitos. |
| RF-19 | TC-27 | Pendiente | Estadísticas | Componente pesado en renderizado; memorizar con `useMemo`. |
| RF-22 | TC-28 | Pendiente | Gamificación | Mitigar colisiones y sumas dobles usando bloqueos transaccionales (locks). |
| RNF-3 | TC-30 | Pendiente | Seguridad | Jamás prefijar con `NEXT_PUBLIC_` las variables exclusivas del servidor backend. |

---

## 4. Registro y Control de Defectos (Bugs)

| ID Bug | Módulo | Descripción Técnica del Defecto | Severidad | Prioridad | Estado | Reportado Por | Fecha Detección | Evidencia | Requerim. |
|---|---|---|---|---|---|---|---|---|---|
| BUG-1 | Auth | Uso indebido de `getSession()` en código servidor (Next.js) en vez de `getUser()`. Puede validar tokens suplantados. | Alta | P0 | Abierto | Carlos | 2026-06-18 | EV-BUG-1 | RNF-2 |
| BUG-2 | UI / Nav | Referencias hardcodeadas en layout provocaban crash al recargar en rutas hijas del `/dashboard`. | Media | P1 | Resuelto | Breiner | 2026-06-17 | EV-BUG-2 | RF-6 |
| BUG-3 | Hábitos | Falla grave de seguridad (IDOR). La mutación PATCH no confronta el `idusuario` del registro con el JWT, permitiendo editar a otros. | Crítica | P0 | Abierto | Carlos | 2026-06-18 | EV-BUG-3 | RF-11 |
| BUG-4 | Auth | `NEXT_PUBLIC_SITE_URL` no fue inyectada en Vercel; la redirección Oauth y Callback de Supabase fallan en Producción. | Alta | P0 | Abierto | Breiner | 2026-06-18 | EV-BUG-4 | RF-2 |
| BUG-5 | Gamific. | Doble conteo de puntos: el trigger de SQL y el servicio de NestJS están sumando puntos por la misma acción al mismo tiempo. | Alta | P1 | Abierto | Juan | 2026-06-18 | EV-BUG-5 | RF-20 |
| BUG-6 | Comunid. | Error HTTP 404 de Next.js al intentar navegar desde la Card del muro principal hacia el slug `/comunidad/articulo/{id}`. | Media | P2 | Abierto | Juan | 2026-06-18 | EV-BUG-6 | RF-25 |
| BUG-7 | Segurid. | Fuga de secretos: La variable `SUPABASE_SERVICE_ROLE_KEY` fue detectada accidentalmente en el bundle JS del cliente. | Crítica | P0 | Resuelto | Carlos | 2026-06-17 | EV-BUG-7 | RNF-3 |
| BUG-8 | UI | Problema de CSS (Overflow): El modal de "Nuevo Hábito" se desborda en pantallas inferiores a 360px impidiendo ver el botón de guardar. | Baja | P3 | Abierto | Nicolás | 2026-06-18 | EV-BUG-8 | N/A |
| BUG-9 | Hábitos | Falta validación: Pulsar "Guardar" sin llenar el nombre no dispara error `zod` en pantalla y bloquea el estado de carga (Spinner infinito). | Media | P2 | Abierto | Nicolás | 2026-06-18 | EV-BUG-9 | RF-8 |
| BUG-10 | Seguim. | Bug de Timezone: Marcar progreso a las 23:00 en Colombia (UTC-5) guarda el registro en la BD en el día siguiente UTC, quebrando la racha. | Alta | P1 | Abierto | Carlos | 2026-06-18 | EV-BUG-10 | RF-15 |

---

## 5. Repositorio de Evidencias

| ID Evid. | TC o Bug Asociado | Tipo de Evidencia | Descripción de la Prueba Documentada | Ruta del Archivo Físico | Tester |
|---|---|---|---|---|---|
| EV-1 | TC-1 | Screenshot | Formulario de registro llenado y badge verde de éxito al pasar a `/dashboard` | `/evidencias/TC-1-registro.png` | Breiner |
| EV-2 | TC-2 | Screenshot | DevTools abierto mostrando JWT inyectado correctamente bajo el dominio local | `/evidencias/TC-2-jwt.png` | Juan |
| EV-3 | TC-3 | Log/TXT | Terminal mostrando el log de Next.js interceptando y redirigiendo (HTTP 307) | `/evidencias/TC-3-middleware-log.txt` | Nicolás |
| EV-4 | TC-7 | Log/JSON | Payload de respuesta de Postman con código 403 Forbidden al testear el IDOR | `/evidencias/TC-7-idor-403.json` | Carlos |
| EV-5 | TC-13 | Log/JSON | Resultado SQL con array de objetos pertenecientes exclusivamente al usuario logueado | `/evidencias/TC-13-rls-payload.json`| Carlos |
| EV-BUG-1| BUG-1 | Extracto Código| Captura de pantalla de la línea de código peligrosa usando el método obsoleto | `/evidencias/BUG-1-code.png` | Carlos |
| EV-BUG-3| BUG-3 | Log/JSON | Petición Postman exitosa (HTTP 200) que alteró el nombre del hábito de otro perfil | `/evidencias/BUG-3-postman.json` | Carlos |
| EV-BUG-10| BUG-10 | Screenshot | Tabla SQL Supabase mostrando la fecha de inserción corrida `+1` día frente a hora local | `/evidencias/BUG-10-timezone.png` | Carlos |
