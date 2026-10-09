# Guía de Configuración: Proveedores, Supabase y Variables de Entorno

## Estado del sistema de emails

El backend ya tiene `MailService` implementado con Resend y lo usa en:
- **Registro:** envía email de verificación de cuenta
- **Forgot password:** envía link de recuperación (implementado en `/auth/forgot-password`)

Para desarrollo local el email falla silenciosamente (está en try/catch), así que puedes probar todo sin configurarlo.

---

## 1. Supabase — Configuración como base de datos pura

Supabase ya está funcionando como base de datos. Solo necesitas desactivar lo que ya no usamos.

### 1.1 Ejecutar migraciones pendientes

En el panel de Supabase → **SQL Editor**, ejecuta estas migraciones en orden:

```sql
-- Migración 1: ya debería estar aplicada
-- supabase/migrations/20260819000001_auth_jwt_local.sql

-- Migración 2: nueva (reemplaza 'apple' por 'microsoft')
-- supabase/migrations/20260824000001_add_microsoft_provider.sql

ALTER TABLE gestion.identidades
  DROP CONSTRAINT IF EXISTS identidades_provider_check;

ALTER TABLE gestion.identidades
  ADD CONSTRAINT identidades_provider_check
  CHECK (provider IN ('google', 'facebook', 'microsoft', 'local'));
```

### 1.2 Deshabilitar Auth de Supabase (opcional pero recomendado)

Ya no usamos `auth.uid()` en RLS. Puedes desactivar las políticas RLS que dependían de auth.uid():

```sql
-- Módulo de Gestión
ALTER TABLE gestion.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.amigos DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.notificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.logros DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.usuario_logro DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.identidades DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.refresh_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.verificacion_tokens DISABLE ROW LEVEL SECURITY;

-- Módulo de Seguimiento
ALTER TABLE seguimiento.categorias_habitos DISABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.habitos DISABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.registro_habitos DISABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.rutinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.recordatorios DISABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.usuario_rutina DISABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.entrenadores DISABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.usuario_entrenador DISABLE ROW LEVEL SECURITY;

-- Módulo de Comunidad
ALTER TABLE comunidad.foros DISABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.comentarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.articulos DISABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.reacciones DISABLE ROW LEVEL SECURITY;
```

> ⚠️ Solo hacer esto si el backend ya valida ownership en TODOS los endpoints. Si hay algún endpoint que no valida userId, primero corregirlo.

### 1.3 Obtener credenciales de Supabase

En el panel de Supabase → **Settings → API**:
- `SUPABASE_URL` → "Project URL" (ej: `https://xxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` → "service_role" key (la secreta, NO la anon)

---

## 2. Configurar OAuth Providers

### 2.1 Google OAuth

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear proyecto → **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorized redirect URIs: `http://localhost:4000/api/v1/auth/google/callback`
5. Copiar **Client ID** y **Client Secret**

Variables resultantes:
```env
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback
```

### 2.2 Facebook OAuth

1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crear App → **Consumer** → Agregar producto **Facebook Login**
3. En **Facebook Login → Settings → Valid OAuth Redirect URIs**: `http://localhost:4000/api/v1/auth/facebook/callback`
4. En **Settings → Basic**: copiar **App ID** y **App Secret**

> ⚠️ Para desarrollo local Facebook requiere que el dominio sea `localhost`. En producción necesitas HTTPS.

Variables resultantes:
```env
FACEBOOK_APP_ID=1234567890
FACEBOOK_APP_SECRET=xxxx
FACEBOOK_CALLBACK_URL=http://localhost:4000/api/v1/auth/facebook/callback
```

### 2.3 Microsoft OAuth

1. Ve a [portal.azure.com](https://portal.azure.com) → **Microsoft Entra ID → App registrations → New registration**
2. Name: `HabitApp Dev`
3. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
4. Redirect URI: **Web** → `http://localhost:4000/api/v1/auth/microsoft/callback`
5. Copiar **Application (client) ID** desde Overview
6. En **Certificates & secrets → New client secret** → copiar el valor generado

Variables resultantes:
```env
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxx~xxxx
MICROSOFT_CALLBACK_URL=http://localhost:4000/api/v1/auth/microsoft/callback
```

---

## 3. Email con Resend (desarrollo + producción)

### Para desarrollo local (sin verificar dominio)

Opción A — **Mailtrap** (recomendado para ver emails en dev): 
1. Crear cuenta en [mailtrap.io](https://mailtrap.io) → Inbox → SMTP Settings
2. Instalar: `npm install nodemailer` (si se quiere usar SMTP en vez de Resend)

Opción B — **Resend sandbox**: Crea cuenta en [resend.com](https://resend.com), el plan gratuito te deja enviar desde `onboarding@resend.dev` durante desarrollo.

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
MAIL_FROM=onboarding@resend.dev
```

### Para producción (dominio propio)
1. Verificar dominio en Resend → Settings → Domains → Add Domain
2. Agregar los registros DNS que Resend indica (SPF, DKIM)
3. Cambiar `MAIL_FROM=noreply@tudominio.com`

---

## 4. Archivos .env completos

### `habitapp-api/.env` (backend)

```env
# ── Servidor ──────────────────────────────────────────────────────────────────
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# ── Base de datos (Supabase) ──────────────────────────────────────────────────
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx

# ── JWT ───────────────────────────────────────────────────────────────────────
JWT_ACCESS_SECRET=un_secreto_muy_largo_y_aleatorio_minimo_32_chars
JWT_REFRESH_SECRET=otro_secreto_diferente_y_largo_minimo_32_chars

# ── Email (Resend) ────────────────────────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxx
MAIL_FROM=onboarding@resend.dev

# ── OAuth Google ──────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# ── OAuth Facebook ────────────────────────────────────────────────────────────
FACEBOOK_APP_ID=1234567890
FACEBOOK_APP_SECRET=xxxx
FACEBOOK_CALLBACK_URL=http://localhost:4000/api/v1/auth/facebook/callback

# ── OAuth Microsoft ───────────────────────────────────────────────────────────
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxx~xxxx
MICROSOFT_CALLBACK_URL=http://localhost:4000/api/v1/auth/microsoft/callback

# ── Sentry (opcional en dev) ──────────────────────────────────────────────────
SENTRY_DSN=
```

### `habitapp/.env` (frontend Next.js)

```env
# ── API Backend ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# ── Supabase (solo para tablas que aún use el frontend directamente) ──────────
# Si ya migraste todo al backend, estas variables ya no son necesarias
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx

# ── URLs ──────────────────────────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000

# ── Sentry (opcional en dev) ──────────────────────────────────────────────────
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 5. Flujo de prueba local (paso a paso)

1. Configura los `.env` de ambos proyectos con las variables reales
2. Inicia el backend: `cd habitapp-api && npm run start:dev`
3. Inicia el frontend: `cd habitapp && npm run dev`
4. Prueba en orden:
   - **Login/Registro email**: `http://localhost:3000/login`
   - **Google OAuth**: clic en botón Google → autoriza → redirige a `/dashboard`
   - **Facebook OAuth**: igual (requiere que tu usuario sea tester en la app de Facebook mientras está en modo dev)
   - **Microsoft OAuth**: igual
5. Para probar emails: registra una cuenta y revisa Mailtrap o Resend dashboard

---

## 6. Notas importantes para Facebook en desarrollo

Facebook en modo desarrollo solo permite que usuarios que sean **Administradores, Desarrolladores o Testers** de la app inicien sesión. Para añadir testers:
- Meta for Developers → Tu App → **Roles → Testers → Add Testers** (con el email de Facebook del tester)

Para ir a producción, la app necesita pasar la **App Review** de Meta (proceso que puede tomar días).

---

## 7. Checklist antes de hacer el primer test completo

- [ ] Migración SQL de `microsoft` ejecutada en Supabase
- [ ] `.env` del backend con todas las variables
- [ ] `.env` del frontend con `NEXT_PUBLIC_API_URL`
- [ ] App de Google configurada con redirect URI correcto
- [ ] App de Facebook configurada con redirect URI correcto
- [ ] App de Microsoft registrada en Azure con redirect URI correcto
- [ ] API key de Resend (o usar dummy key para ignorar emails en dev)
- [ ] Backend corriendo en `localhost:4000`
- [ ] Frontend corriendo en `localhost:3000`
