# 📋 Casos de Uso — Sistema de Hábitos Saludables

## Descripción General

El **Sistema de Hábitos Saludables** es una plataforma digital que ayuda a las personas a mejorar su calidad de vida mediante el seguimiento, control y motivación en la adopción de hábitos positivos. Combina herramientas de productividad personal, interacción social y acompañamiento profesional.

El sistema está organizado en **tres módulos principales**:

| Módulo | Descripción |
|--------|-------------|
| 🔐 Gestión de Usuarios | Administra el registro, autenticación y roles de los usuarios |
| 📊 Seguimiento de Hábitos | Controla hábitos, registros diarios y progreso personal |
| 🌐 Comunidad | Gestiona foros, artículos e interacción social entre usuarios |

### Actores del sistema

- **Usuario**: Actor principal. Registra hábitos, participa en la comunidad y consulta su progreso.
- **Entrenador**: Especialista que hace seguimiento a sus clientes y sugiere hábitos personalizados. Hereda los permisos del Usuario.
- **Administrador**: Gestiona la plataforma, modera contenido y administra roles y usuarios.

---

## Módulo 1: Gestión de Usuarios

> Abarca todos los procesos relacionados con el ciclo de vida de una cuenta: creación, autenticación, personalización y administración.

### CU1 — Crear perfil

- **Actor(es):** Usuario
- **Descripción:** El usuario se registra en la plataforma proporcionando sus datos personales (nombre, correo, contraseña, etc.). Al completar el registro, el sistema crea automáticamente un perfil asociado mediante un trigger interno.
- **Resultado:** Cuenta activa con perfil creado y rol de Usuario asignado por defecto.

---

### CU2 — Iniciar sesión

- **Actor(es):** Usuario, Entrenador, Administrador
- **Descripción:** El usuario ingresa sus credenciales (correo y contraseña) para autenticarse en el sistema y acceder a las funcionalidades según su rol.
- **Relaciones:** Es extendido por CU3 (Recuperar contraseña) cuando el usuario no recuerda sus credenciales.
- **Resultado:** Sesión activa con acceso a las funciones disponibles según el rol.

---

### CU3 — Recuperar contraseña

- **Actor(es):** Usuario
- **Descripción:** Cuando el usuario no puede iniciar sesión por haber olvidado su contraseña, puede solicitar un proceso de recuperación (por ejemplo, enlace enviado al correo registrado).
- **Relaciones:** *«extend»* de CU2.
- **Resultado:** El usuario recibe instrucciones para restablecer su contraseña.

---

### CU4 — Actualizar datos

- **Actor(es):** Usuario
- **Descripción:** El usuario puede modificar su información personal dentro de la plataforma, como nombre, foto de perfil, datos de contacto u objetivos de bienestar.
- **Relaciones:** *«extend»* hacia CU7 (Revisar información de usuarios), ya que los cambios pueden ser auditados por el administrador.
- **Resultado:** Información del perfil actualizada correctamente en el sistema.

---

### CU5 — Modificar roles

- **Actor(es):** Administrador
- **Descripción:** El administrador puede cambiar el rol asignado a un usuario existente (por ejemplo, promover a un usuario como Entrenador o revocar permisos).
- **Relaciones:** *«include»* CU6 (Asignar roles), ya que toda modificación de rol implica una reasignación.
- **Resultado:** El usuario afectado recibe los permisos correspondientes al nuevo rol.

---

### CU6 — Asignar roles

- **Actor(es):** Administrador
- **Descripción:** El administrador asigna un rol específico a un usuario en el momento de su registro o cuando es necesario un cambio. Los roles disponibles son: Usuario, Entrenador y Administrador.
- **Relaciones:** Es incluido por CU5 (Modificar roles).
- **Resultado:** Usuario con rol correctamente definido en el sistema.

---

### CU7 — Revisar información de usuarios

- **Actor(es):** Administrador
- **Descripción:** El administrador puede consultar y auditar la información registrada por los usuarios en la plataforma, garantizando la integridad y veracidad de los datos.
- **Relaciones:** Es extendido por CU4 (Actualizar datos) y CU8 (Cambiar contraseña).
- **Resultado:** Vista completa de los datos del usuario consultado.

---

### CU8 — Cambiar contraseña

- **Actor(es):** Usuario
- **Descripción:** Desde la configuración de su cuenta, el usuario puede cambiar su contraseña actual por una nueva, siempre que conozca la contraseña vigente.
- **Relaciones:** *«extend»* de CU7.
- **Resultado:** Contraseña actualizada y sesión mantenida o reiniciada según configuración.

---

### CU9 — Eliminar usuario

- **Actor(es):** Administrador
- **Descripción:** El administrador puede eliminar de forma permanente la cuenta de un usuario de la plataforma, por ejemplo, en casos de violación de términos de uso.
- **Resultado:** Cuenta y datos asociados eliminados del sistema.

---

## Módulo 2: Seguimiento de Hábitos

> Núcleo funcional del sistema. Permite a los usuarios registrar, gestionar y monitorear sus hábitos diarios, con soporte de entrenadores y validación por parte de administradores.

### CU10 — Ver hábitos activos

- **Actor(es):** Usuario
- **Descripción:** El usuario puede consultar el listado de todos sus hábitos actualmente activos, junto con su estado de cumplimiento del día.
- **Resultado:** Lista de hábitos activos con indicadores de progreso.

---

### CU11 — Eliminar hábito

- **Actor(es):** Usuario
- **Descripción:** El usuario puede eliminar un hábito de su lista, ya sea porque lo completó permanentemente o porque ya no desea hacerle seguimiento.
- **Resultado:** Hábito eliminado del perfil del usuario.

---

### CU12 — Editar hábito

- **Actor(es):** Usuario
- **Descripción:** El usuario puede modificar los parámetros de un hábito existente, como su nombre, frecuencia, descripción o meta asociada.
- **Resultado:** Hábito actualizado con los nuevos parámetros definidos.

---

### CU13 — Registrar cumplimiento de hábito

- **Actor(es):** Usuario
- **Descripción:** El usuario marca como completado un hábito en el día actual. Este registro es el insumo principal del sistema de seguimiento y del mecanismo de puntuación.
- **Relaciones:** *«extend»* hacia CU14 (Generar racha), ya que cumplimientos consecutivos pueden activar una racha.
- **Resultado:** Cumplimiento registrado, puntos asignados automáticamente por trigger del sistema.

---

### CU14 — Generar racha

- **Actor(es):** Sistema (disparado automáticamente)
- **Descripción:** Cuando el usuario cumple un hábito de forma consecutiva durante varios días, el sistema genera o incrementa una racha, que sirve como motivación adicional y puede otorgar puntos extra.
- **Relaciones:** *«extend»* de CU13.
- **Resultado:** Racha actualizada en el perfil del usuario.

---

### CU15 — Crear hábito personalizado

- **Actor(es):** Usuario
- **Descripción:** El usuario puede definir un hábito completamente nuevo, especificando nombre, descripción, categoría (ejercicio, nutrición, sueño, hidratación, salud mental, etc.), frecuencia y meta.
- **Resultado:** Nuevo hábito creado y añadido a la lista de hábitos activos del usuario.

---

### CU16 — Configurar recordatorios

- **Actor(es):** Usuario
- **Descripción:** El usuario puede activar y personalizar recordatorios para sus hábitos, definiendo hora, frecuencia y canal de notificación preferido.
- **Relaciones:** *«extend»* hacia CU17 (Enviar notificaciones), que se ejecuta automáticamente según la configuración establecida.
- **Resultado:** Recordatorios configurados y programados en el sistema.

---

### CU17 — Enviar notificaciones

- **Actor(es):** Sistema
- **Descripción:** El sistema envía notificaciones automáticas al usuario en los momentos configurados para recordarle completar sus hábitos pendientes del día.
- **Relaciones:** *«extend»* de CU16.
- **Resultado:** Notificación entregada al usuario mediante el canal configurado.

---

### CU18 — Ver reportes y estadísticas

- **Actor(es):** Usuario
- **Descripción:** El usuario puede acceder a gráficas y estadísticas de su progreso: porcentajes de cumplimiento, días activos, rachas históricas y evolución en el tiempo.
- **Relaciones:** *«extend»* hacia CU19 (Realizar seguimiento a clientes), que permite al Entrenador ver reportes de sus usuarios asignados.
- **Resultado:** Panel de estadísticas con visualizaciones del progreso personal.

---

### CU19 — Realizar seguimiento a clientes

- **Actor(es):** Entrenador
- **Descripción:** El entrenador puede revisar el progreso de los usuarios que tiene a su cargo, consultando sus reportes, rachas y cumplimiento de hábitos para brindar retroalimentación oportuna.
- **Relaciones:** *«extend»* de CU18.
- **Resultado:** El entrenador obtiene una vista del progreso de cada cliente asignado.

---

### CU20 — Ver progreso de usuarios

- **Actor(es):** Entrenador
- **Descripción:** El entrenador puede visualizar de forma consolidada el avance general de todos sus clientes, identificando a quienes necesitan mayor atención o motivación.
- **Resultado:** Resumen del progreso de todos los clientes del entrenador.

---

### CU21 — Sugerir hábitos personalizados

- **Actor(es):** Entrenador
- **Descripción:** Con base en el perfil y progreso del usuario, el entrenador puede enviarle sugerencias de nuevos hábitos adaptados a sus objetivos y necesidades particulares.
- **Resultado:** Sugerencia de hábito recibida por el usuario, quien puede aceptarla o descartarla.

---

### CU22 — Revisar catálogo de hábitos

- **Actor(es):** Administrador
- **Descripción:** El administrador puede consultar y gestionar el catálogo general de hábitos disponibles en la plataforma, añadiendo, editando o eliminando opciones del catálogo base.
- **Resultado:** Catálogo de hábitos actualizado y disponible para los usuarios.

---

### CU23 — Validar hábitos reportados

- **Actor(es):** Administrador
- **Descripción:** El administrador puede revisar y validar los hábitos personalizados creados por los usuarios, asegurando que el contenido sea apropiado y coherente con la misión de la plataforma.
- **Resultado:** Hábito aprobado o rechazado con notificación al usuario correspondiente.

---

## Módulo 3: Comunidad

> Facilita la interacción social entre usuarios, fomenta la motivación colectiva y permite a entrenadores y administradores gestionar el contenido de la plataforma.

### CU24 — Ver ranking

- **Actor(es):** Usuario
- **Descripción:** El usuario puede consultar el ranking global de la plataforma, donde se ordenan los usuarios según los puntos acumulados por completar hábitos y participar en la comunidad.
- **Resultado:** Tabla de clasificación actualizada con la posición del usuario consultante.

---

### CU25 — Agregar amigo

- **Actor(es):** Usuario
- **Descripción:** El usuario puede enviar solicitudes de amistad a otros usuarios de la plataforma para construir su red social dentro del ecosistema.
- **Resultado:** Solicitud de amistad enviada; si es aceptada, ambos usuarios quedan vinculados.

---

### CU26 — Ver lista de amigos

- **Actor(es):** Usuario
- **Descripción:** El usuario puede consultar su lista de amigos dentro de la plataforma, ver su actividad reciente y acceder a sus perfiles públicos.
- **Resultado:** Lista de amigos con información básica de actividad.

---

### CU27 — Ver foros

- **Actor(es):** Usuario
- **Descripción:** El usuario puede explorar los foros disponibles en la comunidad, organizados por categorías temáticas como ejercicio, nutrición, salud mental, entre otros.
- **Resultado:** Lista de foros activos disponibles para lectura y participación.

---

### CU28 — Participar en foros

- **Actor(es):** Usuario, Administrador
- **Descripción:** El usuario puede unirse a un foro y realizar publicaciones, compartiendo experiencias, preguntas o reflexiones con el resto de la comunidad.
- **Relaciones:** *«include»* CU26 (Ver lista de amigos) como contexto social; es extendido por CU29 (Comentar en foros).
- **Resultado:** Publicación registrada y visible para todos los participantes del foro.

---

### CU29 — Comentar en foros

- **Actor(es):** Usuario
- **Descripción:** El usuario puede responder a publicaciones existentes dentro de un foro, generando conversaciones e intercambio de ideas.
- **Relaciones:** *«extend»* de CU28.
- **Resultado:** Comentario publicado y asociado al hilo correspondiente.

---

### CU30 — Ver artículos o publicaciones

- **Actor(es):** Usuario
- **Descripción:** El usuario puede acceder al apartado de artículos informativos sobre salud, bienestar y desarrollo personal disponibles en la plataforma.
- **Resultado:** Artículo desplegado con su contenido completo.

---

### CU31 — Ver sugerencia de hábitos populares

- **Actor(es):** Usuario
- **Descripción:** La plataforma presenta al usuario una lista de hábitos populares o tendencia dentro de la comunidad, para inspirarlo a adoptar nuevas rutinas saludables.
- **Resultado:** Lista de hábitos recomendados según popularidad en la comunidad.

---

### CU32 — Ganar puntos por participación

- **Actor(es):** Usuario
- **Descripción:** El sistema otorga puntos automáticamente al usuario cuando participa activamente en la comunidad (publicando en foros, comentando, reaccionando a artículos, etc.), alimentando el ranking global.
- **Resultado:** Puntos acreditados al perfil del usuario y ranking actualizado.

---

### CU33 — Crear foros

- **Actor(es):** Usuario
- **Descripción:** Un usuario puede crear un nuevo foro temático dentro de la comunidad, definiendo su nombre, descripción y categoría. Al crear el foro, asume el rol de moderador de ese espacio.
- **Relaciones:** *«extend»* hacia CU34 (Moderar comentarios o usuarios en su foro).
- **Resultado:** Nuevo foro publicado y disponible para que otros usuarios participen.

---

### CU34 — Moderar comentarios o usuarios en su foro

- **Actor(es):** Usuario (creador del foro)
- **Descripción:** El creador de un foro puede moderar el contenido publicado en él, eliminando comentarios inapropiados o restringiendo el acceso a usuarios que incumplan las normas del espacio.
- **Relaciones:** *«extend»* de CU33.
- **Resultado:** Foro moderado con contenido apropiado para su comunidad.

---

### CU35 — Supervisar comunidad

- **Actor(es):** Administrador
- **Descripción:** El administrador supervisa de manera general toda la actividad de la comunidad, revisando foros, publicaciones y comportamiento de usuarios para garantizar un entorno sano y seguro.
- **Relaciones:** *«include»* CU36 (Revisar foros y artículos); *«extend»* hacia CU37 (Eliminar usuario o publicación inapropiada).
- **Resultado:** Estado actualizado de la comunidad con posibles acciones correctivas ejecutadas.

---

### CU36 — Revisar foros y artículos

- **Actor(es):** Administrador
- **Descripción:** El administrador puede revisar el contenido de foros y artículos publicados en la plataforma para detectar contenido inadecuado, verificar su calidad y gestionar el material destacado.
- **Relaciones:** Es incluido por CU35.
- **Resultado:** Revisión completada con registro de los contenidos auditados.

---

### CU37 — Eliminar usuario o publicación inapropiada

- **Actor(es):** Administrador
- **Descripción:** Cuando se detecta contenido o comportamiento que viola las normas de la plataforma, el administrador puede eliminar la publicación infractora o expulsar al usuario responsable.
- **Relaciones:** *«extend»* de CU35.
- **Resultado:** Contenido o cuenta eliminados; comunidad saneada.

---

### CU38 — Seleccionar contenido destacado

- **Actor(es):** Administrador
- **Descripción:** El administrador puede marcar publicaciones, foros o artículos como "contenido destacado", para que sean promovidos y visibles de forma prioritaria para todos los usuarios de la plataforma.
- **Resultado:** Contenido destacado visible en la sección principal de la comunidad.

---

## Resumen de Casos de Uso por Módulo

| # | Caso de Uso | Módulo | Actores principales |
|---|-------------|--------|---------------------|
| CU1 | Crear perfil | Gestión | Usuario |
| CU2 | Iniciar sesión | Gestión | Todos |
| CU3 | Recuperar contraseña | Gestión | Usuario |
| CU4 | Actualizar datos | Gestión | Usuario |
| CU5 | Modificar roles | Gestión | Administrador |
| CU6 | Asignar roles | Gestión | Administrador |
| CU7 | Revisar información de usuarios | Gestión | Administrador |
| CU8 | Cambiar contraseña | Gestión | Usuario |
| CU9 | Eliminar usuario | Gestión | Administrador |
| CU10 | Ver hábitos activos | Seguimiento | Usuario |
| CU11 | Eliminar hábito | Seguimiento | Usuario |
| CU12 | Editar hábito | Seguimiento | Usuario |
| CU13 | Registrar cumplimiento de hábito | Seguimiento | Usuario |
| CU14 | Generar racha | Seguimiento | Sistema |
| CU15 | Crear hábito personalizado | Seguimiento | Usuario |
| CU16 | Configurar recordatorios | Seguimiento | Usuario |
| CU17 | Enviar notificaciones | Seguimiento | Sistema |
| CU18 | Ver reportes y estadísticas | Seguimiento | Usuario |
| CU19 | Realizar seguimiento a clientes | Seguimiento | Entrenador |
| CU20 | Ver progreso de usuarios | Seguimiento | Entrenador |
| CU21 | Sugerir hábitos personalizados | Seguimiento | Entrenador |
| CU22 | Revisar catálogo de hábitos | Seguimiento | Administrador |
| CU23 | Validar hábitos reportados | Seguimiento | Administrador |
| CU24 | Ver ranking | Comunidad | Usuario |
| CU25 | Agregar amigo | Comunidad | Usuario |
| CU26 | Ver lista de amigos | Comunidad | Usuario |
| CU27 | Ver foros | Comunidad | Usuario |
| CU28 | Participar en foros | Comunidad | Usuario, Administrador |
| CU29 | Comentar en foros | Comunidad | Usuario |
| CU30 | Ver artículos o publicaciones | Comunidad | Usuario |
| CU31 | Ver sugerencia de hábitos populares | Comunidad | Usuario |
| CU32 | Ganar puntos por participación | Comunidad | Usuario |
| CU33 | Crear foros | Comunidad | Usuario |
| CU34 | Moderar comentarios o usuarios en su foro | Comunidad | Usuario |
| CU35 | Supervisar comunidad | Comunidad | Administrador |
| CU36 | Revisar foros y artículos | Comunidad | Administrador |
| CU37 | Eliminar usuario o publicación inapropiada | Comunidad | Administrador |
| CU38 | Seleccionar contenido destacado | Comunidad | Administrador |