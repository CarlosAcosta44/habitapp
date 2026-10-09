# Plan de Migración y Refactorización (Frontend Web)

**Objetivo Principal:** Evolucionar el frontend de HabitApp para desconectarlo completamente de Supabase directo, integrarlo con el nuevo Backend NestJS (Custom Auth) y refactorizar su código para que cumpla estrictamente con Clean Architecture y sea 100% testeable.

---

## 1. Desconexión de Supabase y Migración a Custom Auth
Actualmente, el frontend utiliza el SDK de Supabase (`@supabase/supabase-js` o `@supabase/ssr`) para registrar usuarios, iniciar sesión y recuperar datos directamente de la base de datos. Esto es un riesgo de seguridad y rompe la arquitectura.

**Plan de acción:**
1. **Eliminar el SDK de Supabase Auth:** Destruir todas las llamadas a `supabase.auth.signUp()`, `signInWithPassword()`, `getUser()`, etc.
2. **Implementar el cliente HTTP (Backend):** Crear un cliente base (ej. usando `axios` o `fetch` con interceptores) que apunte a la API de NestJS (`http://localhost:4000/api/v1`).
3. **Gestión de Sesión con JWT:** 
   - El frontend enviará las credenciales a `/auth/login` (NestJS).
   - NestJS devolverá un `access_token` (JWT).
   - El frontend guardará este token de forma segura (ej. en cookies `HttpOnly` mediante Server Actions de Next.js) y lo inyectará en el header `Authorization: Bearer <token>` de cada petición futura.

## 2. Refactorización Arquitectónica Estricta
El frontend tiene Next.js (App Router), pero la lógica está mezclada en los componentes. Implementaremos una separación de responsabilidades estricta.

**Nueva Estructura de Capas (Por Módulo):**
* **Capa 1: UI / Presentación (`/app` y `/components`)**
  * Solo dibuja interfaces. No hace fetch directo ni contiene lógica de negocio.
  * Consumen `Server Actions` o `Hooks` personalizados.
* **Capa 2: Server Actions / Controladores**
  * Intermedian entre la UI y los servicios. Capturan los datos del formulario, los validan y llaman al servicio.
* **Capa 3: Services (Lógica de Negocio)**
  * Aplican las reglas de negocio en el lado del cliente o servidor.
* **Capa 4: Repositories / API Clients (Infraestructura)**
  * Clases o funciones especializadas únicamente en hacer `fetch()` hacia el Backend NestJS. Mapean los JSON del backend a interfaces locales.

## 3. Testabilidad (100% Testeable)
Al extraer la lógica de obtención de datos hacia los `Repositories` y la lógica de negocio a los `Services`, los componentes de React se vuelven "tontos" (Dumb Components).
- Podremos crear pruebas unitarias (con Jest) para los `Services` sin necesitar renderizar componentes.
- Los componentes se probarán con React Testing Library simulando (mocking) las respuestas de los Server Actions.

## 4. Fases de Ejecución

### Fase 1: Preparación y Autenticación
1. Configurar variables de entorno (`NEXT_PUBLIC_API_URL`).
2. Construir la utilidad de cliente HTTP base con interceptores para inyectar el token.
3. Refactorizar las pantallas de Login y Registro para que usen la nueva API del Backend en lugar de Supabase.

### Fase 2: Refactorización por Módulos
1. **Módulo de Usuarios/Perfil:** Refactorizar cómo se obtiene y actualiza el perfil del usuario activo.
2. **Módulo de Hábitos:** Extraer toda la lógica de rachas y creación de hábitos a `HabitsService` y `HabitsRepository`.
3. **Módulo de Comunidad:** Reemplazar las suscripciones en tiempo real de Supabase (si existían) por polling o WebSockets genéricos contra el backend NestJS.

### Fase 3: Limpieza y Pruebas
1. Purgar el paquete `@supabase/supabase-js` del `package.json` del frontend.
2. Escribir pruebas unitarias para los 3 servicios principales.
3. Asegurar que las variables de entorno relacionadas con Supabase ya no existan en Vercel.
