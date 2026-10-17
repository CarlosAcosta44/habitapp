# 🛡️ Bitácora de Cambios, Reglas de Oro y Directrices de Arquitectura

Este documento consolida todo el trabajo realizado en la rama `feature/clean-architecture-migration` (Frontend) y `feature/custom-auth-migration` (Backend), así como las reglas de ingeniería, lecciones aprendidas y advertencias críticas para que las próximas sesiones y desarrolladores no rompan la arquitectura ni reintroduzcan errores ya solventados.

---

## 📌 1. Resumen de lo Realizado en Esta Rama

### A. Desconexión de Supabase y Migración a Custom Auth (NestJS)
- **Frontend Independiente:** Eliminada la dependencia del cliente JS de Supabase para login, registro y consultas directas en componentes de usuario.
- **Flujo de Autenticación JWT:** Login y registro envían credenciales a la API de NestJS (`/api/v1/auth/login`, `/api/v1/auth/register`). El backend emite un JWT firmado que el frontend almacena en una cookie HTTP-only (`auth_token`) gestionada por Server Actions de Next.js (`loginAction`, `registerAction`, `logoutAction`).
- **Middleware & Guardias:** Middleware en Next.js valida la existencia de la cookie y redirige según estado de autenticación. En el backend, las rutas protegidas usan `@UseGuards(JwtAuthGuard)` de NestJS Passport.
- **Clean Architecture en Backend:** Se refactorizaron los servicios monolíticos a repositorios específicos (`HabitsRepository`, `RecordsRepository`, `CommunityRepository`, `AdminRepository`, `CoachRepository`, `UsersRepository`), aislando las consultas a la base de datos y haciendo los servicios 100% testeables con Jest.

### B. Módulo de Hábitos y Dashboard Diario
- **Historial de Días Pasados:** Los hábitos completados o existentes en días anteriores se preservan fielmente. Al navegar en el selector de fechas semanal/calendario, los días pasados muestran los hábitos activos en esa fecha histórica y su estado de cumplimiento registrado.
- **Soft-Delete y Archivo de Hábitos:** Los hábitos no se borran físicamente si tienen historial; se marcan con estado `'Inactivo'`. El contenedor de hábitos archivados se muestra en una sección colapsable al final de la lista para mantener limpia la vista principal.
- **Persistencia de Registros Diarios:** Al marcar o desmarcar un hábito, se envía la fecha local explícita (`YYYY-MM-DD`) para evitar desfases de zona horaria (UTC vs Local).

### C. Módulo de Comunidad y Bienestar
- **Arquitectura de Pestañas:**
  - **Todo:** Vista resumen con foros destacados, hábitos compartidos, y widgets laterales de especialistas y retos.
  - **Foros:** Listado paginado/filtrado de foros y la tarjeta/botón de acción exclusiva para "Crear Foro".
  - **Hábitos Compartidos:** Muro de hábitos creados y publicados por la comunidad, con opción de agregarlos a los hábitos propios.
  - **Retos:** Vista de desafíos con recompensas reales (`puntos_recompensa`), cálculo exacto de participantes desde `comunidad.usuario_reto` y modal de inscripción interactivo.
  - **Especialistas:** Directorio de profesionales y entrenadores con opción de contacto o seguimiento.
- **Creación de Foros con Categoría Dinámica:** Modal de creación de foro permite escribir categorías personalizadas (estilo tags `#`) además de sugerencias predefinidas, validando la longitud estricta de la base de datos.
- **Subida Nativa de Imágenes:** En comentarios y foros, se reemplazó el campo de URL en texto plano por un selector nativo de archivos (`<input type="file">`). La imagen se sube mediante Server Action al bucket de Supabase Storage (`comunidad-media`) y se asocia la URL pública al comentario/publicación.
- **Conteo Real de Miembros:** El contador de comunidad refleja los miembros reales registrados/activos de la plataforma.

### D. Calidad, Testing y CI/CD
- **Pipelines en GitHub Actions 100% Verificados:**
  - **Frontend (`habitapp`):** `npm run lint` (0 errores), `npx tsc --noEmit` (0 errores de tipado), `npm run build` (31 rutas optimizadas exitosamente en modo producción).
  - **Backend (`habitapp-api`):** ESLint 9 configurado con soporte TypeScript plano, `npm run lint` (0 errores), `npm run test` (15 pruebas unitarias pasando en 4 suites con mocks de Repositorios actualizados), `npm run build` (compilación NestJS limpia).

---

## ⚠️ 2. Reglas de Oro y Advertencias Críticas (¡LEER OBLIGATORIAMENTE!)

### Regla 1: NUNCA mezclar el JWT de NestJS con el cliente Supabase
- **Advertencia:** El token JWT que emite el backend NestJS está firmado con su propio secreto (`SUPABASE_JWT_SECRET` o `JWT_SECRET`). El cliente `@supabase/supabase-js` en el navegador **NO** debe usarse para validar esta sesión, porque arrojará `"Token inválido"`.
- **Acción requerida:** Toda petición autenticada debe realizarse a través de `apiClient` hacia la API de NestJS (`http://localhost:4000/api/v1`), inyectando el header `Authorization: Bearer <token>` extraído de las cookies con `requireUserStrict()`.

### Regla 2: Preservación Sagrada del Historial de Hábitos
- **Advertencia:** NUNCA ejecutar `DELETE FROM seguimiento.registro_habitos` al eliminar o archivar un hábito. Un usuario que consulta el día de ayer, la semana pasada o el mes pasado **DEBE** ver los hábitos que completó y los que tenía asignados en esa fecha.
- **Acción requerida:**
  - El borrado de hábitos en el backend siempre debe ser un Soft-Delete: `UPDATE habitos SET estado = 'Inactivo' WHERE idhabito = ...`.
  - En el frontend, al renderizar un día pasado (`selectedDate < today`), se deben filtrar los hábitos cuya `fechaInicio <= selectedDate` y que tengan registro o hayan estado activos, sin ocultarlos por el estado actual de hoy.
  - Al completar un hábito en cualquier fecha, siempre enviar el string `YYYY-MM-DD` generado localmente (`format(date, 'yyyy-MM-dd')` o `toLocalDateString()`). NUNCA usar `new Date().toISOString()` porque en zonas horarias UTC-5/UTC-4 cambia el día después de las 7:00 PM.

### Regla 3: Restricciones de Longitud en PostgreSQL (`VARCHAR(45)`)
- **Advertencia:** En el esquema de base de datos (`comunidad.foros`), las columnas `titulo` y `categoria` son de tipo `VARCHAR(45)`. Si el frontend envía más de 45 caracteres, la base de datos rechaza la transacción con el error: `value too long for type character varying(45)`.
- **Acción requerida:**
  - Todos los inputs, esquemas Zod y DTOs de NestJS para foros deben tener un límite máximo de **45 caracteres** (`maxLength={45}`, `@MaxLength(45)`).

### Regla 4: Subida de Archivos Multimedia (Imágenes)
- **Advertencia:** NUNCA obligar al usuario final a pegar un enlace HTTP de una imagen externa.
- **Acción requerida:**
  - Usar siempre `<input type="file" accept="image/*">`.
  - La carga debe pasar por el Server Action `uploadComunidadImageAction` que envía el `FormData` al backend o al Storage de Supabase usando el Service Role Key del servidor, devolviendo una URL pública HTTPS lista para guardar en la columna `imagen_url` o `adjuntos`.

### Regla 5: Arquitectura Limpia Estricta en Frontend
```
UI (React Components) ──> Server Actions (Next.js) ──> Services (Domain Logic) ──> Repositories (HTTP / NestJS API)
```
- **Prohibido:** No llamar a `fetch()` directo en los componentes visuales ni en los Server Actions.
- **Prohibido:** No poner lógica de negocio pesada en los Server Actions (estos solo validan con Zod, resuelven auth y delegan al servicio).
- **Obligatorio:** Los servicios siempre devuelven objetos tipo `Result<T>` (`{ success: boolean, data?: T, error?: string }`).

### Regla 6: Pruebas Unitarias y Repositorios en Backend
- **Advertencia:** En `habitapp-api`, los servicios (`AdminService`, `CoachService`, `HabitsService`, etc.) inyectan **Repositorios**, no el cliente de Supabase directo.
- **Acción requerida:** Cuando crees o actualices pruebas unitarias en `*.spec.ts`, debes mockear el Repositorio correspondiente (`AdminRepository`, `CoachRepository`, etc.) con métodos `jest.fn()`, nunca reintroducir mocks de llamadas encadenadas de Supabase (`.schema().from().select().eq()`).

---

## 🎨 3. Referencia de Diseños y Próximos Pasos

Todos los diseños oficiales de Figma exportados en HTML y CSS viven en:
`.docs/4-diseno-y-assets/assets/Nuevos diseños HabitApp/`

Especial atención a las siguientes carpetas para el próximo chat:
1. `habitapp_dashboard_diario_escritorio/code.html`: Pantalla principal del dashboard diario, métricas de racha, lista de hábitos matutinos, vespertinos y nocturnos.
2. `habitapp_comunidad_y_bienestar_escritorio_vista_general/code.html`: Vista general de comunidad con sus 5 pestañas.
3. `habitapp_detalle_de_foro_escritorio_hilos_anidados/code.html`: Vista de detalle de un foro con hilos de comentarios anidados, respuestas y reacciones.
4. `habitapp_retos_y_desaf_os_escritorio/code.html`: Pantalla y catálogo completo de retos comunitarios.
5. `habitapp_especialistas_de_la_comunidad_escritorio/code.html`: Pantalla y listado de especialistas/coaches.
