/**
 * @file src/app/(dashboard)/ajustes/page.tsx
 * @description Página de Ajustes / Configuración.
 * Secciones General y Más opciones con toggles y enlaces.
 */

import Link from "next/link";
import { logoutAction } from "@/actions/auth.actions";

export const metadata = { title: "Ajustes | HabitApp" };

// Opciones de configuración general
const generalItems = [
  {
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    titulo: "Edit Profile",
    descripcion: "Actualiza tu información personal",
    tipo: "link" as const,
  },
  {
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 8.002-5.998Z" />
      </svg>
    ),
    titulo: "Dark Mode",
    descripcion: "Modo nocturno para descansar la vista",
    tipo: "toggle" as const,
    activo: true,
  },
  {
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    titulo: "Security",
    descripcion: "Contraseña y biometría",
    tipo: "link" as const,
  },
  {
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
    titulo: "Notifications",
    descripcion: "Configura tus recordatorios",
    tipo: "link" as const,
  },
  {
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
      </svg>
    ),
    titulo: "Sound",
    descripcion: "Efectos de sonido en la app",
    tipo: "toggle" as const,
    activo: true,
  },
];

// Más opciones
const masOpciones = [
  { titulo: "Routine Rating",    icono: "⭐" },
  { titulo: "Share with Friends", icono: "🔗" },
  { titulo: "About Us",          icono: "ℹ️" },
  { titulo: "Support",           icono: "❓" },
];

export default function AjustesPage() {
  return (
    <div className="max-w-5xl mx-auto pb-12">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white italic">Ajustes</h1>
        <p className="text-sm text-slate-400 mt-1">
          Personaliza tu experiencia y gestiona tus hábitos con estilo editorial.
        </p>
      </div>

      {/* ── Grid de secciones ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── GENERAL ─────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-0.5 bg-indigo-500 rounded-full"></div>
            <h2 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">General</h2>
          </div>

          <div className="space-y-3">
            {generalItems.map((item) => (
              <div
                key={item.titulo}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#111827] border border-slate-800/50 hover:border-indigo-500/20 transition-all cursor-pointer group"
              >
                {/* Icono */}
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:bg-indigo-600/20 transition-colors">
                  {item.icono}
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white">{item.titulo}</h3>
                  <p className="text-xs text-slate-400 italic">{item.descripcion}</p>
                </div>

                {/* Acción */}
                {item.tipo === "toggle" ? (
                  <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${
                    item.activo ? "bg-indigo-600" : "bg-slate-700"
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      item.activo ? "translate-x-5" : "translate-x-0"
                    }`}></div>
                  </div>
                ) : (
                  <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── MÁS OPCIONES ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-0.5 bg-pink-500 rounded-full"></div>
            <h2 className="text-[11px] font-bold text-pink-400 uppercase tracking-widest">Más Opciones</h2>
          </div>

          <div className="space-y-3">
            {masOpciones.map((item) => (
              <div
                key={item.titulo}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#111827] border border-slate-800/50 hover:border-pink-500/20 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-600/10 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icono}
                </div>
                <h3 className="flex-1 text-sm font-bold text-white">{item.titulo}</h3>
                <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            ))}
          </div>

          {/* Pro Tip Card */}
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-blue-600/30 border border-indigo-500/20 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">Pro Tip</p>
            <h3 className="text-lg font-extrabold text-white leading-tight mb-2">
              Mantén el enfoque en tus objetivos semanales.
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">Inspiration</p>
            <Link
              href="/habitos"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#111827] border border-slate-700/50 text-sm font-semibold text-slate-200 hover:bg-[#1a2332] transition-colors"
            >
              Ver Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="mt-10 pt-6 border-t border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Version</p>
              <p className="text-sm text-slate-400">v1.0.0</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Storage</p>
              <p className="text-sm text-slate-400">12.4 MB</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">© 2024 HabitApp Editorial Group</p>
        </div>
      </div>

      {/* ── Logout ────────────────────────────────────────────────────────── */}
      <div className="mt-6">
        <form action={logoutAction}>
          <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </form>
      </div>

    </div>
  );
}
