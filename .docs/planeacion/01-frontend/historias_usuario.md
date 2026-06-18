# Historias de Usuario (User Stories) — HabitApp MVP

Este documento mapea los requerimientos funcionales técnicos del QA hacia historias de usuario con formato ágil para la gestión del backlog.

| ID Historia | Módulo | Yo como... | Quiero... | Para... | Criterios de Aceptación |
|---|---|---|---|---|---|
| HU-01 | Autenticación | Usuario nuevo | Registrarme con mi correo y una contraseña | Acceder a la plataforma de hábitos | Debe validar formato de email. Debe pedir contraseña segura. Crea entrada en BD. |
| HU-02 | Autenticación | Usuario registrado | Iniciar sesión de forma segura | Entrar a mi panel de control | Emite token JWT. Redirige al dashboard. |
| HU-03 | Usuarios | Sistema | Crear un perfil base automáticamente tras un registro | Asegurar la integridad relacional de la BD | El trigger de BD debe crear un registro en `user_profiles` con UUID. |
| HU-04 | Usuarios | Usuario | Editar mi información personal y zona horaria | Personalizar mi perfil | El backend debe guardar la zona horaria (ej. UTC-5). |
| HU-05 | Seguridad | Administrador | Asignar roles (usuario, coach, admin) a los miembros | Mantener el control de acceso en la plataforma | El endpoint de rol exige JWT de administrador. |
| HU-06 | Autenticación | Usuario anónimo | Ser redirigido al login si intento entrar al dashboard | Proteger mi información privada | El middleware intercepta la petición y redirige a `/login`. |
| HU-07 | Admin | Administrador | Activar o desactivar cuentas de usuarios | Moderar el uso del sistema | Un usuario desactivado no pasa el middleware de auth. |
| HU-08 | Hábitos | Usuario | Crear un hábito nuevo con nombre, etiqueta y frecuencia | Empezar a hacerle seguimiento | Validar campos vacíos. Hábito guarda el `user_id` del creador. |
| HU-09 | Hábitos | Usuario | Establecer si un hábito es diario o semanal | Adaptarlo a mi rutina personal | La UI requiere validación de días específicos. |
| HU-10 | Hábitos | Usuario | Asignarle etiquetas de categorías (Ej. Salud) a un hábito | Organizar mis hábitos visualmente | Las etiquetas deben guardarse en la entidad correspondiente. |
| HU-11 | Hábitos | Usuario | Editar la descripción de mi hábito o archivarlo | Gestionar mis metas actuales | Solo el dueño del hábito puede editarlo. |
| HU-12 | Hábitos | Usuario | Eliminar permanentemente un hábito | Borrar errores sin dejar rastro | El botón borrar sólo aparece si el hábito no tiene historial de registros. |
| HU-13 | Hábitos | Usuario | Ver en la pantalla principal sólo los hábitos que tengo activos hoy | No distraerme con hábitos archivados | La consulta filtra por `status = active`. |
| HU-14 | Seguimiento | Usuario | Hacer clic en un botón para marcar que cumplí mi hábito hoy | Mantener mi registro diario | Incrementa la racha. Inserta registro en la tabla `habit_records`. |
| HU-15 | Seguimiento | Sistema | Guardar la fecha de cumplimiento considerando la zona horaria del usuario | Evitar que los hábitos se reinicien a la hora equivocada | El backend NestJS compara el timestamp con el offset enviado. |
| HU-16 | Seguimiento | Usuario | Ver una barra de progreso de mis hábitos de hoy | Sentirme motivado al avanzar | La barra muestra `completados / totales activos * 100`. |
| HU-17 | Estadísticas | Usuario | Ver cuántos días consecutivos llevo cumpliendo el hábito | Mantener mi racha | El cálculo devuelve un entero. Si no se cumplió ayer, racha = 0. |
| HU-18 | Estadísticas | Usuario | Ver mi récord histórico de la racha más larga | Superar mi mejor marca | La BD guarda el "longest streak" calculado. |
| HU-19 | Estadísticas | Usuario | Ver un mapa de calor (heatmap) de mis últimos 90 días | Ver gráficamente mi constancia | La UI muestra cuadros verdes o grises por día. |
| HU-20 | Gamificación | Usuario | Recibir puntos automáticamente cuando cumplo un hábito | Ganar recompensas en el sistema | El servicio de NestJS suma los puntos a la columna `total_points`. |
| HU-21 | Gamificación | Sistema | Autogenerar misiones en base a plantillas predefinidas | Dinamizar los retos semanales | Un CRON Job inyecta la misión a la base de datos de misiones activas. |
| HU-22 | Gamificación | Usuario | Ver mi total de puntos en el perfil | Conocer mi "nivel" general | La lectura de puntos es en tiempo real o mediante vista ligera. |
| HU-23 | Gamificación | Usuario | Ver en qué lugar del ranking global estoy posicionado | Competir sanamente con otros usuarios | El ranking es proveído por el caché de NestJS. |
| HU-24 | Entrenador | Coach | Crear y publicar rutinas modelo de hábitos | Ayudar a mis clientes a estructurar su día | El coach puede asociar varios hábitos genéricos en una rutina. |
| HU-25 | Comunidad | Usuario | Ver las novedades publicadas en el muro | Estar informado de la comunidad | La sección comunidad muestra artículos creados por coaches o admins. |
| HU-26 | Notificaciones| Usuario | Apagar los recordatorios visuales de mis hábitos | No recibir interrupciones cuando estoy ocupado | Las preferencias se guardan y el frontend frena el envío. |
| HU-27 | Seguridad | Sistema | Impedir a nivel base de datos (RLS) que un usuario lea información de otro | Garantizar privacidad extrema de datos médicos/rutinas | Las consultas SQL sin filtro explícito de ID no devuelven rows de terceros. |
| HU-28 | Seguridad | Sistema | Validar con `getUser()` la identidad del JWT del usuario en cada escritura | Prevenir suplantación de identidad en Server Actions | Lanza error HTTP si el token no es validado en el servidor Supabase Auth. |
| HU-29 | Seguridad | Sistema | Ocultar la llave privada (Service Role) del navegador del usuario | Evitar hackeos y robo de BD | La compilación de Next.js verifica que las keys protegidas no queden inyectadas. |
| HU-30 | Arquitectura | Sistema | Proveer un backend NestJS protegido con Rate Limiting | Soportar alta carga y ataques DDoS | El servidor responde HTTP 429 si un usuario hace más de 100 req/min. |
