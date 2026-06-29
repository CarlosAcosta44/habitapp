import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans overflow-x-hidden relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo Decorativo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

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
            Términos de Servicio
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mb-8">
            Última actualización: 17 de junio de 2026
          </p>

          <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">1. Aceptación de los términos</h2>
              <p>
                Al crear una cuenta en <strong>HabitApp</strong>, accedes a cumplir y estar sujeto a los presentes Términos de Servicio y a todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder a este sitio.
              </p>
            </section>

            <section className="border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-500/5 rounded-r-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5">2. Exención de responsabilidad médica</h2>
              <p className="text-slate-200">
                <strong>IMPORTANTE:</strong> HabitApp es una herramienta tecnológica diseñada para fomentar el desarrollo de hábitos saludables y la organización personal. <strong>La información, retos, hábitos sugeridos o rutinas de entrenamiento proporcionadas en la aplicación NO constituyen un consejo médico ni reemplazan el diagnóstico, recomendación o tratamiento de un profesional de la salud.</strong> Siempre consulta con tu médico u otro profesional calificado antes de iniciar cualquier cambio significativo en tu dieta, rutina de ejercicio o hábitos de salud.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">3. Registro y seguridad de la cuenta</h2>
              <p className="mb-2 font-medium">Al registrarte, te comprometes a:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                <li>Proporcionar información de registro veraz, precisa y actualizada.</li>
                <li>Mantener la confidencialidad de tu contraseña y la seguridad de tu sesión.</li>
                <li>Notificarnos de inmediato cualquier uso no autorizado de tu cuenta o brecha de seguridad.</li>
                <li>No crear más de una cuenta personal ni utilizar cuentas de terceros sin autorización.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">4. Gamificación y sistema de puntos</h2>
              <p>
                HabitApp incluye mecánicas de gamificación como puntos, retos y un ranking global. Los puntos acumulados reflejan el nivel de constancia y participación del usuario, pero no poseen ningún tipo de valor comercial, monetario ni son canjeables por dinero real. El equipo de HabitApp se reserva el derecho de auditar y corregir puntuaciones en caso de detectar manipulación técnica o fraude.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">5. Normas de la comunidad y moderación</h2>
              <p className="mb-2">
                Nuestra sección de comunidad y foros busca ser un espacio seguro y motivador. Está estrictamente prohibido:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                <li>Publicar contenido ofensivo, violento, discriminatorio o que infrinja los derechos de autor.</li>
                <li>Acosar, amenazar o insultar a otros miembros de la comunidad o entrenadores.</li>
                <li>Hacer spam o promocionar productos y servicios comerciales sin consentimiento de los administradores.</li>
              </ul>
              <p className="mt-2 text-slate-300">
                Los administradores de la plataforma tienen la facultad de moderar, editar o eliminar cualquier publicación que infrinja estas reglas, así como suspender temporal o permanentemente las cuentas infractoras.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">6. Servicios de Entrenadores (Coach)</h2>
              <p>
                La plataforma permite a los usuarios con rol de "Entrenador" prescribir rutinas y hacer un seguimiento de los progresos de sus pupilos. Los entrenadores actúan de forma independiente y HabitApp no se responsabiliza de las rutinas personalizadas ni de las interacciones externas entre el cliente y el entrenador.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">7. Modificaciones a los términos</h2>
              <p>
                HabitApp se reserva el derecho de revisar y modificar estos Términos de Servicio en cualquier momento. Al continuar utilizando la plataforma tras la publicación de los cambios, aceptas quedar sujeto a la versión actualizada de dichos términos.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">8. Limitación de responsabilidad</h2>
              <p>
                En la máxima medida permitida por la ley aplicable, HabitApp y sus desarrolladores no serán responsables por ningún daño indirecto, incidental o consecuente derivado de tu acceso o imposibilidad de acceder al servicio, o de cualquier conducta o contenido de terceros dentro de la plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
