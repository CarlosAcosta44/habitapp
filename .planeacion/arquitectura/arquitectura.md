---

# Especificación de Arquitectura de Software
## Proyecto: Sistema de Gestión de Hábitos Saludables

### 1. Resumen de la Arquitectura
El proyecto implementa una **Arquitectura de Capas Basada en Funciones (Feature-Based Layered Architecture)** sobre el framework **Next.js**. Esta estructura separa las responsabilidades en niveles lógicos, facilitando el mantenimiento de los esquemas de base de datos (`gestion`, `seguimiento`, `comunidad`) y optimizando el renderizado mediante **React Server Components**.

---

### 2. Capas del Sistema (Estratificación)

El flujo de datos es unidireccional y sigue una jerarquía estricta para evitar el acoplamiento:



1.  **Capa de Presentación (UI):** Localizada en `src/app`. Utiliza **Route Groups** para separar contextos visuales (Autenticación vs. Dashboard) sin afectar la limpieza de las URLs.
2.  **Capa de Orquestación (Actions):** Localizada en `features/x/actions.ts`. Actúa como el controlador que valida permisos y coordina las llamadas a los servicios.
3.  **Capa de Dominio/Datos (Services):** Localizada en `features/x/services.ts`. Es la única con acceso directo al cliente de Supabase y contiene la lógica de negocio.
4.  **Capa de Persistencia (Supabase):** Base de Datos PostgreSQL con lógica embebida (Triggers y Functions) para la gestión automática de puntos y seguridad.

---

### 3. Estructura de Directorios (File Tree)

```text
src/
├── app/                  # VISTAS Y RUTAS
│   ├── (auth)/           # Grupo: Autenticación (Login, Registro)
│   │   ├── layout.tsx    # Diseño limpio y centrado
│   │   └── login/        # page.tsx (URL: /login)
│   ├── (dashboard)/      # Grupo: Aplicación Principal
│   │   ├── layout.tsx    # Diseño con Sidebar y navegación protegida
│   │   ├── habitos/      # Gestión de hábitos del usuario
│   │   ├── comunidad/    # Foros y artículos
│   │   └── entrenamiento/# Rutinas y seguimiento coach
│   └── api/              # Endpoints para integraciones externas
│
├── features/             # LÓGICA POR DOMINIO (Features)
│   ├── auth/             # Lógica de ingreso y sesiones
│   ├── habitos/          # Gestión de puntos y cumplimiento
│   ├── comunidad/        # Gestión de foros y comentarios
│   └── entrenamiento/    # Relación usuario-entrenador
│       ├── actions.ts    # Controladores (Server Actions)
│       ├── services.ts   # Capa de Acceso a Datos (DAL)
│       └── components/   # Componentes exclusivos del dominio
│
├── core/                 # CONFIGURACIÓN NUCLEO
│   ├── supabase/         # Clientes de Supabase (Server/Client)
│   └── utils/            # Funciones de ayuda globales
│
├── middleware.ts         # GUARDIA DE SEGURIDAD (Protección de rutas)
└── types/                # TIPADO (Interfaces generadas de la DB)
```

---

### 4. Estrategia de Autenticación y Seguridad

Para garantizar la integridad de los datos de salud y comunidad, se implementa una seguridad en dos niveles:

1.  **Middleware de Next.js:** Intercepta cada petición a las rutas dentro de `(dashboard)`. Si no detecta una sesión activa de Supabase, redirige automáticamente al usuario a `(auth)/login`.
2.  **Row Level Security (RLS):** En la base de datos, cada tabla tiene políticas que aseguran que, por ejemplo, Pipe solo pueda ver sus propios hábitos y no los de Ana, independientemente de lo que pida el frontend.



---

### 5. Beneficios de la Arquitectura Propuesta

* **Escalabilidad:** Al estar basado en "Features", añadir un nuevo esquema (ej. `tienda`) no requiere modificar el código existente.
* **Separación de Contextos:** El uso de `(auth)` y `(dashboard)` permite manejar layouts independientes de forma nativa en Next.js, mejorando la experiencia de usuario (UX).
* **Optimización SEO y Carga:** El uso de Server Components permite que el primer renderizado ocurra en el servidor, mejorando la velocidad percibida.

---