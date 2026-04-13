# Contexto y Planeación General — HabitApp (Sistema de Gestión de Hábitos Saludables)

Este documento centraliza y resume el contexto del proyecto basándose en los documentos de arquitectura, base de datos, casos de uso, objetivos, requerimientos y stack tecnológico presentes en la carpeta `.planeacion`.

---

## 🚀 1. Visión General y Objetivos
**HabitApp** es una plataforma digital diseñada para ayudar a las personas a mejorar su calidad de vida a través del seguimiento de hábitos positivos. El sistema utiliza **gamificación** (puntos y rachas) para mantener la motivación de los usuarios y fomenta la interacción social mediante un módulo de **comunidad**. Además, permite la vinculación con **entrenadores** para asesoría profesional.

### Roles del Sistema
1. **Usuario:** Actor principal. Registra hábitos, reporta cumplimiento, interactúa en foros y acumula puntos.
2. **Entrenador:** Profesional que asigna rutinas personalizadas y supervisa el progreso de sus clientes.
3. **Administrador:** Modera la comunidad, gestiona usuarios y contenido destacado.

---

## 🏗️ 2. Arquitectura y Stack Tecnológico
El proyecto se basa en una **Arquitectura de 4 Capas por Dominio (Feature-Based Layered Architecture)**.

- **Frontend:** Next.js 14+ (App Router) con estilización a través de **Tailwind CSS**. Uso de React Server Components, Server Actions y separaciones por dominios (features).
- **Gestión de Estado:** Arquitectura minimalista sin dependencias extra (sin Redux, Zustand, etc.). El estado pesado (hábitos, rachas, puntos) se gestiona vía *Server Actions* y la caché nativa de Next.js. *React Context* se usa solo para datos de sesión del usuario autenticado.
- **Diseño UI/UX:** Enfoque orientado a móviles (similar a una App nativa), con adaptación a escritorio. Los prototipos están en la carpeta de documentación (`/Diseños`).
- **Backend (BaaS):** Supabase (PostgreSQL, Auth, Storage, Edge Functions). Única fuente de verdad para persistencia con seguridad por RLS y automatizaciones mediante triggers.
- **Validación:** Zod en las Server Actions para validar la entrada antes de tocar la lógica de negocio.
- **Manejo de Errores:** Patrón `Result<T>` en servicios y repositorios — sin excepciones no capturadas, los errores son valores explícitos.
- **Infraestructura:** Despliegue estático en Amazon Web Services (AWS S3) con Static HTML Export de Next.js.
- **Colaboración:** Git/GitHub con Gitflow manual y commits semánticos.

### Flujo de Capas (unidireccional y estricto)

```
UI / Page (Server Component)
  └── Server Action       ← Valida sesión + valida datos con Zod
        └── Service        ← Lógica de negocio y reglas de dominio
              └── Repository ← Única capa que habla con Supabase
                    └── Supabase (PostgreSQL + RLS + Triggers)
```

### Estructura de Carpetas

```
src/
├── app/                   # Rutas y páginas (Next.js App Router)
│   ├── (auth)/            # Grupo público: login, registro
│   └── (dashboard)/       # Grupo protegido: hábitos, comunidad
├── actions/               # Server Actions (controladores)
├── services/              # Lógica de negocio por dominio
├── repositories/          # Acceso a datos — solo queries a Supabase
├── lib/supabase/          # Clientes de Supabase (server, client, middleware)
├── types/
│   ├── database.types.ts  # Generado por Supabase CLI (no editar)
│   ├── domain/            # Entidades, DTOs e interfaces del negocio
│   └── common/            # Result<T>, paginación y utilidades
└── middleware.ts           # Protección de rutas por sesión
```

### Reglas entre capas

| Capa | Puede llamar a | No puede llamar a |
|---|---|---|
| **UI / Page** | Actions, muestra datos | Services, Repositories, Supabase |
| **Server Action** | Service | Repository, Supabase directo |
| **Service** | Repository | Otro Service, Supabase directo |
| **Repository** | Supabase Client | Nada más |

---

## 📦 3. Módulos y Alcance (Casos de Uso)

### A. Gestión de Usuarios (CU1 - CU9)
- Registro y autenticación mediante Supabase Auth.
- Perfiles generados automáticamente vía Triggers en PostgreSQL.
- Administración de roles (Usuario, Entrenador, Admin).
- Gestión y actualización de la información personal de cada usuario.

### B. Seguimiento de Hábitos (CU10 - CU23)
- Creación, edición y eliminación de hábitos con frecuencias customizables y categorías.
- Registro de cumplimiento diario.
- Lógica de Gamificación: Cálculo de rachas continuas y asignación automática de puntos basados en triggers.
- Seguimiento personalizado por parte de entrenadores autorizados.

### C. Comunidad (CU24 - CU38)
- Ranking global gamificado basado en puntos.
- Listado de amistades y red social.
- Foros de discusión por categorías temáticas y soporte para artículos educativos.
- Moderación de contenido por creadores de foros y administradores.

---

## 📅 4. Planeación Sugerida de Desarrollo (Fases)

Basado en las dependencias técnicas, se sugiere abordar el desarrollo en las siguientes fases (Sprints/Milestones):

### Fase 1: Fundamentos y Base de Datos
- Creación del esquema de base de datos en Supabase ejecutando los scripts SQL (`1. Esquemas`, `2. Restricciones`, `3. Indices`).
- Configuración de políticas de seguridad (RLS).
- Inserción de datos sintéticos (`4. Script Datos Sinteticos`).
- Setup del repositorio GitHub (configuración de protecciones en `main` y `develop`).

### Fase 2: Autenticación y Estructura Base Next.js
- Inicialización del proyecto Next.js y configuración de la arquitectura (`src/app`, `features/`, `core/`).
- Integración de Supabase Auth en el cliente y servidor.
- Implementación de middlewares para protección de rutas `(auth)` vs `(dashboard)`.
- Vistas de login, registro, y recuperación de contraseñas.

### Fase 3: Módulo de Seguimiento de Hábitos (Core)
- CRUD de hábitos personalizados y categorías.
- Interfaz gráfica principal (Dashboard) para visualizar hábitos del día.
- Implementación del registro de cumplimiento diario (Toggle optimista).
- Funciones de base de datos (Triggers) para cálculo de rachas y puntos básicos.

### Fase 4: Gamificación y Comunidad
- Implementación visual de los puntos y el ranking global.
- Creación de perfiles públicos de usuario.
- Desarrollo de los foros de discusión, comentarios y reacciones.
- Gestión de amigos y artículos.

### Fase 5: Módulo de Entrenadores
- Vistas específicas para el rol de entrenador.
- Funcionalidad de asignar rutinas a usuarios.
- Dashboard de entrenador para visualizar el avance de sus clientes.

### Fase 6: Pulido, Notificaciones y Despliegue
- Implementación de automatizaciones y notificaciones (recordatorios).
- Pruebas exhaustivas y QA.
- Exportación del proyecto (`next build` -> `out/`).
- Despliegue en AWS S3.
