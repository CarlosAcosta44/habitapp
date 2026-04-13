# Requerimientos del Sistema — HabitApp
## Sistema de Hábitos Saludables

---

## 1. Requerimientos Funcionales

### RF-01 · Gestión de Usuarios y Autenticación

| ID | Requerimiento |
|----|---------------|
| RF-01.1 | El sistema debe permitir el registro de usuarios con email y contraseña |
| RF-01.2 | El sistema debe soportar login y logout seguro mediante Supabase Auth |
| RF-01.3 | El sistema debe crear automáticamente un perfil de usuario al registrarse (trigger) |
| RF-01.4 | El sistema debe permitir a los usuarios editar su perfil (nombre, foto, zona horaria) |
| RF-01.5 | El sistema debe soportar tres roles: **usuario**, **entrenador** y **administrador** |
| RF-01.6 | El sistema debe proteger las rutas del dashboard para usuarios no autenticados |
| RF-01.7 | El administrador debe poder gestionar usuarios (activar, desactivar, cambiar rol) |

---

### RF-02 · Gestión de Hábitos

| ID | Requerimiento |
|----|---------------|
| RF-02.1 | El usuario debe poder crear hábitos con nombre, descripción, ícono y color |
| RF-02.2 | El usuario debe poder definir la frecuencia del hábito: diaria, semanal o personalizada |
| RF-02.3 | El usuario debe poder asignar una categoría a cada hábito (salud, nutrición, sueño, etc.) |
| RF-02.4 | El usuario debe poder editar o archivar (desactivar) sus hábitos |
| RF-02.5 | El usuario debe poder eliminar hábitos que no tengan registros asociados |
| RF-02.6 | El sistema debe mostrar únicamente los hábitos activos en la vista diaria |

---

### RF-03 · Seguimiento Diario

| ID | Requerimiento |
|----|---------------|
| RF-03.1 | El usuario debe poder marcar y desmarcar cada hábito como completado en el día actual |
| RF-03.2 | El sistema debe registrar la fecha exacta de cada cumplimiento |
| RF-03.3 | El usuario debe poder agregar una nota opcional al registrar el cumplimiento |
| RF-03.4 | El sistema debe mostrar el porcentaje de hábitos completados en el día actual |
| RF-03.5 | El sistema debe impedir el registro de un hábito archivado |

---

### RF-04 · Rachas y Estadísticas

| ID | Requerimiento |
|----|---------------|
| RF-04.1 | El sistema debe calcular y mostrar la racha actual de días consecutivos por hábito |
| RF-04.2 | El sistema debe registrar y mostrar la racha más larga histórica por hábito |
| RF-04.3 | El sistema debe mostrar un heatmap de cumplimiento de los últimos 90 días por hábito |
| RF-04.4 | El sistema debe calcular la tasa de cumplimiento (%) de cada hábito en los últimos 30 días |
| RF-04.5 | El dashboard debe mostrar KPIs globales: hábitos activos, completados hoy, tasa del día |

---

### RF-05 · Gamificación y Puntos

| ID | Requerimiento |
|----|---------------|
| RF-05.1 | El sistema debe asignar puntos automáticamente al usuario cuando complete un hábito (trigger) |
| RF-05.2 | El sistema debe definir "misiones" con condiciones y recompensas de puntos |
| RF-05.3 | El sistema debe acumular los puntos en el perfil del usuario |
| RF-05.4 | El sistema debe mostrar un ranking global de usuarios ordenado por puntos |
| RF-05.5 | El ranking debe mostrar posición, nombre de usuario, avatar y puntos totales |
| RF-05.6 | El sistema debe notificar al usuario cuando suba de posición en el ranking |

---

### RF-06 · Entrenadores Profesionales

| ID | Requerimiento |
|----|---------------|
| RF-06.1 | Un usuario con rol **entrenador** debe poder crear rutinas personalizadas de hábitos |
| RF-06.2 | El entrenador debe poder asignar rutinas a sus clientes (usuarios) |
| RF-06.3 | El entrenador debe poder ver el progreso y registros diarios de sus clientes |
| RF-06.4 | El entrenador debe poder enviar recomendaciones personalizadas a sus clientes |
| RF-06.5 | El usuario debe poder vincular o desvincular a un entrenador desde su perfil |
| RF-06.6 | El sistema debe listar los entrenadores disponibles para que los usuarios puedan contactarlos |

---

### RF-07 · Comunidad — Foros y Artículos

| ID | Requerimiento |
|----|---------------|
| RF-07.1 | El sistema debe permitir la creación de hilos de foro organizados por categorías temáticas |
| RF-07.2 | Los usuarios deben poder publicar comentarios en los hilos del foro |
| RF-07.3 | Los usuarios deben poder reaccionar (like, etc.) a comentarios y publicaciones |
| RF-07.4 | El administrador o entrenador debe poder publicar artículos educativos sobre salud y bienestar |
| RF-07.5 | Los artículos deben ser visibles para todos los usuarios registrados |
| RF-07.6 | El sistema debe organizar los artículos por categoría y permitir búsqueda por palabra clave |

---

### RF-08 · Notificaciones

| ID | Requerimiento |
|----|---------------|
| RF-08.1 | El sistema debe enviar notificaciones al usuario como recordatorio de sus hábitos pendientes |
| RF-08.2 | El sistema debe notificar al usuario cuando complete una misión y gane puntos |
| RF-08.3 | El sistema debe notificar al usuario cuando un entrenador le envíe una recomendación |
| RF-08.4 | El usuario debe poder configurar qué tipos de notificaciones desea recibir |

---

## 2. Requerimientos No Funcionales

### RNF-01 · Seguridad

| ID | Requerimiento |
|----|---------------|
| RNF-01.1 | Todos los datos de usuario deben estar protegidos mediante Row Level Security (RLS) en Supabase |
| RNF-01.2 | Ningún usuario debe poder acceder a los datos de otro usuario |
| RNF-01.3 | Las Server Actions deben validar la sesión del usuario en cada operación de escritura |
| RNF-01.4 | Las contraseñas deben ser gestionadas exclusivamente por Supabase Auth (nunca almacenadas en texto plano) |
| RNF-01.5 | La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse al cliente (browser) |

---

### RNF-02 · Rendimiento

| ID | Requerimiento |
|----|---------------|
| RNF-02.1 | Las páginas del dashboard deben cargar en menos de 2 segundos en condiciones normales |
| RNF-02.2 | El toggle de hábitos debe aplicar actualización optimista para respuesta inmediata en el cliente |
| RNF-02.3 | Las consultas a Supabase deben usar índices en las columnas `user_id` y `date` |
| RNF-02.4 | El sistema de ranking debe usar caché o vistas materializadas para evitar queries costosas en tiempo real |

---

### RNF-03 · Usabilidad

| ID | Requerimiento |
|----|---------------|
| RNF-03.1 | La interfaz debe ser responsiva y funcionar correctamente en dispositivos móviles y escritorio |
| RNF-03.2 | El diseño debe seguir la paleta de colores y componentes definidos para el proyecto |
| RNF-03.3 | Los formularios deben mostrar mensajes de error claros por campo cuando la validación falle |
| RNF-03.4 | Las acciones destructivas (eliminar hábito) deben solicitar confirmación al usuario |

---

### RNF-04 · Mantenibilidad y Arquitectura

| ID | Requerimiento |
|----|---------------|
| RNF-04.1 | El código debe seguir la arquitectura por capas: Tipos → Repositorio → Servicio → Actions → UI |
| RNF-04.2 | Toda la lógica de acceso a datos debe estar encapsulada en repositorios — nunca en componentes |
| RNF-04.3 | Toda la lógica de negocio debe estar en la capa de servicios — nunca en Server Actions directamente |
| RNF-04.4 | Los tipos de Supabase deben regenerarse (`supabase gen types`) cada vez que cambie el schema |
| RNF-04.5 | La documentación del proyecto (carpeta .planeacion) debe mantenerse actualizada con los cambios de arquitectura |

---

## 3. Requerimientos de Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `user_profiles` | Extiende `auth.users` con nombre, avatar y zona horaria |
| `habit_categories` | Categorías personalizadas por usuario (color, ícono, nombre) |
| `habits` | Hábitos del usuario con frecuencia, color, ícono y estado activo |
| `habit_records` | Registro diario de cumplimiento (único por hábito + fecha) |
| `missions` | Definición de misiones con condición y puntos de recompensa |
| `user_points` | Acumulado de puntos por usuario |
| `routines` | Rutinas creadas por entrenadores |
| `routine_habits` | Hábitos que componen una rutina |
| `user_trainers` | Relación entre usuario y entrenador |
| `forum_threads` | Hilos de foro por categoría temática |
| `forum_comments` | Comentarios en hilos con soporte de reacciones |
| `articles` | Artículos educativos publicados por entrenadores o administradores |
| `notifications` | Notificaciones internas del sistema por usuario |

---

## 4. Resumen de Módulos y Componentes Asociados

| Módulo | Funcionalidad | Descripción Arquitectónica |
|--------|--------------|----------------------------|
| Autenticación | Login, registro, control de vista | Supabase Auth + Rutas protegidas |
| Dominio | Tipos, entidades TypeScript | Modelos derivados de la BD |
| Base de datos | Schema SQL, RLS, triggers | Scripts SQL documentados en `.planeacion` |
| Acceso a datos | Consultas a Supabase | `@supabase/supabase-js` y funciones JS |
| Mutaciones | Formularios y envío de datos | Llamadas a funciones de Supabase DB |
| Interfaz | Componentes, páginas | Componentes de UI de React / Next.js |
| Rachas | Cálculo y estadísticas | Consultas interactuando con la BD |
