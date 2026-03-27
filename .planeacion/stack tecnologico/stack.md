# 🛠️ Stack Tecnológico — Sistema de Hábitos Saludables

## Visión General

El **Sistema de Hábitos Saludables** está construido sobre un stack moderno, escalable y orientado a la productividad del equipo de desarrollo. Cada tecnología fue seleccionada para cumplir un rol específico dentro de la arquitectura, garantizando rendimiento, seguridad y una experiencia de desarrollo fluida.

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE / FRONTEND                │
│                      Next.js 14+                     │
├─────────────────────────────────────────────────────┤
│               BACKEND AS A SERVICE (BaaS)            │
│                       Supabase                       │
│        (Auth · Database · Storage · Realtime)        │
├─────────────────────────────────────────────────────┤
│                  INFRAESTRUCTURA / NUBE              │
│               Amazon Web Services (AWS)              │
├─────────────────────────────────────────────────────┤
│              CONTROL DE VERSIONES Y FLUJO            │
│         Git  ·  GitHub  ·  Gitflow  ·  Commits       │
│                    Semánticos                        │
└─────────────────────────────────────────────────────┘
```

---

## 1. 🔷 Next.js — Framework de Frontend

### ¿Qué es?

Next.js es un framework de React orientado a producción que permite construir aplicaciones web con renderizado del lado del servidor (SSR), generación estática (SSG) y rutas de API integradas.

### ¿Por qué lo usamos?

| Característica | Beneficio para el proyecto |
|----------------|---------------------------|
| **App Router** | Gestión de rutas clara y escalable por módulos (gestión, seguimiento, comunidad) |
| **Server Components** | Mejor rendimiento al reducir el JavaScript enviado al cliente |
| **API Routes** | Endpoints internos sin necesidad de un backend separado para lógica ligera |
| **SSR / SSG** | Carga rápida de páginas públicas (artículos, ranking, foros) con SEO optimizado |
| **Middleware** | Control de acceso por rol (Usuario, Entrenador, Administrador) a nivel de rutas |
| **TypeScript nativo** | Tipado estricto para mayor confiabilidad del código |

### Estructura de módulos en Next.js

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── habitos/
│   ├── reportes/
│   └── perfil/
├── comunidad/
│   ├── foros/
│   ├── ranking/
│   └── articulos/
└── admin/
    ├── usuarios/
    └── moderacion/
```

### Rol en el proyecto

- Renderiza la interfaz de usuario para los tres módulos del sistema.
- Gestiona la navegación y protección de rutas según el rol del usuario.
- Consume los servicios de Supabase desde el cliente y el servidor.
- Desplegado en AWS para producción.

---

## 2. 🟩 Supabase — Backend as a Service

### ¿Qué es?

Supabase es una plataforma open source que ofrece base de datos PostgreSQL, autenticación, almacenamiento de archivos, funciones serverless y comunicación en tiempo real, todo a través de una API REST y cliente JavaScript.

### ¿Por qué lo usamos?

| Servicio | Uso en el proyecto |
|----------|--------------------|
| **PostgreSQL** | Base de datos relacional robusta para los tres módulos (gestión, seguimiento, comunidad) |
| **Auth** | Registro, inicio de sesión, recuperación de contraseña y gestión de roles (CU1–CU9) |
| **Realtime** | Actualización en tiempo real del ranking global y notificaciones de la comunidad |
| **Storage** | Almacenamiento de fotos de perfil y archivos multimedia de artículos |
| **Edge Functions** | Automatizaciones como asignación de puntos al completar hábitos y creación de perfil al registrarse |
| **Row Level Security (RLS)** | Control de acceso a datos por rol directamente desde la base de datos |

### Rol en el proyecto

- Única fuente de verdad para todos los datos de la aplicación.
- Gestiona la autenticación y autorización de los tres tipos de actores.
- Ejecuta la lógica de negocio crítica mediante triggers y edge functions.
- Se comunica con Next.js a través del SDK oficial `@supabase/supabase-js`.

---

## 3. ☁️ AWS — Infraestructura en la Nube

### ¿Qué es?

Amazon Web Services (AWS) es la plataforma de servicios en la nube más utilizada del mundo, que ofrece infraestructura escalable, segura y de alta disponibilidad para alojar y operar aplicaciones.

### ¿Por qué lo usamos?

| Servicio AWS | Uso en el proyecto |
|-------------|-------------------|
| **AWS Amplify** | Despliegue continuo de la aplicación Next.js con CI/CD integrado |
| **Amazon CloudFront** | CDN global para distribución rápida de assets estáticos y páginas |
| **Amazon S3** | Respaldo y almacenamiento adicional de archivos estáticos y backups |
| **Amazon SES** | Envío de correos transaccionales (recuperación de contraseña, notificaciones) |
| **AWS IAM** | Gestión de permisos y acceso seguro a los recursos de la nube |
| **Amazon CloudWatch** | Monitoreo de logs, métricas y alertas de la aplicación en producción |

### Arquitectura de despliegue

```
Usuario Final
     │
     ▼
CloudFront (CDN)
     │
     ├──► AWS Amplify (Next.js App)
     │         │
     │         ▼
     │    Supabase (DB + Auth + Storage)
     │
     └──► Amazon S3 (Assets estáticos)
               │
               ▼
          Amazon SES (Emails)
```

### Flujo de despliegue

1. El equipo hace `push` a la rama `main` en GitHub.
2. AWS Amplify detecta el cambio y ejecuta el pipeline de build automáticamente.
3. Next.js es compilado y desplegado en los servidores de Amplify.
4. CloudFront distribuye el contenido globalmente con baja latencia.
5. CloudWatch monitorea el estado de la aplicación en tiempo real.

### Rol en el proyecto

- Provee la infraestructura de producción donde vive la aplicación.
- Garantiza escalabilidad automática ante picos de tráfico.
- Asegura alta disponibilidad (99.99% uptime SLA de AWS).
- Centraliza el monitoreo y logging del sistema en producción.

---

## 4. 🐙 GitHub — Repositorio y Colaboración

### ¿Qué es?

GitHub es la plataforma de alojamiento de repositorios Git más utilizada del mundo, diseñada para facilitar la colaboración en equipos de desarrollo mediante control de versiones, revisión de código y automatización.

### ¿Por qué lo usamos?

| Característica | Beneficio para el proyecto |
|----------------|---------------------------|
| **Repositorio centralizado** | Única fuente de verdad del código fuente del proyecto |
| **Pull Requests** | Proceso formal de revisión de código antes de integrar cambios |
| **GitHub Actions** | Pipelines de CI/CD para pruebas automáticas y despliegue |
| **Issues & Projects** | Gestión de tareas, bugs y planificación del backlog |
| **Branch Protection** | Reglas para que `main` y `develop` solo reciban código revisado |
| **Code Review** | Revisión colaborativa con comentarios, aprobaciones y solicitudes de cambio |

### Configuración de ramas protegidas

```
main
  ✅ Requiere Pull Request con al menos 1 aprobación
  ✅ Requiere que los checks de CI pasen
  ❌ No permite push directo

develop
  ✅ Requiere Pull Request
  ✅ Requiere que los checks de CI pasen
  ❌ No permite push directo
```

### Rol en el proyecto

- Aloja el repositorio oficial del proyecto.
- Coordina el flujo de trabajo entre los miembros del equipo.
- Integra con AWS Amplify para despliegues automáticos.
- Mantiene el historial completo de cambios del código.

---

## 5. 🌿 Gitflow — Estrategia de Ramificación

### ¿Qué es?

Gitflow es una estrategia de gestión de ramas (branching strategy) que define un modelo estricto y predecible para organizar el desarrollo, las releases y las correcciones de errores de un proyecto.

### ¿Por qué lo usamos?

Permite al equipo trabajar en paralelo de forma ordenada, garantizando que el código en producción siempre sea estable y que las nuevas funcionalidades pasen por un proceso de revisión antes de llegar al usuario final.

### Estructura de ramas

```
main ──────────────────────────────────────── (producción estable)
  │
  └── develop ────────────────────────────── (integración continua)
        │
        ├── feature/cu1-crear-perfil
        ├── feature/cu13-registrar-habito
        ├── feature/cu28-participar-foros
        │
        ├── release/v1.0.0 ──────────────── (preparación de release)
        │
        └── hotfix/fix-login-error ───────── (corrección urgente)
```

### Tipos de ramas y su propósito

| Tipo de rama | Prefijo | Propósito | Se fusiona en |
|---|---|---|---|
| **Main** | `main` | Código en producción | — |
| **Develop** | `develop` | Integración de features | `main` (en release) |
| **Feature** | `feature/` | Desarrollo de nuevas funcionalidades | `develop` |
| **Release** | `release/` | Preparación y QA de una versión | `main` + `develop` |
| **Hotfix** | `hotfix/` | Corrección urgente en producción | `main` + `develop` |

### Convención de nombres de ramas

```bash
# Features (nuevas funcionalidades)
feature/cu1-crear-perfil
feature/cu13-registrar-cumplimiento-habito
feature/cu28-participar-foros
feature/cu33-crear-foros

# Releases
release/v1.0.0
release/v1.1.0

# Hotfixes
hotfix/fix-auth-token-expiry
hotfix/fix-ranking-calculation
```

### Flujo de trabajo típico

```
1. Crear rama desde develop:
   git checkout develop
   git checkout -b feature/crear-habito-personalizado

2. Desarrollar la funcionalidad con commits semánticos

3. Abrir Pull Request hacia develop en GitHub

4. Revisión de código por otro miembro del equipo

5. Merge a develop tras aprobación

6. Cuando develop está listo para release:
   git checkout -b release/v1.0.0

7. QA y correcciones menores en la rama release

8. Merge a main → despliegue en producción
   Merge a develop → sincronización
```

### Rol en el proyecto

- Garantiza que el código en `main` siempre sea estable y desplegable.
- Permite que múltiples desarrolladores trabajen en diferentes casos de uso simultáneamente.
- Define un proceso claro de revisión antes de integrar cualquier cambio.

---

## 6. ✍️ Git Semántico — Convención de Commits

### ¿Qué es?

Git Semántico (o Conventional Commits) es una especificación para los mensajes de commit que establece un formato estandarizado, legible y procesable automáticamente. Facilita la generación de changelogs y el versionado semántico.

### ¿Por qué lo usamos?

- El historial de commits se convierte en documentación del proyecto.
- Facilita la generación automática de `CHANGELOG.md`.
- Permite determinar automáticamente el tipo de versión (MAJOR, MINOR, PATCH).
- Mejora la comunicación dentro del equipo sobre qué hace cada cambio.

### Formato del mensaje de commit

```
<tipo>(<alcance>): <descripción corta>

[cuerpo opcional]

[footer opcional: referencia a issue/tarea]
```

### Tipos de commits

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad | `feat(auth): implementar CU1 - crear perfil de usuario` |
| `fix` | Corrección de bug | `fix(habitos): corregir cálculo de racha al cambiar zona horaria` |
| `docs` | Cambios en documentación | `docs(readme): actualizar instrucciones de instalación` |
| `style` | Formato, sin cambio de lógica | `style(comunidad): corregir indentación en componente Foro` |
| `refactor` | Refactorización sin nuevo feature ni fix | `refactor(ranking): optimizar consulta SQL de puntos` |
| `test` | Añadir o modificar pruebas | `test(auth): agregar tests para recuperación de contraseña` |
| `chore` | Tareas de mantenimiento | `chore(deps): actualizar supabase-js a v2.45.0` |
| `perf` | Mejora de rendimiento | `perf(seguimiento): cachear reportes de estadísticas` |
| `ci` | Cambios en CI/CD | `ci(github-actions): agregar step de análisis de código` |

### Ejemplos aplicados al proyecto

```bash
# Módulo: Gestión de usuarios
feat(auth): implementar CU1 - registro y creación de perfil de usuario
feat(auth): agregar CU2 - flujo completo de inicio de sesión con Supabase
fix(auth): corregir redireccionamiento tras recuperación de contraseña (CU3)
feat(usuarios): implementar CU9 - eliminación de usuario por administrador

# Módulo: Seguimiento de hábitos
feat(habitos): agregar CU13 - registro de cumplimiento diario de hábito
feat(habitos): implementar CU14 - generación automática de racha por trigger
feat(notificaciones): agregar CU16 y CU17 - configuración y envío de recordatorios
feat(reportes): implementar CU18 - panel de reportes y estadísticas de progreso

# Módulo: Comunidad
feat(foros): implementar CU33 - creación de foros por usuario
feat(ranking): agregar CU24 - visualización del ranking global con puntos
fix(comunidad): corregir conteo de puntos al participar en foros (CU32)
feat(admin): implementar CU37 - eliminación de usuario o publicación inapropiada
```

### Versionado semántico resultante

```
MAJOR.MINOR.PATCH

MAJOR → commits con "BREAKING CHANGE" en el footer
MINOR → commits de tipo "feat"
PATCH → commits de tipo "fix"

Ejemplos:
v1.0.0 → Primera versión en producción
v1.1.0 → Se añaden nuevas features (CU nuevos)
v1.1.1 → Se corrige un bug en producción
v2.0.0 → Cambio que rompe compatibilidad hacia atrás
```

### Rol en el proyecto

- Mantiene el historial de Git limpio, legible y autodocumentado.
- Facilita la revisión de Pull Requests al entender el propósito de cada commit.
- Permite automatizar la generación de notas de versión (release notes).

---

## Resumen del Stack

| Tecnología | Categoría | Responsabilidad principal |
|------------|-----------|--------------------------|
| **Next.js** | Frontend | Interfaz de usuario, rutas, SSR, consumo de APIs |
| **Supabase** | Backend / BaaS | Base de datos, autenticación, almacenamiento, triggers, realtime |
| **AWS** | Infraestructura | Despliegue, CDN, emails, monitoreo, escalabilidad |
| **GitHub** | Repositorio | Código fuente, PRs, CI/CD, gestión de tareas |
| **Gitflow** | Flujo de trabajo | Estrategia de ramas para desarrollo paralelo y ordenado |
| **Git Semántico** | Convención | Mensajes de commit estandarizados y versionado automático |

---

## Flujo Completo de Desarrollo

```
Tarea asignada (GitHub Issues / Projects)
          │
          ▼
Crear rama feature/ desde develop (Gitflow)
          │
          ▼
Desarrollar con commits semánticos (Git Semántico)
          │
          ▼
Push a GitHub + abrir Pull Request
          │
          ▼
Revisión de código por el equipo (GitHub)
          │
          ▼
Merge a develop tras aprobación (Gitflow)
          │
          ▼
Release branch → QA → Merge a main (Gitflow)
          │
          ▼
AWS Amplify detecta push a main → Build automático
          │
          ▼
CloudFront distribuye la nueva versión globalmente (AWS)
          │
          ▼
Supabase sirve datos en tiempo real a los usuarios finales
```