"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden landing-gradient">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        {/* Lado izquierdo: Texto */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
              Crea buenos<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">hábitos</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-lg leading-relaxed">
              Cambia tu vida incorporando poco a poco hábitos saludables. Una experiencia diseñada para tu bienestar.
            </p>
          </div>

          <div className="flex flex-col space-y-6">
            <Link
              href="/register"
              className="group relative flex items-center justify-center gap-2 w-full md:w-fit px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl transition-all hover:bg-indigo-500 hover:scale-[1.02] shadow-xl shadow-indigo-500/30"
            >
              Continuar con correo electrónico
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <div className="flex flex-col space-y-4 pt-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">O únete con</span>
              <div className="flex gap-4">
                {/* Social Login Visuals */}
                <button className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <span className="text-lg">G</span>
                </button>
                <button className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <span className="text-lg">A</span>
                </button>
                <button className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <span className="text-lg">F</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lado derecho: Ilustración */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative flex items-center justify-center scale-110 md:scale-100"
        >
          <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
            {/* Glow effect under illustration */}
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <Image
              src="/landing/hero_v2.png"
              alt="HabitApp Illustration"
              fill
              className="object-contain drop-shadow-[0_0_50px_rgba(99,102,241,0.3)]"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
