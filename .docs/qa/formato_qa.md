# Formato QA - Top 10 Requerimientos Críticos (MVP)

Este documento está formateado para que puedas copiar y pegar directamente la información en tu Excel de control de QA. Se han seleccionado los 10 requerimientos más importantes para la estabilidad del producto.

---

## Hoja 1: Progreso de Requerimientos

| ID | Tipo | Módulo | Requerimiento | Prioridad | Estado | Progreso % | Responsable | Capa Técnica |
|---|---|---|---|---|---|---|---|---|
| RF-01.1 | Funcional | Autenticación | Registro seguro con email y contraseña | Alta | Casi completo | 90% | Breiner | Supabase Auth + Server Action |
| RF-01.2 | Funcional | Autenticación | Login/logout seguro con validación JWT | Alta | Casi completo | 80% | Breiner | Supabase Auth (hardening `getUser` pendiente) |
| RF-01.6 | Funcional | Autenticación | Middleware protección rutas dashboard | Alta | Casi completo | 85% | Breiner | Next.js Middleware |
| RF-02.1 | Funcional | Hábitos | Crear y validar hábitos (Etiquetas, Frecuencia) | Alta | Casi completo | 90% | Nicolás | Server Action + Supabase Repository |
| RF-02.4 | Funcional | Hábitos | Edición/Archivado seguro sin IDOR | Alta | Parcial | 75% | Nicolás | Validación Ownership (Service) |
| RF-03.1 | Funcional | Seguimiento | Marcar hábito completado (con offset UTC) | Alta | Casi completo | 85% | Nicolás | NestJS + Supabase Repository |
| RF-04.1 | Funcional | Estadísticas | Cálculo de rachas actuales e históricas | Media | Parcial | 80% | Nicolás | Lógica de NestJS / Repository |
| RF-05.1 | Funcional | Gamificación | Puntos automáticos por hábito completado | Alta | Parcial | 55% | Carlos | Lógica de NestJS (sin triggers) |
| RF-05.4 | Funcional | Ranking | Ranking global ordenado por puntos | Alta | Parcial | 50% | Carlos | CRON Job + Cache NestJS |
| RNF-01.1| No Funcional| Seguridad | Aislamiento total de datos entre usuarios | Alta | Parcial | 80% | Carlos | Supabase RLS (Row Level Security) |

---

## Hoja 2: Test Cases (Casos de Prueba QA)

| Test Case ID | Módulo | Req. Asociado | Objetivo | Pasos | Resultado Esperado |
|---|---|---|---|---|---|
| TC-001 | Autenticación | RF-01.1 | Validar flujo de registro. | 1. Ir a /registro<br>2. Ingresar email y password<br>3. Enviar form. | Redirige al dashboard, cookie seteada, usuario en Supabase auth.users y public.user_profiles. |
| TC-002 | Autenticación | RF-01.2 | Validar login y logout. | 1. Ir a /login y autenticar.<br>2. Clic en "Cerrar sesión". | Acceso concedido al dashboard. Al cerrar sesión, la cookie se borra y redirige a /login. |
| TC-003 | Autenticación | RF-01.6 | Validar middleware en rutas privadas. | 1. Abrir incógnito.<br>2. Navegar a /dashboard o /perfil manualmente. | El middleware bloquea el acceso y redirige automáticamente a /login. |
| TC-004 | Hábitos | RF-02.1 | Crear hábito nuevo. | 1. Login.<br>2. Llenar formulario de hábito.<br>3. Guardar. | El hábito se guarda en BD con `user_id` correcto y aparece activo en la UI. |
| TC-005 | Hábitos | RF-02.4 | Validar IDOR en edición. | 1. Login como UsuarioA.<br>2. Intentar editar UUID del HábitoX (perteneciente a UsuarioB). | El servidor rechaza la petición por validación de ownership. El hábito no se modifica. |
| TC-006 | Seguimiento | RF-03.1 | Validar marca de completado (UTC). | 1. Hacer clic en el check de hábito diario.<br>2. Verificar cálculo de fin de día según zona horaria. | El estado de hábito cambia a completado para el día correcto; se incrementa la racha. |
| TC-007 | Gamificación | RF-05.1 | Puntos asignados en backend NestJS. | 1. Marcar hábito completado.<br>2. Revisar respuesta de API y BD. | Los puntos totales en el perfil del usuario aumentan mediante el servicio de NestJS. |
| TC-008 | Gamificación | RF-05.4 | CRON Ranking Global. | 1. Simular carga de puntos en BD.<br>2. Esperar ejecución CRON o invocar endpoint. | El ranking se actualiza en caché y se muestra el orden correcto en la ruta /ranking. |
| TC-009 | Seguridad | RNF-01.1 | Probar Row Level Security (RLS). | 1. Obtener JWT de UsuarioA.<br>2. Hacer GET REST a Supabase `habits` sin filtros. | Supabase devuelve únicamente los hábitos donde `user_id` corresponde a UsuarioA. |
| TC-010 | Seguridad | RNF-01.5 | Service Role oculto en cliente. | 1. Ejecutar build (`npm run build`).<br>2. Buscar la cadena `service_role`. | La build no expone la clave privada en los bundles JS que se envían al navegador. |
