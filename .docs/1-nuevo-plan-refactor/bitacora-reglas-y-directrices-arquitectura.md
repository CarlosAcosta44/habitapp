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

### E. Auditoría de Seguridad, Calidad de Código y SonarQube / SonarCloud
- **Remoción de Secretos y Vulnerabilidades Bloqueantes (`secrets:S8215`):**
  - Se eliminó el hash bcrypt de contraseñas de demostración en `.docs/3-base-datos-y-sql/scripts/sql/seguridad/1. RLS_Politicas.sql`, reemplazándolo por `<HASH_DE_CONTRASEÑA_TEMPORAL>`, resolviendo la alerta de seguridad crítica en GitHub Advanced Security y SonarCloud (Security Rating A).
- **Configuración Centralizada de Sonar (`sonar-project.properties`):**
  - Se configuró el archivo raíz excluyendo documentación, scripts SQL de referencia, mocks y assets para enfocar el análisis de calidad estrictamente en `src/`.
- **Eliminación de Código Duplicado (DRY) con `BaseRepository`:**
  - Se creó `src/repositories/base.repository.ts` implementando métodos HTTP reutilizables (`get`, `post`, `put`, `patch`, `delete`) con tipado genérico `Result<T>`.
  - Se refactorizaron los 10 repositorios (`admin`, `amigos`, `auth`, `coach`, `comunidad`, `habito`, `notification`, `registro`, `reportes`, `usuario`) para extender de `BaseRepository`, reduciendo la duplicación a menos del 1.5% (umbral de SonarQube: 3.0%).
- **Manejo Estricto de Promesas Flotantes (`typescript:S9383`):**
  - Corrección de promesas sin manejar en `ForoDetalleInteractiveView`, `HabitDetailModal`, `ArchivedHabitsModal`, `NewHabitModal`, `CreateForoModal` y `ShareHabitModal`, marcándolas con `void` explícito o envolviéndolas en `startTransition` / `await`.
- **Accesibilidad y Semántica WCAG (`typescript:S1082`, `S6848`, `S1077`):**
  - Reemplazo de `div` con `onClick` en backdrops de modales por botones accesibles o contenedores semánticos con `role="presentation"`.
  - Inclusión de `aria-hidden="true"` en todos los iconos SVG decorativos.
- **Reducción de Complejidad Cognitiva y Limpieza de Código Muerto:**
  - Descomposición de componentes complejos (`HabitItemCard`, `MotivationalBanner`, `DashboardInteractiveView`, `ActiveChallengesWidget`, `StreakWidget`).
  - Eliminación de ternarios anidados (`S3358`), imports no utilizados (`S1128`) y variables asignadas sin uso (`S1854`).
  - Verificación de CI local: `npm run lint` (0 errores), `npx tsc --noEmit` (0 errores) y `npm run build` (31 rutas optimizadas limpias).

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
UI (React Components) ──> Server Actions (Next.js) ──> Services (Domain Logic) ──> Repositories (BaseRepository / NestJS API)
```
- **Prohibido:** No llamar a `fetch()` directo en los componentes visuales ni en los Server Actions.
- **Prohibido:** No poner lógica de negocio pesada en los Server Actions (estos solo validan con Zod, resuelven auth y delegan al servicio).
- **Obligatorio:** Los servicios y repositorios siempre devuelven objetos tipo `Result<T>` (`{ success: boolean, data?: T, error?: string }`).

### Regla 6: Pruebas Unitarias y Repositorios en Backend
- **Advertencia:** En `habitapp-api`, los servicios (`AdminService`, `CoachService`, `HabitsService`, etc.) inyectan **Repositorios**, no el cliente de Supabase directo.
- **Acción requerida:** Cuando crees o actualices pruebas unitarias en `*.spec.ts`, debes mockear el Repositorio correspondiente (`AdminRepository`, `CoachRepository`, etc.) con métodos `jest.fn()`, nunca reintroducir mocks de llamadas encadenadas de Supabase (`.schema().from().select().eq()`).

### Regla 7: Cero Secretos o Hashes Reales en el Repositorio (SonarQube Security Rating A)
- **Advertencia:** GitHub Secret Scanning y SonarCloud detectan automáticamente cualquier string con estructura de hash bcrypt (`$2b$10$...`), contraseñas en claro o tokens, bloqueando el Quality Gate.
- **Acción requerida:** En archivos `.sql`, `.md`, scripts o seeds de prueba, nunca escribir hashes reales; usar placeholders explicativos como `<HASH_DE_CONTRASEÑA_TEMPORAL>`.

### Regla 8: Manejo Obligatorio de Promesas Flotantes (`typescript:S9383`)
- **Advertencia:** Dejar llamadas a funciones asíncronas sin `await`, sin capturar errores o sin el operador `void` hace fallar la fiabilidad (Reliability) en SonarCloud.
- **Acción requerida:** En manejadores de eventos o llamadas secundarias que no retornan promesas al llamador, usar `void funcionAsincrona().catch(...)` o envolver en `startTransition(async () => { await ... })`.

### Regla 9: Accesibilidad y Semántica en Modales e Iconos (`typescript:S1082`, `S6848`, `S1077`)
- **Advertencia:** SonarQube penaliza elementos `<div>` interactivos con `onClick` sin listeners de teclado o roles semánticos.
- **Acción requerida:**
  - Backdrops de modales deben estructurarse usando `<button type="button" aria-label="Cerrar modal" ...>` o contenedores con `role="presentation"` que ignoren clics en el contenido interno.
  - Todo icono SVG decorativo debe llevar explícitamente el atributo `aria-hidden="true"`.

### Regla 10: Reutilización de Repositorios con `BaseRepository`
- **Advertencia:** Replicar bloques idénticos de `fetch` con parseo de JSON en cada repositorio dispara la métrica de código duplicado de SonarQube por encima del 3.0%.
- **Acción requerida:** Todo nuevo repositorio debe extender de `BaseRepository<T>` y utilizar `this.get()`, `this.post()`, `this.put()`, `this.patch()`, `this.delete()`.

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
