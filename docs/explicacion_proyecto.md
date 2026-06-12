# HabitApp - Backend

Este proyecto es el backend (la lógica del servidor y conexión principal con la base de datos) para la aplicación HabitApp. HabitApp es una plataforma que permite a los usuarios rastrear sus hábitos, interactuar con una comunidad y recibir apoyo de entrenadores personales.

## ¿Por qué elegimos estas tecnologías?

Para desarrollar este backend, decidimos utilizar **NestJS** (un framework progresivo de Node.js) en combinación con **Supabase** (una plataforma Backend-as-a-Service basada en PostgreSQL). 

**Razones clave de la elección:**
1. **TypeScript como lenguaje principal:** NestJS utiliza TypeScript por defecto, lo que nos permite compartir los mismos tipos de datos (DTOs e interfaces) con nuestro frontend en Next.js. Esto reduce enormemente los errores de compatibilidad y hace que todo el equipo maneje el mismo lenguaje.
2. **Estructura escalable y modular:** NestJS nos obliga a organizar el código en módulos (Auth, Users, Coach, Admin), controladores y servicios. Esta arquitectura en capas evita el "código espagueti" y hace que agregar nuevas funciones en el futuro sea muy ordenado.
3. **Integración híbrida con Supabase:** Aprovechamos Supabase para la autenticación rápida (Supabase Auth) y las operaciones directas de datos de usuarios (con Row Level Security), mientras que usamos NestJS para operaciones complejas como roles administrativos, gestión de entrenadores y envíos de notificaciones que requieren permisos elevados (`service_role`).
4. **Seguridad y Validación Automática:** NestJS cuenta con herramientas integradas (Pipes, Guards y Decoradores) que facilitan validar qué datos entran al sistema y qué roles tienen permiso para acceder a qué rutas.

---

## ¿Cómo funciona el proyecto? (Visión general)

El backend actúa como el "cerebro y el guardia" de la plataforma, coordinando las solicitudes de la app móvil/web y protegiendo la información en la base de datos PostgreSQL de Supabase.

### 1. Sistema de Autenticación
Los usuarios inician sesión desde el frontend utilizando **Supabase Auth**. Cuando el frontend nos envía una petición, adjunta un token (JWT). Nuestro backend tiene un `SupabaseJwtGuard` que verifica que este token sea válido y seguro antes de permitir que la petición pase.

### 2. Módulos Principales
La lógica está dividida por responsabilidades:
- **Módulo de Usuarios (`users`):** Gestiona los perfiles de los usuarios y sus cambios de roles.
- **Módulo de Entrenadores (`coach`):** Exclusivo para los entrenadores. Aquí se asignan las rutinas a los pupilos y se hace el seguimiento.
- **Módulo de Administración (`admin`):** Exclusivo para administradores. Permite banear usuarios, moderar comentarios de la comunidad y ver estadísticas globales.
- **Módulo de Notificaciones (`notifications`):** Se encarga de despachar alertas dentro de la app o a través de correos electrónicos.

### 3. Conexión a Base de Datos
En lugar de escribir comandos SQL directamente en cada archivo, utilizamos un Patrón de Repositorios. Estos repositorios son los únicos que hablan con la base de datos, encapsulando la complejidad y devolviendo respuestas limpias a los servicios.

### 4. Flujo de una petición
1. **El Usuario (Frontend)** solicita, por ejemplo, "Ver mis pupilos".
2. **El Controlador (NestJS)** recibe la petición en la ruta `/api/v1/coach/clients`.
3. **El Guard (Seguridad)** revisa el token JWT y confirma que el usuario tiene el rol de "Entrenador".
4. **El Servicio (Lógica)** valida si hay reglas de negocio adicionales que aplicar.
5. **El Repositorio (Datos)** hace la consulta a la tabla correspondiente en Supabase.
6. El resultado viaja de vuelta por el mismo camino hasta el usuario.

## Pasos siguientes y evolución
Al principio, el backend cubrirá los módulos básicos para salir a producción rápidamente (MVP). Más adelante, incorporaremos características avanzadas como el uso de **Redis** para guardar datos en caché temporalmente (mejorando el rendimiento de las estadísticas) y sistemas automáticos para despliegues.
