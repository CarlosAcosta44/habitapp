---

# Especificación de Arquitectura de Software
## Proyecto: Sistema de Gestión de Hábitos Saludables

### 1. Resumen de la Arquitectura
El proyecto implementa una **Arquitectura de 4 Capas por Dominio** sobre el framework **Next.js 14+**, con **Tailwind CSS** como sistema de estilos. Esta estructura separa las responsabilidades en niveles lógicos y estrictos, garantizando que cada capa solo se comunique con la inmediatamente inferior, evitando el acoplamiento y facilitando el mantenimiento.

---

### 2. Flujo de Capas (Unidireccional y Estricto)

```
UI / Page (Server Component)
  └── Server Action       ← Valida sesión + valida datos con Zod
        └── Service        ← Lógica de negocio y reglas de dominio
              └── Repository ← Única capa que habla con Supabase
                    └── Supabase (PostgreSQL + RLS + Triggers)
```

#### Responsabilidad de cada capa

| Capa | Responsabilidad | No puede hacer |
|---|---|---|
| **UI / Page** | Renderizar datos, enviar formularios | Llamar a Services, Repositories o Supabase |
| **Server Action** | Verificar sesión, validar con Zod, llamar al Service | Llamar a Repositories o Supabase directamente |
| **Service** | Lógica de negocio, reglas de dominio, coordinar Repositories | Llamar a Supabase directamente ni a otros Services |
| **Repository** | Ejecutar queries a Supabase, devolver `Result<T>` | Contener lógica de negocio |

---

### 3. Estructura de Directorios (File Tree)

```text
src/
├── app/                        # RUTAS Y PÁGINAS (Next.js App Router)
│   ├── (auth)/                 # Grupo: Autenticación (Login, Registro)
│   │   ├── layout.tsx          # Diseño limpio y centrado
│   │   ├── login/page.tsx      # URL: /login
│   │   └── register/page.tsx   # URL: /register
│   ├── (dashboard)/            # Grupo: Aplicación Principal (protegida)
│   │   ├── layout.tsx          # Layout con Sidebar y navegación
│   │   ├── habitos/page.tsx    # Vista diaria de hábitos
│   │   ├── comunidad/          # Foros, artículos, ranking
│   │   └── perfil/page.tsx     # Perfil del usuario
│   └── admin/                  # Panel de administrador
│
├── actions/                    # SERVER ACTIONS (Controladores)
│   ├── auth.actions.ts         # Login, registro, logout
│   ├── habit.actions.ts        # Crear, editar, archivar hábitos
│   ├── habit-record.actions.ts # Toggle de cumplimiento diario
│   ├── profile.actions.ts      # Actualizar perfil
│   └── community.actions.ts    # Foros, comentarios, artículos
│
├── services/                   # CAPA DE DOMINIO (Lógica de Negocio)
│   ├── habit.service.ts
│   ├── habit-record.service.ts
│   ├── user-profile.service.ts
│   ├── gamification.service.ts
│   ├── streak.service.ts
│   └── community.service.ts
│
├── repositories/               # ACCESO A DATOS (Solo queries a Supabase)
│   ├── habit.repository.ts
│   ├── habit-record.repository.ts
│   ├── user-profile.repository.ts
│   ├── gamification.repository.ts
│   └── community.repository.ts
│
├── lib/
│   └── supabase/               # CLIENTES DE SUPABASE
│       ├── server.ts           # Para Server Components y Actions
│       ├── client.ts           # Para Client Components
│       └── middleware.ts       # Para el middleware de rutas
│
├── types/                      # TIPADO GLOBAL
│   ├── database.types.ts       # Generado por Supabase CLI (no editar manualmente)
│   ├── domain/                 # Entidades y DTOs del negocio
│   │   ├── user.types.ts
│   │   ├── habit.types.ts
│   │   ├── record.types.ts
│   │   ├── gamification.types.ts
│   │   └── community.types.ts
│   └── common/
│       ├── result.types.ts     # Patrón Result<T>
│       └── pagination.types.ts
│
├── components/                 # COMPONENTES REUTILIZABLES DE UI
│   ├── layout/                 # Sidebar, Topbar, etc.
│   ├── habits/                 # HabitCard, DailyProgress, StreakBadge
│   └── forms/                  # Formularios reutilizables
│
└── middleware.ts               # GUARDIA DE SEGURIDAD (Protección de rutas)
```

---

### 4. Patrones Clave

#### Patrón Result\<T\>
Toda operación de repositorio o servicio que puede fallar devuelve `Result<T>` en lugar de lanzar excepciones. Hace los errores explícitos y predecibles.

```typescript
// src/types/common/result.types.ts
export type Result<T> = { ok: true; data: T } | { ok: false; error: string; code?: string }
```

#### Validación con Zod (en Server Actions)
Toda entrada de usuario se valida con Zod antes de pasarla al servicio:
```typescript
const schema = z.object({ name: z.string().min(1).max(100) })
const parsed = schema.safeParse(Object.fromEntries(formData))
if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
```

#### Inyección del Cliente Supabase
Los repositorios reciben el cliente de Supabase como parámetro (no lo crean internamente). El servicio es quien lo crea con `await createClient()`.

---

### 5. Estrategia de Autenticación y Seguridad

Se implementa seguridad en dos niveles:

1. **Middleware de Next.js (`src/middleware.ts`):** Intercepta cada petición. Si no detecta sesión activa, redirige a `/login`. Si hay sesión y el usuario intenta acceder a `/login`, redirige al dashboard.
2. **Row Level Security (RLS) en Supabase:** Cada tabla tiene políticas que garantizan que los usuarios solo accedan a sus propios datos, independientemente de lo que pida el frontend.
3. **Verificación en cada Server Action:** Además del middleware, cada mutación verifica la sesión con `supabase.auth.getUser()` antes de ejecutar.

---

### 6. Beneficios de la Arquitectura

* **Separación de responsabilidades:** Cada capa tiene un único propósito claro y no conoce los detalles de implementación de las demás.
* **Testabilidad:** Los repositorios se pueden mockear fácilmente para probar los servicios sin base de datos.
* **Mantenibilidad:** Si Supabase cambia su API o se migra a otra DB, solo se modifican los repositorios.
* **Seguridad:** Las Server Actions nunca exponen la lógica de negocio al cliente y siempre validan la sesión.
* **Escalabilidad:** Agregar un nuevo módulo (ej. `tienda`) solo requiere crear sus propios archivos de types, repository, service y actions sin tocar el código existente.

---