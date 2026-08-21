# Plan de Migración: Supabase Auth → JWT Propio en NestJS + OAuth Social

## Diagnóstico del Estado Actual

### Lo que existe hoy

El proyecto utiliza un esquema de autenticación **distribuido y dual**, donde Supabase Auth actúa como fuente de verdad para la identidad. 
El frontend de Next.js actualmente accede de manera directa a la base de datos de Supabase para los módulos principales (hábitos, registros, perfil, amigos), mientras que otras áreas (admin, coach, comunidad) ya se están comunicando con el backend en NestJS a través de un `apiClient`.

**El punto más crítico en BD:** La tabla `gestion.usuarios` tiene una FK hacia `auth.users(id)` y triggers que dependen de él. **Todas las políticas RLS usan `auth.uid()`**.

---

## Objetivo del Plan

Desacoplar completamente Supabase Auth del sistema, manteniendo Supabase **solo como base de datos Postgres**. Convertir el proyecto en una arquitectura cliente-servidor pura donde **todo el acceso a datos y la autenticación pasen por el backend en NestJS**.

Para lograr esto sin mantener sistemas paralelos ni dependencias ocultas, se ejecutará primero la construcción de la autenticación local, seguida inmediatamente por la migración del acceso a datos, eliminando Supabase Auth y RLS de una vez por todas.

---

## Decisiones de Arquitectura

### 1. Estrategia de JWT y Almacenamiento (Frontend)

Para garantizar la seguridad y permitir que el middleware de Next.js pueda validar la sesión de forma eficiente, **ambos tokens (Access y Refresh) se almacenarán en cookies `HttpOnly`**.

- **Access Token Cookie:** `HttpOnly`, `Secure`, `SameSite=Lax`, expiración corta (ej. 15 minutos). El middleware de Next.js verificará la existencia de esta cookie para decidir si permite el paso a rutas protegidas.
- **Refresh Token Cookie:** `HttpOnly`, `Secure`, `SameSite=Strict`, con ruta restringida al endpoint de refresh (`/api/v1/auth/refresh`), expiración larga (ej. 7 a 30 días).

**Flujo en Next.js:** 
El backend NestJS enviará los headers `Set-Cookie` en la respuesta de login/refresh. El middleware y los Server Actions de Next.js simplemente reenviarán estas cookies al backend al usar el `apiClient`.

### 2. Flujo de Refresh Tokens (Backend)

- Opaque token (UUID v4) almacenado hasheado en `gestion.refresh_tokens`.
- **Rotación:** Cada vez que se usa un refresh token se emite uno nuevo y el anterior se invalida. Se implementa detección de reutilización (token family).

### 3. Flujo OAuth y Seguridad de Vinculación

- **Vinculación Condicional:** Al iniciar sesión con OAuth, si el email ya existe en `gestion.usuarios`, **solo se vinculará automáticamente si el proveedor OAuth confirma que el email está verificado** (ej. `email_verified: true`). Si no está verificado, se denegará la vinculación automática para evitar vulnerabilidades (account takeover).

### 4. Proveedor SMTP Propuesto: **Resend**

**Elección:** Se propone usar **Resend** (integrado mediante su SDK de Node o vía nodemailer).
**Justificación:** 
- Plan gratuito muy generoso (3,000 correos al mes, 100 diarios).
- API moderna y excelente Developer Experience.
- Tiempos de entrega rápidos comparados con otros planes gratuitos.
- Permite futura integración nativa con React Email.

---

## Cambios en el Esquema de Base de Datos

### Tablas a crear (nueva migración)

```sql
-- 0. Limpiar usuarios sintéticos existentes para permitir agregar columnas NOT NULL sin error
TRUNCATE TABLE gestion.usuarios CASCADE;

-- 1. Agregar columnas de autenticación propia a gestion.usuarios
ALTER TABLE gestion.usuarios
  ADD COLUMN email          VARCHAR(255) UNIQUE NOT NULL,
  ADD COLUMN password_hash  VARCHAR(255),          
  ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN estado_cuenta  VARCHAR(20) NOT NULL DEFAULT 'Activo'
    CHECK (estado_cuenta IN ('Pendiente', 'Activo', 'Suspendido'));

-- Eliminar la FK hacia auth.users
ALTER TABLE gestion.usuarios DROP CONSTRAINT usuarios_idusuario_fkey;

-- 2. Tabla de identidades OAuth
CREATE TABLE gestion.identidades (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idusuario       UUID NOT NULL REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
  provider        VARCHAR(30) NOT NULL CHECK (provider IN ('google', 'facebook', 'apple', 'local')),
  provider_id     VARCHAR(255) NOT NULL,
  provider_email  VARCHAR(255),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (provider, provider_id)
);

-- 3. Tabla de refresh tokens propios
CREATE TABLE gestion.refresh_tokens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idusuario    UUID NOT NULL REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
  token_hash   VARCHAR(255) NOT NULL UNIQUE,
  family_id    UUID NOT NULL DEFAULT gen_random_uuid(),
  expires_at   TIMESTAMP NOT NULL,
  revoked_at   TIMESTAMP,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de tokens de verificación / recuperación
CREATE TABLE gestion.verificacion_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idusuario  UUID NOT NULL REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  tipo       VARCHAR(30) NOT NULL CHECK (tipo IN ('verificacion_email', 'reset_password')),
  expires_at TIMESTAMP NOT NULL,
  used_at    TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## División en Fases de Ejecución

### Fase 1 — Auth email/password propio en NestJS

**Objetivos:**
- Reemplazar el login/registro de Supabase Auth por endpoints en NestJS (emitiendo cookies HttpOnly).
- Limpiar cuentas de prueba existentes.

**Tareas:**
- [x] 1. Ejecutar migración SQL: truncar datos de prueba, agregar columnas a `gestion.usuarios`, crear nuevas tablas, y desconectar de `auth.users`.
- [x] 2. Refactorizar `AuthModule` en NestJS usando `passport-jwt` y `passport-local`.
- [x] 3. Implementar endpoints en NestJS (`/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`) que gestionen las cookies `HttpOnly`.
- [x] 4. Integrar Resend para enviar correos transaccionales (registro, recuperación de contraseña).
- [x] 5. Frontend: Refactorizar `src/actions/auth.actions.ts` y el middleware para leer la cookie de acceso de NestJS en lugar de la sesión de `@supabase/ssr`.

---

### Fase 2 — Migración de Datos al Backend (Eliminar Supabase Auth y RLS)

**Objetivos:** El frontend de Next.js se convierte en una capa puramente de presentación y orquestación. **Cero acceso directo a Supabase desde el frontend.**

**Alcance Identificado (Repositorios actuales en Next.js a migrar):**
- `habito.repository.ts` (CRUD de hábitos).
- `registro.repository.ts` (Cumplimiento diario, rachas).
- `perfil.repository.ts` (Puntos, logros, historial).
- `amigos.repository.ts` (Relaciones, sugerencias).

**Tareas:**
- [x] 1. Crear módulos/servicios en NestJS equivalentes (ej. `HabitsModule`, `FriendsModule`).
- [x] 2. Mover la lógica de los repositorios de Next.js hacia los Repositories de NestJS.
- [x] 3. Actualizar los `Services` en el frontend para usar `apiClient` apuntando a NestJS.
- [x] 4. **Limpieza Final:** Al terminar esta fase, **Supabase Auth queda completamente eliminado del proyecto y las políticas RLS dependientes de `auth.uid()` se deshabilitan de forma definitiva.**

---

### Fase 3 — OAuth Google

**Objetivos:** Soporte de login/registro con Google vía Passport en NestJS.
**Tareas:**
- [x] 1. Configurar App en Google Cloud Console.
- [x] 2. Implementar `GoogleStrategy`.
- [x] 3. Lógica de vinculación segura: exigir `email_verified: true` del perfil de Google antes de asociarlo a un usuario existente.
- [x] 4. UI en frontend (Botón "Continuar con Google") y redirecciones con manejo de cookies post-callback.

---

### Fase 4 — OAuth Facebook

**Objetivos:** Login/registro con Facebook. Misma arquitectura que Google, implementando `FacebookStrategy`.

---

### Fase 5 — OAuth Apple (Sign in with Apple)

**Objetivos:** Login/registro con Apple.
**Consideraciones:** Requiere cuenta Apple Developer ($99/año), certificados `.p8` y entorno con HTTPS validado para el callback.
