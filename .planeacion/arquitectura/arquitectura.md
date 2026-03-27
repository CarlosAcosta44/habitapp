# 🏗️ Arquitectura del Sistema — Hábitos Saludables

> Documento técnico que describe la arquitectura, capas, stack tecnológico y estructura del sistema.

---

## 📐 Tipo de Arquitectura

El sistema sigue una arquitectura MVC por capas (Layered MVC), separando responsabilidades en capas bien definidas que facilitan el mantenimiento, la escalabilidad y las pruebas del sistema.
┌─────────────────────────────────────┐
│           Cliente / Browser         │  ← Capa de Presentación
├─────────────────────────────────────┤
│         Controladores (API)         │  ← Capa de Control
├─────────────────────────────────────┤
│       Lógica de Negocio / Servicios │  ← Capa de Servicios
├─────────────────────────────────────┤
│         Modelos / Repositorios      │  ← Capa de Datos
├─────────────────────────────────────┤
│          Base de Datos              │  ← Capa de Persistencia
└─────────────────────────────────────┘
---

## 🧩 Módulos del Sistema
Sistema de Hábitos Saludables
│
├── 📁 Módulo de Gestión
│     ├── Usuarios
│     ├── Roles (usuario, entrenador, administrador)
│     ├── Notificaciones
│     └── Sistema de Puntos
│
├── 📁 Módulo de Seguimiento
│     ├── Hábitos
│     ├── Registros Diarios
│     ├── Perfiles de Salud
│     ├── Rutinas
│     └── Relación Usuario–Entrenador
│
└── 📁 Módulo de Comunidad
      ├── Foros
      ├── Comentarios
      ├── Artículos
      └── Reacciones
---

## 🔄 Flujo General del Sistema
Usuario
  │
  ▼
[Interfaz Web / App]
  │
  ▼
[Controlador / Endpoint API]
  │
  ├──► Autenticación y autorización (rol del usuario)
  │
  ▼
[Capa de Servicios]
  │
  ├──► Lógica de hábitos, puntos, comunidad, etc.
  │
  ▼
[Capa de Datos / Repositorios]
  │
  ▼
[Base de Datos]
  │
  └──► Triggers automáticos:
        ├── Creación de perfil al registrarse
        └── Asignación de puntos al completar hábito
---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | Por definir | Interfaz web / app del usuario |
| Backend | Por definir | API REST o GraphQL |
| Base de Datos | Por definir | Relacional recomendada (PostgreSQL / MySQL) |
| Autenticación | Por definir | JWT / OAuth2 |
| Hosting / Deploy | Por definir | Cloud o servidor propio |

---

## 🗄️ Estructura de la Base de Datos

### Módulo de Gestión

| Tabla | Descripción |
|---|---|
| usuarios | Información base de todos los usuarios |
| roles | Tipos de rol: usuario, entrenador, administrador |
| usuario_rol | Relación entre usuario y rol asignado |
| notificaciones | Alertas y mensajes del sistema |
| puntos | Historial de puntos acumulados por usuario |

### Módulo de Seguimiento

| Tabla | Descripción |
|---|---|
| habitos | Catálogo de hábitos disponibles |
| habitos_usuario | Hábitos asignados a cada usuario |
| registros_diarios | Cumplimiento diario de hábitos |
| perfil_salud | Datos de salud del usuario (peso, edad, etc.) |
| rutinas | Rutinas creadas por entrenadores |
| entrenador_usuario | Relación entre entrenador y sus clientes |

### Módulo de Comunidad

| Tabla | Descripción |
|---|---|
| foros | Categorías o temas de discusión |
| publicaciones | Posts dentro de los foros |
| comentarios | Respuestas a publicaciones |
| articulos | Contenido educativo publicado |
| reacciones | Likes o reacciones a publicaciones y artículos |

---

## ⚙️ Automatizaciones (Triggers)

| # | Trigger | Evento | Acción |
|---|---|---|---|
| 1 | trg_crear_perfil | INSERT en usuarios | Crea automáticamente el perfil de salud del usuario |
| 2 | trg_asignar_puntos | INSERT en registros_diarios | Asigna puntos al usuario al completar un hábito |

---

## 🔐 Roles y Permisos

| Rol | Acceso |
|---|---|
| Usuario | Gestionar sus hábitos, ver ranking, participar en comunidad |
| Entrenador | Todo lo anterior + crear rutinas y gestionar clientes |
| Administrador | Acceso total: usuarios, contenido, configuración del sistema |

---

> Carlos:
## 📁 Estructura de Carpetas
/sistema-habitos-saludables
│
├── /frontend
│     ├── /components
│     ├── /pages
│     ├── /services
│     └── /assets
│
├── /backend
│     ├── /controllers
│     ├── /services
│     ├── /models
│     ├── /routes
│     └── /middlewares
│
├── /database
│     ├── /migrations
│     ├── /seeds
│     └── /triggers
│
└── /docs
      ├── arquitectura.md
      └── planeacion.md
---

*Documento de arquitectura — Sistema de Hábitos Saludables*
