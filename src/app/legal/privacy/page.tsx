import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans overflow-x-hidden relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo Decorativo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Encabezado / Botón de retroceso */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/register" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
            <span>←</span> Volver al registro
          </Link>
          <span className="text-2xl font-black tracking-tight text-white">
            Habit<span className="text-indigo-500">App</span>
          </span>
        </div>

        {/* Tarjeta de Contenido */}
        <div className="glass-morphism rounded-3xl p-8 sm:p-12 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mb-8">
            Última actualización: 17 de junio de 2026
          </p>

          <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">1. Introducción</h2>
              <p>
                En <strong>HabitApp</strong> nos tomamos muy en serio tu privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos tus datos personales cuando te registras y utilizas nuestra plataforma de gestión de hábitos y bienestar.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">2. Información que recopilamos</h2>
              <p className="mb-2">Recopilamos información que nos proporcionas directamente y datos que se generan al interactuar con la aplicación:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                <li><strong className="text-slate-200">Datos de registro:</strong> Nombre, apellidos, dirección de correo electrónico, contraseña, fecha de nacimiento y género.</li>
                <li><strong className="text-slate-200">Datos de hábitos:</strong> Hábitos creados, frecuencias, registros diarios de completación, notas opcionales, puntos acumulados y rachas históricas.</li>
                <li><strong className="text-slate-200">Datos de comunidad:</strong> Publicaciones en foros, comentarios, reacciones y artículos educativos guardados.</li>
                <li><strong className="text-slate-200">Relación con entrenadores:</strong> Información sobre el entrenador vinculado y las rutinas asignadas en caso de usar el módulo profesional.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">3. Uso de la información</h2>
              <p className="mb-2">Utilizamos tus datos únicamente para proporcionarte la mejor experiencia posible, lo que incluye:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                <li>Configurar, operar y personalizar tu perfil de hábitos.</li>
                <li>Calcular tus puntos, rachas de progreso y posicionamiento en el ranking global.</li>
                <li>Enviarte notificaciones por correo electrónico (recordatorios de hábitos y novedades de la plataforma) a través de servicios integrados (como Resend).</li>
                <li>Facilitar la comunicación con tu entrenador si has aceptado vincularte a su cuenta.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">4. Base legal para el tratamiento</h2>
              <p>
                La base legal para recopilar y tratar tus datos personales es tu consentimiento explícito, el cual otorgas al aceptar esta Política de Privacidad al momento de crear tu cuenta. Puedes revocar este consentimiento en cualquier momento eliminando tu cuenta desde los ajustes de perfil.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">5. Compartir y proteger información</h2>
              <p className="mb-2">
                No vendemos tus datos a terceros. Tus datos se comparten únicamente de la siguiente manera:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                <li><strong className="text-slate-200">Proveedores de servicios:</strong> Supabase (alojamiento seguro de base de datos y autenticación) y Resend (envío de correos electrónicos).</li>
                <li><strong className="text-slate-200">Entrenadores:</strong> Si vinculas de forma voluntaria tu cuenta a la de un Entrenador Registrado, este tendrá acceso a tu progreso diario y rutinas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">6. Seguridad de tus datos</h2>
              <p>
                Utilizamos prácticas de seguridad avanzadas que incluyen la validación de sesiones mediante JSON Web Tokens (JWT), encriptación SSL/TLS para el tránsito de información y políticas de seguridad a nivel de base de datos (Row Level Security o RLS) en Supabase para garantizar que solo tú (o tu entrenador autorizado) puedas acceder a tus registros de hábitos personales.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">7. Tus derechos</h2>
              <p>
                Tienes derecho a acceder, rectificar, exportar o suprimir tus datos personales. Puedes gestionar y modificar tu perfil de usuario directamente en la aplicación, o solicitar la eliminación total de tus registros de la base de datos enviando una solicitud.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">8. Contacto</h2>
              <p>
                Si tienes preguntas o consultas sobre esta Política de Privacidad, puedes ponerte en contacto con el equipo de soporte de HabitApp a través del correo de soporte oficial.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
