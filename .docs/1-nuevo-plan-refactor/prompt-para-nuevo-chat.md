# 🚀 Prompt para Iniciar el Próximo Chat / Próxima Sesión

Copia y pega el siguiente bloque en el nuevo chat:

```markdown
Hola. Estamos continuando con el desarrollo de **HabitApp** en una nueva rama a partir de `develop`.

Antes de realizar cualquier acción o escribir código, **es OBLIGATORIO que te sincronices con el estado actual del proyecto**. Para ello:

1. **Revisa la Bitácora y Reglas de Oro:**
   - Lee con atención: `.docs/1-nuevo-plan-refactor/bitacora-reglas-y-directrices-arquitectura.md`.
   - Presta especial atención a las **10 Reglas de Oro** (NUNCA usar el cliente Supabase para sesiones JWT de NestJS, preservación sagrada del historial de hábitos con soft-delete y fecha local YYYY-MM-DD, límite VARCHAR(45) en foros, carga nativa de imágenes, arquitectura limpia UI -> Actions -> Services -> BaseRepository, manejo de promesas flotantes y reglas WCAG/SonarQube).

2. **Revisa la Arquitectura y Código Actual:**
   - **Frontend:** Next.js 16 (App Router), Server Actions (`src/actions/`), Servicios de dominio (`src/services/`), y Repositorios (`src/repositories/` heredando de `BaseRepository`).
   - **Backend:** NestJS en `habitapp-api` con arquitectura limpia en Repositorios y Servicios desacoplados de Supabase.

3. **Revisa los Diseños Oficiales de Referencia:**
   - Ubicados en `.docs/4-diseno-y-assets/assets/Nuevos diseños HabitApp/`
   - Vistas clave a culminar:
     - `habitapp_dashboard_diario_escritorio/code.html` (Dashboard diario, hábitos por momento del día, rachas).
     - `habitapp_comunidad_y_bienestar_escritorio_vista_general/code.html` (Comunidad: Todo, Foros, Hábitos Compartidos, Retos y Especialistas).
     - `habitapp_detalle_de_foro_escritorio_hilos_anidados/code.html` (Detalle de foro con hilos anidados).

4. **Objetivo de esta nueva sesión:**
   - Culminar y pulir al 100% las pantallas de **Hábitos (Dashboard diario)** y **Comunidad**, garantizando que los pipelines de CI (`npm run lint`, `npx tsc --noEmit`, `npm run build`) y el Quality Gate de SonarQube se mantengan siempre en verde (0 errores, 0 vulnerabilidades).

Confírmame que has leído la bitácora y entendido las 10 reglas de arquitectura para comenzar.
```
