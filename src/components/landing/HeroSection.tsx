"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, QrCode, Smartphone, Bell, Medal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#0A0713]">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0713] to-[#0A0713] z-0" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0A0713] to-[#0A0713] z-0" />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 max-w-[1600px] w-full px-8 xl:px-16">
        
        {/* Lado izquierdo: Texto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-8 lg:col-span-7"
        >
          <div className="space-y-6">


            {/* Título Principal */}
            <h1 className="text-5xl md:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight">
              Crea buenos <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8cbf5] to-[#c4a1ff] italic font-serif pr-2">hábitos</span>
              <br /> que perduran.
            </h1>
            
            {/* Descripción */}
            <p className="text-lg md:text-xl text-slate-300/80 max-w-2xl leading-relaxed">
              Cambia tu vida incorporando poco a poco hábitos saludables. Diseñada específicamente para tu smartphone con recordatorios contextuales, widgets interactivos y neurociencia aplicada al progreso real.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/download"
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-[#7a60ff] text-white font-semibold rounded-full transition-all hover:bg-[#6c52f0] hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
            >
              <Smartphone className="w-5 h-5" />
              Descargar para Android
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/register"
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full transition-all hover:bg-white/10 hover:scale-[1.02]"
            >
              Continuar en navegador
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Caja del Código QR */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm max-w-xl mt-4">
            <div className="flex items-center justify-center bg-white p-2 rounded-xl">
               <QrCode className="w-14 h-14 text-black" strokeWidth={1.5} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-[#b096f5] font-semibold text-sm">
                <Smartphone className="w-4 h-4" />
                Abrir enlace de descarga
              </div>
              <p className="text-sm text-slate-400 leading-snug">
                Escanea el código para abrir el enlace de descarga en tu dispositivo.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 h-fit">
              <Smartphone className="w-4 h-4" />
              Android
            </div>
          </div>

          {/* O únete con (Social) */}
          <div className="flex items-center gap-6 pt-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">O únete con</span>
            <div className="flex gap-4">
              {/* Google */}
              <button title="Continuar con Google" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.3C29.3 35.2 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8H6.4C9.8 37 16.4 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.3C41.6 35.6 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"/>
                </svg>
              </button>
              {/* Apple */}
              <button title="Continuar con Apple" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
              {/* Facebook */}
              <button title="Continuar con Facebook" className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lado derecho: Mockup del celular (Phone Mockup) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative hidden lg:flex items-center justify-center lg:col-span-5 h-[800px] mt-10"
        >
          {/* Contenedor del Celular */}
          <div className="relative w-[340px] h-[720px] bg-black rounded-[48px] border-[12px] border-[#1C1A24] shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col origin-center">
            {/* Pantalla del Celular */}
            <div className="relative flex-1 w-full bg-white overflow-hidden rounded-[36px]">
              <Image 
                src="/images/mobile-app-mockup.png" 
                alt="HabitApp Mobile Mockup"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Notificaciones Flotantes */}
          {/* Recordatorio (Arriba Izquierda) */}
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-[12%] -left-20 z-30 flex items-center gap-4 p-3 pr-6 bg-[#1D1B26] border border-white/10 rounded-2xl shadow-2xl scale-[0.85] origin-bottom-right"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-[#9B88ED] text-white rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Recordatorio HabitApp</span>
              <span className="text-xs text-slate-300">Momento de meditar • 15m</span>
            </div>
          </motion.div>

          {/* Hito personal (Abajo Derecha) */}
          <motion.div 
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute bottom-[25%] -right-20 z-30 flex items-center gap-4 p-3 pr-6 bg-[#1D1B26] border border-white/10 rounded-2xl shadow-2xl scale-[0.85] origin-top-left"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-[#7a60ff] text-white rounded-xl">
              <Medal className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">¡Nuevo hito personal!</span>
              <span className="text-xs text-slate-300">21 días de racha invicta 🔥</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
