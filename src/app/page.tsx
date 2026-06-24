import Image from 'next/image';
import { LandingNavbar }   from "@/components/layout/LandingNavbar";
import { HeroSection }     from "@/components/landing/HeroSection";
import { LandingFooter }   from "@/components/layout/LandingFooter";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[#030612] selection:bg-indigo-500/30">
      <LandingNavbar />
      <HeroSection />
      
      {/* Sección Funcionalidades */}
      <section id="funcionalidades" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-4">
              Funcionalidades
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para construir una vida extraordinaria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tarjeta 1 */}
            <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 border-t-purple-500/50 rounded-2xl p-10 hover:scale-105 transition-all duration-300 group">
              <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-400 transition-colors">
                Gestión de Hábitos
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Crea, edita y haz seguimiento diario de tus rutinas con una interfaz rápida y sin fricciones.
              </p>
            </div>
            
            {/* Tarjeta 2 */}
            <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 border-t-purple-500/50 rounded-2xl p-10 hover:scale-105 transition-all duration-300 group">
              <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-400 transition-colors">
                Sistema de Niveles
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Gana puntos por cada hábito completado y sube de rango (Bronce, Plata, Oro, Diamante).
              </p>
            </div>
            
            {/* Tarjeta 3 */}
            <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 border-t-purple-500/50 rounded-2xl p-10 hover:scale-105 transition-all duration-300 group">
              <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-400 transition-colors">
                Rachas y Estadísticas
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Mantén tu racha activa y visualiza tu progreso con reportes detallados de tu rendimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Nosotros */}
      <section id="nosotros" className="py-24 px-6 relative z-10 bg-[#030612]/80 border-t border-purple-500/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 blur-3xl rounded-full -z-10 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-indigo-500/20 rounded-3xl p-10 md:p-16 relative flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-8">
              Nosotros
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              HabitApp nace de la necesidad de resolver un desafío universal: la dificultad de mantener la constancia en el día a día. Nuestra misión es empoderar a las personas brindándoles un ecosistema digital diseñado para construir rutinas sólidas, superar la procrastinación y transformar pequeñas acciones diarias en resultados extraordinarios y duraderos.
            </p>
          </div>
          
          <div className="flex-1 flex justify-center w-full">
            <Image 
              src="/images/nosotros-illustration.png" 
              alt="Ilustración HabitApp Nosotros" 
              width={500} 
              height={500} 
              className="w-full max-w-[400px] h-auto object-contain drop-shadow-[0_0_30px_rgba(129,140,248,0.3)] hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
