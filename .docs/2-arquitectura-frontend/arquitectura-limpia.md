# 🏗️ Arquitectura Limpia en el Frontend (Next.js)

## Visión General

HabitApp sigue una **Arquitectura Limpia (Clean Architecture)** fuertemente influenciada por los principios de Domain-Driven Design (DDD) y adaptada al ecosistema moderno de Next.js (App Router). El objetivo principal de esta arquitectura es **desacoplar el código**, separar las responsabilidades y hacer que el sistema sea 100% testeable, escalable y tolerante a cambios en el futuro.

La regla de oro de nuestra arquitectura es la **Regla de Dependencia**:
> *Las capas internas no deben saber nada de las capas externas. El código fuente solo puede apuntar hacia adentro.*

---

## Las Capas de la Arquitectura (Estructura de Carpetas)

A continuación, se detalla **cada carpeta** de `src/` y a qué capa de la arquitectura pertenece. Esta es la organización más profesional y escalable para una aplicación Enterprise en Next.js.

### 1. Capa de Presentación (UI, React & Framework)
Es la responsable de renderizar la interfaz de usuario, manejar estados locales, capturar clics y recibir envíos de formularios.

* **`src/app/`**: Pertenece al framework Next.js. Aquí viven las Páginas, Layouts y la definición de las Rutas de la web.
* **`src/components/`**: Componentes visuales de React (`HabitCard`, `Button`, `Modal`). Son componentes "tontos" que solo reciben datos (props) y emiten eventos.
* **`src/hooks/`**: Lógica de React reutilizable (`useForm`, `useModal`). Pertenece 100% a la capa de presentación porque depende del ecosistema de React.
* **`src/actions/`**: Los *Server Actions* de Next.js. Actúan como "Controladores". **Regla estricta:** Un Server Action *no* tiene lógica de negocio. Su único trabajo es recibir el `FormData`, validarlo (con Zod) y pasárselo a la Capa de Servicios.

### 2. Capa de Servicios (Business Logic / Use Cases)
Contiene las reglas de negocio, los "Casos de Uso" de la aplicación.

* **`src/services/`**: Si el usuario quiere "Completar un Hábito", el `HabitoService` es quien orquesta todo: verifica si el usuario tiene permiso, calcula los puntos, y finalmente pide que se guarden los datos.
* **Regla estricta:** Los servicios *no* saben qué es una cookie, qué es un `FormData`, ni saben que existe una API HTTP. Reciben parámetros TypeScript puros, orquestan el negocio, y devuelven un `Result<T>`. Los Servicios delegan el guardado de datos a los Repositorios.

### 3. Capa de Acceso a Datos (Repositories & Infrastructure)
Responsable de comunicarse con el mundo exterior (en nuestro caso, la red y el backend NestJS).

* **`src/repositories/`**: **El Patrón Repositorio**. Esta carpeta aísla la comunicación HTTP. En lugar de que el `HabitoService` haga un `fetch` a la URL `/habitos`, llama a `HabitoRepository.create()`. Si mañana la URL del backend cambia, o si cambiamos NestJS por Firebase, **solo se modifica el Repositorio**, el Servicio queda intacto.
* **`src/lib/`**: Infraestructura general y utilidades cruzadas. Aquí vive nuestro `apiClient.ts` (el motor HTTP base), validadores, constantes globales y configuración de librerías de terceros. 

### 4. Capa de Dominio (Domain)
Es el "Corazón" del software. Contiene las entidades puras.

* **`src/domain/`**: Aquí viven las definiciones de negocio. Interfaces de TypeScript que modelan lo que es exactamente un `Usuario`, un `Habito`, un `Comentario`.
* **Regla estricta:** Esta capa no importa *nada* de ninguna otra capa. Es código TypeScript 100% puro.
* **`src/types/`**: (Opcional) Separada del Dominio, esta carpeta genérica solo guarda tipos de utilería técnica, como tipos del entorno global de Node, que no tienen que ver con las reglas de tu negocio.

---

## 🚫 Reglas Estrictas del Proyecto

Para mantener el código mantenible a lo largo del tiempo, todos los desarrolladores deben cumplir las siguientes reglas:

1. **PROHIBIDO acceder a bases de datos desde el Frontend:** El frontend nunca se conecta a Supabase directamente. Todo pasa por el `apiClient` hacia NestJS.
2. **Server Actions Anémicos:** Los Server Actions (`src/actions/`) solo deben validar el input y atrapar errores. Toda la lógica de negocio vive en `src/services/`.
3. **Manejo de Errores con `Result<T>`:** No usamos `throw new Error()` de forma descontrolada para la lógica de negocio. Los servicios deben devolver siempre un objeto con la estructura `{ success: boolean, data?: T, error?: string }` para que la UI sepa cómo reaccionar elegantemente.
4. **Protección de Rutas Centralizada:** Nunca confíes en que un usuario "parece" administrador en la UI. Las rutas protegidas se verifican llamando a `requireUserStrict()` que devuelve datos reales validados por el backend.
5. **Cero Dependencias Circulares:** Los componentes importan Actions. Los Actions importan Services. Los Services importan API Client y Types. **Nunca al revés.**

---

## Flujo de Ejecución Correcto (Ejemplo: Crear un Hábito)

1. El usuario hace clic en "Guardar Hábito" en el **Client Component** (`<HabitForm>`).
2. Se dispara el **Server Action** (`createHabitoAction` en `habito.actions.ts`).
3. El Action valida el `FormData` con Zod. Si falla, devuelve `{ errors }`.
4. El Action extrae el token/usuario con `requireUserStrict()`.
5. El Action llama al **Servicio** (`habitoService.crear(datos)`).
6. El Servicio aplica lógica (Ej. validar si no excedió límite de hábitos) y llama al **apiClient** (o Repositorio).
7. El **apiClient** envía el POST a NestJS y retorna el resultado.
8. La respuesta viaja de regreso: Service -> Action -> UI, y el componente muestra un Toast de éxito.
