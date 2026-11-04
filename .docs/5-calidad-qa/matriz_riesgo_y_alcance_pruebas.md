# Matriz de Prioridad de Riesgo y Alcance de Pruebas — HabitApp MVP

Este documento define la estrategia y profundidad de pruebas para el catálogo completo de **42 historias de usuario (US001 a US042)** de HabitApp (Web Next.js y Móvil Flutter), estructurado según el análisis de riesgo de calidad y las directrices de alcance del proyecto.

> **Criterio de Nivel de Riesgo:**  
> $$\text{Nivel de Riesgo} = \text{Probabilidad (1 a 3)} \times \text{Impacto (1 a 3)}$$
>
> - **Riesgo $\ge$ 6 (Alto):** **Pruebas exhaustivas y automatizadas** (Flujos críticos, lógica financiera/puntos, seguridad RLS, persistencia de sesión).
> - **Riesgo 3 a 4 (Medio):** **Pruebas estándar** (Validaciones funcionales, navegación, consultas filtradas, renderizado de datos).
> - **Riesgo $\le$ 2 (Bajo):** **Pruebas exploratorias** (Elementos informativos, vistas estáticas, ayudas contextuales).

---

## 1. Matriz de Priorización de Riesgo por Historia de Usuario (Alcance en Prueba)

| Módulo | Código HU | Funcionalidad / Historia de Usuario | Probabilidad (1-3) | Impacto (1-3) | Nivel de Riesgo (P×I) | Tipo de Prueba Sugerida |
|---|---|---|:---:|:---:|:---:|---|
| **Autenticación, acceso y perfil** | US001 | Onboarding e inducción interactiva (detección de primera visita) | 1 | 2 | **2** | Exploratoria |
| | US002 | Registro de usuario con validación de credenciales | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US003 | Autenticación, inicio de sesión y emisión de JWT | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US004 | Persistencia de sesión con auto-refresh de JWT y Secure Storage | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US005 | Recuperación y restablecimiento de contraseña vía email | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US006 | Creación de perfil base y asignación de UUID en BD | 1 | 3 | **3** | Estándar |
| | US007 | Edición de perfil de usuario y almacenamiento de zona horaria | 2 | 2 | **4** | Estándar |
| | US008 | Panel de ajustes y preferencias de cuenta (`/ajustes`) | 1 | 2 | **2** | Exploratoria |
| | US009 | Restricción de acceso a rutas protegidas mediante Middleware | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US010 | Cierre de sesión y destrucción de sesión (Logout) | 2 | 3 | **6** | Exhaustiva y automatizada |
| **Core de hábitos y seguimiento** | US011 | Creación de nuevos hábitos con metas y categorías | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US012 | Configuración de frecuencia y días específicos | 2 | 2 | **4** | Estándar |
| | US013 | Configuración y persistencia de recordatorios horarios | 2 | 2 | **4** | Estándar |
| | US014 | Filtrado y visualización de hábitos de "Hoy" | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US015 | Registro interactivo de cumplimiento diario (check) | 3 | 3 | **9** | Exhaustiva y automatizada |
| | US016 | Desmarcado y reversión de cumplimiento de hábito | 2 | 2 | **4** | Estándar |
| | US017 | Modificación y archivado de hábitos | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US018 | Eliminación física controlada sin registros previos | 1 | 2 | **2** | Exploratoria |
| **Métricas, reportes y gamificación** | US019 | Cálculo dinámico de barra de progreso del día (0-100%) | 2 | 2 | **4** | Estándar |
| | US020 | Cálculo automático de rachas continuas (Streaks) | 3 | 3 | **9** | Exhaustiva y automatizada |
| | US021 | Asignación de puntos y prevención de doble registro | 3 | 3 | **9** | Exhaustiva y automatizada |
| | US022 | Matriz de consistencia histórica (Heatmap 90 días) | 2 | 2 | **4** | Estándar |
| | US023 | Análisis editorial y reportes de progreso (`/reportes`) | 2 | 2 | **4** | Estándar |
| | US024 | Centro de notificaciones internas e in-app (Campanita & `/notificaciones`) | 2 | 2 | **4** | Estándar |
| | US025 | Tabla de clasificación comunitaria (Leaderboard) | 2 | 2 | **4** | Estándar |
| | US026 | Desbloqueo de logros, hitos e insignias | 2 | 2 | **4** | Estándar |
| **Comunidad, retos y bienestar** | US027 | Muro de foros comunitarios filtrado por categoría | 2 | 2 | **4** | Estándar |
| | US028 | Creación, edición y eliminación de foros propios | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US029 | Comentarios en hilos anidados con soporte multimedia | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US030 | Contador reactivo de apoyos y likes de corazón | 2 | 2 | **4** | Estándar |
| | US031 | Catálogo comunitario y clonación de hábitos en 1 clic | 2 | 2 | **4** | Estándar |
| | US032 | Retos comunitarios con check-in diario único | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US033 | Lector interactivo de artículos educativos | 1 | 2 | **2** | Exploratoria |
| | US034 | Directorio de especialistas y solicitud de asesoría | 2 | 2 | **4** | Estándar |
| **Roles especializados y administración** | US035 | Panel de entrenador y auditoría de clientes asignados | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US036 | Creación y asignación de rutinas maestras por entrenador | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US037 | Panel de administración, gestión de usuarios y roles | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US038 | Moderación forzada y seguridad Row Level Security (RLS) | 2 | 3 | **6** | Exhaustiva y automatizada |
| **Hardware móvil nativo** | US039 | Notificaciones push nativas locales y remotas del OS | 2 | 3 | **6** | Exhaustiva y automatizada |
| | US040 | Geolocalización GPS nativa del dispositivo (`geolocator`) | 2 | 2 | **4** | Estándar |
| | US041 | Captura directa con cámara y selección de galería nativa | 2 | 2 | **4** | Estándar |
| | US042 | Desbloqueo y seguridad biométrica por hardware (Huella / Face ID) | 2 | 3 | **6** | Exhaustiva y automatizada |

---

## 2. Funcionalidades Fuera del Alcance de Prueba (Out of Scope)

La siguiente tabla detalla las integraciones, servicios de terceros o componentes que **no se probarán** durante esta fase de control de calidad del MVP, junto con su respectiva justificación técnica y mecanismo de mitigación.

| Módulo / Funcionalidad | Referencia | Razón / Justificación de Exclusión | Estrategia de Mitigación o Alternativa |
|---|---|---|---|
| **Pasarela de Pagos Real (Stripe / Wompi)** | Monetización / Suscripciones | La versión actual MVP ofrece acceso gratuito y funciones abiertas. No se cuenta con merchant de producción configurado ni pasarela bancaria activa. | Se utiliza simulación mediante mocks y cuentas sandbox para validar la lógica de planes sin realizar cobros bancarios reales. |
| **Notificaciones Push Nativas en Navegadores Desktop** | Notificaciones Web | En navegadores de escritorio las notificaciones push nativas dependen de servicios de terceros del sistema operativo que no están configurados para la versión web estándar. | Se prueban exhaustivamente los recordatorios horarios en base de datos (`recordatorios_habito`), las alertas visuales y la bandeja de notificaciones in-app (US024). |
| **Lectores Biométricos Físicos en Entorno Web** | Seguridad Hardware (US042 móvil) | Los sensores biométricos físicos (FaceID / TouchID) dependen de APIs nativas de smartphones (iOS/Android), no disponibles de manera homogénea en computadores de escritorio. | La seguridad de acceso web se audita exhaustivamente a través de los endpoints de autenticación del Backend (NestJS API), tokens JWT firmados y cookies seguras con políticas SameSite/HTTP-only. |
| **Envío Masivo de Correos Electrónicos Reales** | Notificaciones por Email | Enviar correos masivos a servidores SMTP públicos en fase de pruebas puede saturar cuotas de servicio o disparar filtros de SPAM innecesariamente. | Se utiliza un servidor SMTP de pruebas local / Mailtrap para validar el contenido y enlaces de confirmación sin despachar emails externos a bandejas reales. |
| **Pruebas de Estrés y Concurrencia Extrema (>100.000 usuarios)** | Rendimiento de Infraestructura | El objetivo de la fase QA actual es la estabilidad funcional, lógica de negocio y seguridad RLS de la aplicación. | Las pruebas de concurrencia se acotan al manejo de doble clic y concurrencia transaccional en puntos y check-ins (hasta 100 usuarios concurrentes). |
| **Subida de Archivos Multiformato Pesados (>50MB)** | Almacenamiento Storage | La plataforma solo admite imágenes ligeras de perfil y capturas para comentarios (límite de 5MB por archivo). | Se valida el bloqueo estricto en el frontend y backend para rechazar archivos no permitidos o que superen los 5MB. |
| **Dispositivos Apple iOS (iPhone/iPad y FaceID)** | Compatibilidad Móvil (US039 a US042) | El alcance de pruebas del MVP de la aplicación móvil Flutter se acota exclusivamente a dispositivos y emuladores Android (versiones 10 a 14). No se cuenta con dispositivos iOS físicos ni cuenta de Apple Developer activa en esta fase de certificación. | Se ejecutan pruebas completas de las capacidades móviles nativas en emuladores y dispositivos físicos Android; la compilación y prueba en iOS queda programada para la siguiente fase de release. |
