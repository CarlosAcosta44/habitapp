"use client";

import { motion } from "framer-motion";

export function CommunitySection() {
  return (
    <section id="nosotros" className="py-32 relative overflow-hidden bg-[#030612]">
      {/* Círculos decorativos de fondo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Lado izquierdo: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <div className="p-12 bg-white rounded-[40px] shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/10">
              <div className="text-center space-y-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Día de mejor racha</p>
                 <p className="text-8xl font-black text-slate-900">22</p>
              </div>
            </div>
            
            {/* Avatars flotantes */}
            <div className="absolute -top-10 left-10 w-16 h-16 rounded-full bg-slate-800 border-4 border-[#030612] overflow-hidden">
               <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
            </div>
            <div className="absolute -bottom-10 right-20 w-16 h-16 rounded-full bg-slate-800 border-4 border-[#030612] overflow-hidden">
               <div className="w-full h-full bg-gradient-to-tr from-pink-500 to-orange-500" />
            </div>
          </motion.div>

          {/* Lado derecho: Texto y Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em]">Comunidad Activa</span>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
                Mantente <span className="text-indigo-500 italic">unido</span> y fuerte.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Encuentra amigos para conversar sobre temas en común. Completen desafíos juntos. El hábito social es el que realmente perdura.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-4xl font-black text-white">98%</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Retención con amigos</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-white">+50k</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Comunidades activas</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
