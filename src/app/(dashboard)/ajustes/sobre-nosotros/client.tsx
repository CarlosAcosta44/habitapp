"use client";

import Link from "next/link";
import { 
  ArrowLeft,
  Zap
} from "lucide-react";

export default function SobreNosotrosClient() {
  const sections = [
    {
      title: "Seguimiento Diario",
      desc: "Registra, personaliza y haz seguimiento de tus hábitos en áreas como ejercicio, nutrición, sueño y salud mental.",
      icon: <span className="text-2xl">🎯</span>,
      color: "border-indigo-500/30 bg-indigo-500/5"
    },
    {
      title: "Gamificación",
      desc: "Acumula puntos al completar tus misiones diarias. Compite en el ranking global de forma sana y motivadora.",
      icon: <span className="text-2xl">🏆</span>,
      color: "border-pink-500/30 bg-pink-500/5"
    },
    {
      title: "Comunidad",
      desc: "Foros de discusión temáticos y artículos informativos para compartir experiencias y recibir apoyo continuo.",
      icon: <span className="text-2xl">👥</span>,
      color: "border-emerald-500/30 bg-emerald-500/5"
    },
    {
      title: "Asesoría Profesional",
      desc: "Vinculación con entrenadores certificados que diseñan rutinas personalizadas y supervisan tu progreso real.",
      icon: <span className="text-2xl">🎓</span>,
      color: "border-amber-500/30 bg-amber-500/5"
    }
  ];

  const roles = [
    { name: "Usuario", activity: "Registra hábitos, suma puntos y participa en foros.", icon: "⚡" },
    { name: "Entrenador", activity: "Crea rutinas y brinda recomendaciones directas.", icon: "🛡️" },
    { name: "Administrador", activity: "Gestiona la plataforma, usuarios y contenido destacado.", icon: "❤️" }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-16 w-full px-4">
      {/* ── Header & Breadcrumb ────────────────────────────────────────────── */}
      <div className="mb-12">
        <Link 
          href="/ajustes" 
          className="inline-flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-bold text-sm hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a Ajustes
        </Link>
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-indigo-500 rounded-full"></div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
            Sobre <span className="text-indigo-600 dark:text-indigo-400">HabitApp</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 max-w-2xl font-medium">
            Una plataforma digital diseñada para transformar vidas a través de la constancia y la motivación compartida.
          </p>
        </div>
      </div>

      {/* ── Hero/Vision Card ──────────────────────────────────────────────── */}
      <div className="relative mb-16 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/10 via-violet-600/5 to-pink-600/10 border border-slate-200 dark:border-slate-800 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Nuestra Visión</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            HabitApp no es solo un tracker de tareas; es un ecosistema de bienestar. Nuestro objetivo general es 
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold px-1">
              gestionar y presentar datos sobre hábitos saludables 
            </span>
            para que tomes decisiones informadas sobre tu estilo de vida, motivándote a prevenir enfermedades y mejorar tu salud integral.
          </p>
        </div>
      </div>

      {/* ── Grid de Ejes ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {sections.map((s, idx) => (
          <div 
            key={idx}
            className={`p-6 rounded-3xl border ${s.color} hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── Roles Section ────────────────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8 text-center">Interacción de Roles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roles.map((r, i) => (
            <div key={i} className="p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-3">
                {r.icon}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{r.name}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{r.activity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer / CTA ──────────────────────────────────────────────────── */}
      <div className="pt-12 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">
          <Zap className="w-3 h-3" /> HabitApp Editorial Group v1.0
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-8 max-w-lg mx-auto">
          "El secreto de tu futuro está escondido en tu rutina diaria."
        </p>
        <Link 
          href="/ajustes"
          className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black italic rounded-2xl hover:scale-105 transition-transform"
        >
          EXPLORAR MÁS AJUSTES
        </Link>
      </div>
    </div>
  );
}
