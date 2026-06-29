# HabitApp — Sistema de Gestión de Hábitos Saludables

HabitApp es una plataforma web diseñada para ayudar a las personas a mejorar su calidad de vida mediante el seguimiento y gestión de hábitos positivos. El sistema incorpora un motor de gamificación basado en puntos y rachas, un módulo de comunidad con foros y artículos educativos, y soporte para entrenadores profesionales que pueden asignar rutinas personalizadas a sus clientes.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Roles del Sistema](#roles-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Ejecución en Desarrollo](#ejecución-en-desarrollo)
- [Construcción para Producción](#construcción-para-producción)
- [Despliegue](#despliegue)
- [Convención de Commits](#convención-de-commits)
- [Flujo de Ramas (Gitflow)](#flujo-de-ramas-gitflow)
- [Módulos Implementados](#módulos-implementados)

---

## Descripción General

HabitApp permite a los usuarios:

- Registrar y personalizar hábitos diarios en categorías como salud, nutrición, sueño e hidratación.
- Marcar hábitos como completados y visualizar el progreso mediante heatmaps y estadísticas de racha.
- Acumular puntos y competir en un ranking global.
- Participar en foros de discusión y leer artículos educativos.
- Vincularse con entrenadores profesionales para recibir rutinas personalizadas y seguimiento.

---

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **Usuario** | Actor principal. Registra hábitos, reporta cumplimiento, interactúa en foros y acumula puntos. |
| **Entrenador** | Profesional que asigna rutinas personalizadas y supervisa el progreso de sus clientes. |
| **Administrador** | Modera la comunidad, gestiona usuarios y configura la plataforma. |

---

## Stack Tecnológico

| Tecnología | Categoria | Rol en el proyecto |
|------------|----------|--------------------|
| Next.js 16+ (App Router) | Framework Frontend | Rutas, SSR, Server Components, Server Actions |
| React 19 | Librería UI | Componentes de interfaz |
| TypeScript 5 | Lenguaje | Tipado estricto en todo el código fuente |
| Tailwind CSS 4 | Estilos | Sistema de diseño y estilos de los componentes |
| Supabase | BaaS | Base de datos PostgreSQL, autenticación, storage y triggers |
| Zod 4 | Validación | Validación de entradas en Server Actions |
| Framer Motion | Animaciones | Transiciones y micro-animaciones de la UI |
| Lucide React | Iconografía | Iconos de la interfaz |
| NestJS | Backend API | Arquitectura modular para operaciones privilegiadas |
| Vercel / Railway / Fly | Infraestructura | Despliegue frontend y backend por ambientes |

---

## Arquitectura

El frontend implementa una **Arquitectura de 4 Capas por Dominio**, donde el flujo de datos es estrictamente unidireccional. Para el backend, la decisión oficial es una **arquitectura modular NestJS inspirada en Clean Architecture**, sin replicar carpetas `domain/`, `application/`, `infrastructure/` y `presentation/` por cada módulo.

```
UI / Page (Server Component)
  └── Server Action         <- Valida sesión y datos con Zod
        └── Service          <- Lógica de negocio y reglas de dominio
              └── Repository  <- Unica capa que habla con Supabase
                    └── Supabase (PostgreSQL + RLS + Triggers)
```

### Responsabilidad de cada capa

| Capa | Responsabilidad | Restricciones |
|------|----------------|---------------|
| UI / Page | Renderizar datos, invocar Server Actions | No llama a Services, Repositories ni Supabase directamente |
| Server Action | Verificar sesión, validar con Zod, delegar al Service | No llama a Repositories ni a Supabase directamente |
| Service | Aplicar reglas de negocio, coordinar operaciones | No llama a Supabase directamente ni a otros Services |
| Repository | Ejecutar queries y devolver `Result<T>` | No contiene lógica de negocio |

### Patrones clave

**Patrón `Result<T>`** — Todas las operaciones de repositorios y servicios retornan un tipo discriminado en lugar de lanzar excepciones. Los errores son valores explícitos y predecibles.

```typescript
// src/lib/result.ts
export type Result<T> =
  | { success: true;  data: T }
  | { success: false; error: string };
```

**Validación con Zod** — Toda entrada de usuario se valida en la capa de Server Actions antes de llegar al dominio.

**Seguridad en dos niveles**:
1. `middleware.ts` en Next.js: redirige a `/login` si no hay sesión activa.
2. Row Level Security (RLS) en Supabase: garantiza que cada usuario solo acceda a sus propios datos, independientemente del frontend.
3. Verificación de sesión en cada Server Action con `supabase.auth.getUser()`.

---

## Estructura del Proyecto

```
src/
├── app/                        # Rutas y paginas (Next.js App Router)
│   ├── (auth)/                 # Rutas publicas: login, registro, recuperacion de contrasena
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── update-password/
│   └── (dashboard)/            # Rutas protegidas por sesion
│       ├── habitos/            # Vista diaria y CRUD de habitos
│       ├── comunidad/          # Foros y ranking
│       ├── entrenador/         # Panel del entrenador
│       ├── perfil/             # Perfil del usuario
│       ├── reportes/           # Estadisticas y reportes
│       ├── retos/              # Modulo de retos
│       └── ajustes/            # Configuracion de cuenta
│
├── actions/                    # Server Actions (capa de presentacion servidor)
│   ├── auth.actions.ts
│   ├── habito.actions.ts
│   ├── registro.actions.ts
│   ├── comunidad.actions.ts
│   ├── entrenador.actions.ts
│   ├── amigos.actions.ts
│   └── seguridad.actions.ts
│
├── services/                   # Logica de negocio por dominio
│   ├── habito.service.ts
│   ├── registro.service.ts
│   ├── comunidad.service.ts
│   ├── entrenador.service.ts
│   ├── reportes.service.ts
│   └── amigos.service.ts
│
├── repositories/               # Acceso a datos — solo queries a Supabase
│   ├── habito.repository.ts
│   ├── registro.repository.ts
│   ├── comunidad.repository.ts
│   ├── entrenador.repository.ts
│   ├── reportes.repository.ts
│   └── amigos.repository.ts
│
├── components/                 # Componentes de UI reutilizables
│   ├── layout/                 # Sidebar, Topbar y estructura general
│   ├── habitos/                # HabitCard, DailyProgress, StreakBadge
│   ├── comunidad/              # Componentes de foros y articulos
│   ├── entrenador/             # Componentes del panel de entrenador
│   ├── forms/                  # Formularios reutilizables
│   └── modals/                 # Modales de la aplicacion
│
├── lib/
│   ├── result.ts               # Patron Result<T> para manejo de errores
│   ├── interfaces/
│   │   └── repository.interface.ts  # Contratos base de repositorios
│   └── supabase/
│       ├── server.ts           # Cliente para Server Components y Actions
│       ├── client.ts           # Cliente para Client Components
│       └── middleware.ts       # Cliente para el middleware de rutas
│
├── types/
│   ├── database.types.ts       # Generado por Supabase CLI — no editar manualmente
│   ├── domain/                 # Entidades y DTOs del negocio
│   │   ├── habito.types.ts
│   │   ├── registro.types.ts
│   │   ├── comunidad.types.ts
│   │   ├── entrenador.types.ts
│   │   └── reportes.types.ts
│   └── common/                 # Tipos utilitarios compartidos
│
├── hooks/                      # Custom React Hooks
│
└── middleware.ts               # Guardia global de rutas por sesion
```

---

## Requisitos Previos

Antes de clonar e instalar el proyecto, asegurarse de tener instalado:

- **Node.js** v20 o superior — [https://nodejs.org](https://nodejs.org)
- **npm** v10 o superior (incluido con Node.js)
- Una cuenta en **Supabase** con un proyecto configurado — [https://supabase.com](https://supabase.com)
- El schema de base de datos aplicado (ver carpeta `.docs/base-datos/sql/`)

---

## Variables de Entorno

Crear un archivo `.env.local` en la raiz del proyecto con las siguientes variables. Estos valores se obtienen desde el panel de configuracion del proyecto en Supabase (Settings > API).

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

> La variable `SUPABASE_SERVICE_ROLE_KEY` nunca debe incluirse en el cliente ni exponerse al navegador. Solo se utiliza en entornos de servidor controlados.

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/<organizacion>/habitapp.git
cd habitapp

# 2. Instalar dependencias
npm install
```

---

## Ejecución en Desarrollo

```bash
npm run dev
```

La aplicacion estara disponible en [http://localhost:3000](http://localhost:3000).

El servidor de desarrollo incluye hot-reload. Cualquier cambio en los archivos se refleja automaticamente sin necesidad de reiniciar.

---

## Construcción para Producción

Este proyecto se construye con Next.js para despliegue frontend en Vercel o plataforma equivalente. El backend NestJS se despliega como API independiente en Railway, Fly o plataforma equivalente.

```bash
# Generar el build de produccion
npm run build
```

Para verificar el build localmente antes de desplegarlo:

```bash
npm run start
```

---

## Despliegue

Pasos generales:
1. Ejecutar `npm run build` y validar que el frontend compile correctamente.
2. Publicar previews por Pull Request desde Vercel o plataforma equivalente.
3. Desplegar producción desde `main`.
4. Desplegar el backend NestJS como API independiente.
5. Configurar variables de entorno de Supabase solo en los ambientes correspondientes.

---

## Convención de Commits

El proyecto usa **Conventional Commits** para mantener un historial de Git limpio y autodocumentado.

```
<tipo>(<alcance>): <descripcion corta>
```

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de bug |
| `docs` | Cambios en documentacion |
| `style` | Formato, sin cambio de logica |
| `refactor` | Refactorizacion sin nuevo feature ni fix |
| `test` | Agregar o modificar pruebas |
| `chore` | Tareas de mantenimiento o dependencias |
| `perf` | Mejora de rendimiento |
| `ci` | Cambios en CI/CD |

Ejemplos:

```bash
feat(auth): implementar registro de usuario con Supabase Auth
fix(habitos): corregir calculo de racha al cambiar zona horaria
docs(readme): actualizar instrucciones de instalacion
chore(deps): actualizar supabase-js a v2.45.0
```

---

## Flujo de Ramas (Gitflow)

```
main ──────────────────────────────── (produccion estable)
  └── develop ────────────────────── (integracion continua)
        ├── feature/be-users-module
        ├── feature/fe-auth-hardening
        ├── chore/be-setup-ci
        ├── bugfix/fe-foro-navigation
        ├── release/1.0.0
        └── hotfix/fix-login-error
```

| Tipo | Prefijo | Proposito | Se fusiona en |
|------|---------|-----------|---------------|
| Main | `main` | Codigo en produccion | — |
| Develop | `develop` | Integracion de features | `main` en release |
| Feature | `feature/` | Desarrollo de nuevas funcionalidades | `develop` |
| Bugfix | `bugfix/` | Correcciones no urgentes | `develop` |
| Chore | `chore/` | Mantenimiento, documentación y CI/CD | `develop` |
| Release | `release/` | Preparacion y QA de una version | `main` y `develop` |
| Hotfix | `hotfix/` | Correccion urgente en produccion | `main` y `develop` |

---

## Módulos Implementados

| Modulo | Estado | Descripcion |
|--------|--------|-------------|
| Autenticacion | Completo | Login, registro, recuperacion de contrasena, middleware de rutas |
| Gestion de habitos | Completo | CRUD de habitos con categorias, frecuencias y metas diarias |
| Seguimiento diario | Completo | Toggle de cumplimiento, registro con notas y progreso |
| Rachas y estadisticas | Completo | Calculo de rachas, heatmap de 90 dias y tasa de cumplimiento |
| Gamificacion | Completo | Puntos por cumplimiento via triggers, ranking global |
| Comunidad | Completo | Foros de discusion por categoria, articulos educativos |
| Perfil de usuario | Completo | Edicion de informacion personal y visualizacion de estadisticas |
| Reportes | Completo | Panel de estadisticas y progreso del usuario |
| Entrenadores | Parcial | Asignacion de rutinas y seguimiento de clientes (en progreso) |
| Administracion | Pendiente | Gestion de usuarios y moderacion de contenido |
 
