"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logoutAction } from "@/actions/auth.actions";
import {
  Sparkles,
  CheckCircle2,
  Edit3,
  Share2,
  Palette,
  Sun,
  Moon,
  Monitor,
  Bell,
  Volume2,
  TreePine,
  VolumeX,
  HelpCircle,
  Shield,
  Lock,
  ChevronRight,
  Heart,
  EyeOff,
  Calendar,
  Video,
  LogOut,
  Flame,
  Check,
} from "lucide-react";

interface AjustesUser {
  nombre: string;
  apellido: string;
  email: string;
  fotoperfil: string | null;
  nombrerol: string;
  puntostotales: number;
  racha: number;
}

interface AjustesClientProps {
  user?: AjustesUser;
}

export function AjustesClient({ user }: AjustesClientProps) {
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState<"campanas" | "naturaleza" | "silencio">("campanas");
  const [healthSync, setHealthSync] = useState(true);
  const [privateCommunity, setPrivateCommunity] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Cargar estado inicial del tema
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("theme");
    const isDark = document.documentElement.classList.contains("dark");
    if (savedTheme === "dark" || (!savedTheme && isDark)) {
      setThemeMode("dark");
    } else {
      setThemeMode("light");
    }

    const savedSound = localStorage.getItem("sound_option");
    if (savedSound === "campanas" || savedSound === "naturaleza" || savedSound === "silencio") {
      setSelectedSound(savedSound);
    }
  }, []);

  // Manejo de cambio de tema
  const handleThemeChange = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode);
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // Modo sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.removeItem("theme");
    }
    window.dispatchEvent(new Event("theme-change"));
  };

  // Manejo de sonido de bienestar
  const handleSoundChange = (option: "campanas" | "naturaleza" | "silencio") => {
    setSelectedSound(option);
    localStorage.setItem("sound_option", option);

    if (option === "silencio") return;

    try {
      const audioCtx = new (window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      if (option === "campanas") {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(432, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
      } else {
        // Tono suave simulación naturaleza
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(320, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(240, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      }
    } catch {
      // Ignorar si Web Audio no está soportado en este entorno
    }
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const displayName = user ? `${user.nombre} ${user.apellido}`.trim() : "Usuario HabitApp";
  const initials = user
    ? `${user.nombre?.charAt(0) || ""}${user.apellido?.charAt(0) || ""}`.toUpperCase() || "HA"
    : "HA";
  const rachaActiva = user?.racha ?? 24;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-7 pb-16">
      {/* ── 1. Top Breadcrumb & Header Title Area ── */}
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
          <span>CONFIGURACIÓN DEL SISTEMA</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">HABITAPP V2.4.1</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ajustes de la Cuenta
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Personaliza tu experiencia, preferencias de bienestar, privacidad y acompañamiento profesional.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs px-3.5 py-1.5 rounded-full self-start md:self-auto shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Sincronizado recientemente
            </span>
          </div>
        </div>
      </header>

      {/* ── 2. User Profile Summary Banner / Card ── */}
      <article className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              {user?.fotoperfil ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.fotoperfil}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/20 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20">
                  {initials}
                </div>
              )}
              <span
                className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#111827]"
                title="Estado: En línea"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {displayName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {user?.nombrerol || "Usuario"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email || "usuario@habitapp.io"}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 px-3 py-0.5 rounded-full w-max">
                <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" aria-hidden="true" />
                <span className="text-xs text-amber-900 dark:text-amber-300 font-bold">
                  {rachaActiva} días de racha activa
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/perfil/editar"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
              <span>Editar perfil</span>
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* ── 3. Balanced 2-Column Desktop Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
        {/* ── LEFT COLUMN: Preferencias de la App + Soporte y Cuenta ── */}
        <section className="flex flex-col gap-7">
          {/* 1. Preferencias de la App */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Preferencias de la App
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Ajustes visuales
              </span>
            </div>

            {/* Tema y Apariencia */}
            <article className="bg-white dark:bg-[#111827] rounded-3xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Tema y Apariencia
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Personaliza el contraste visual y la estética de la interfaz según tu entorno.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 ml-3 border border-blue-100 dark:border-blue-800/40">
                  <Palette className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>

              {/* Segmented control pills */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleThemeChange("dark")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    themeMode === "dark"
                      ? "bg-white dark:bg-[#111827] text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Moon className="w-4 h-4" aria-hidden="true" />
                  <span>Oscuro</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    themeMode === "light"
                      ? "bg-white dark:bg-[#111827] text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Sun className="w-4 h-4" aria-hidden="true" />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange("system")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    themeMode === "system"
                      ? "bg-white dark:bg-[#111827] text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Monitor className="w-4 h-4" aria-hidden="true" />
                  <span>Automático</span>
                </button>
              </div>
            </article>

            {/* Notificaciones (Toggle) */}
            <article className="bg-white dark:bg-[#111827] rounded-3xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-800/40">
                  <Bell className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Activar notificaciones
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Recibir avisos diarios, recordatorios de hábitos y alertas del sistema.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-xs peer-checked:bg-blue-600" />
              </label>
            </article>

            {/* Sonidos de Bienestar */}
            <article className="bg-white dark:bg-[#111827] rounded-3xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-800/40">
                    <Volume2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Sonidos de Bienestar
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tono de confirmación y campana sonora al completar hábitos conscientes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {/* Campanas */}
                <button
                  type="button"
                  onClick={() => handleSoundChange("campanas")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                    selectedSound === "campanas"
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <Sparkles className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span className="text-xs font-bold">Campanas</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Frecuencia 432Hz</span>
                </button>

                {/* Naturaleza */}
                <button
                  type="button"
                  onClick={() => handleSoundChange("naturaleza")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                    selectedSound === "naturaleza"
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <TreePine className="w-5 h-5 mb-1 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="text-xs font-bold">Naturaleza</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Brisa de pinar</span>
                </button>

                {/* Silencio */}
                <button
                  type="button"
                  onClick={() => handleSoundChange("silencio")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                    selectedSound === "silencio"
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <VolumeX className="w-5 h-5 mb-1 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  <span className="text-xs font-bold">Silencio</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Modo vibración</span>
                </button>
              </div>
            </article>
          </div>

          {/* 2. Soporte y Cuenta */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Soporte y Cuenta
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Centro de ayuda
              </span>
            </div>

            <article className="bg-white dark:bg-[#111827] rounded-3xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5">
              <Link
                href="/ajustes/soporte"
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform border border-blue-100 dark:border-blue-800/40">
                    <HelpCircle className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Centro de Ayuda y Preguntas frecuentes
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Guías rápidas, tutoriales, soporte técnico y FAQs
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" aria-hidden="true" />
              </Link>

              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2" />

              <Link
                href="/legal/privacy"
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0 group-hover:scale-105 transition-transform border border-slate-200/80 dark:border-slate-700">
                    <Shield className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Términos de servicio y Privacidad
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Protección de datos RGPD y políticas de bienestar
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" aria-hidden="true" />
              </Link>

              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2" />

              <Link
                href="/ajustes/seguridad"
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform border border-indigo-100 dark:border-indigo-800/40">
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Seguridad y Contraseña
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Actualización de claves y acceso protegido
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </section>

        {/* ── RIGHT COLUMN: Bienestar y Privacidad + Acompañamiento Profesional + Logout ── */}
        <section className="flex flex-col gap-7">
          {/* 1. Bienestar y Privacidad */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Bienestar y Privacidad
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Seguridad y datos
              </span>
            </div>

            <article className="bg-white dark:bg-[#111827] rounded-3xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-4">
              {/* Health Integration */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100 dark:border-rose-900/40">
                    <Heart className="w-5 h-5 fill-rose-500" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Apple Health / Google Fit
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {healthSync ? "Conectado • Pasos y sueño sincronizados" : "Desconectado"}
                      </span>
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={healthSync}
                    onChange={(e) => setHealthSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-xs peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Private Mode in Community */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-800/40">
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Modo Privado en Comunidad
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Compartir hábitos y logros en foros de forma anónima
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privateCommunity}
                    onChange={(e) => setPrivateCommunity(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-xs peer-checked:bg-blue-600" />
                </label>
              </div>
            </article>
          </div>

          {/* 2. Acompañamiento Profesional */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Acompañamiento Profesional
              </h3>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 px-2.5 py-0.5 rounded-full">
                1 Sesión Activa
              </span>
            </div>

            <article className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 relative overflow-hidden flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40 px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Próxima sesión • En 2 días</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                  Confirmada
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-lg ring-2 ring-blue-100 dark:ring-blue-900/40 shadow-xs">
                    EV
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#111827]"
                    title="Acompañante asignada"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Dra. Elena Vidal
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Especialista en hábitos y Mindfulness • Colegiada Nº 31.045
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      <span>Jueves, 18:00 hrs (45 min)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoModalOpen(true)}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline cursor-pointer"
                    >
                      <Video className="w-4 h-4" aria-hidden="true" />
                      <span>Ver enlace de videollamada</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* 3. Botón de Cerrar Sesión */}
          <div className="pt-1">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/20 shadow-xs text-sm font-bold transition-all active:scale-[0.99] cursor-pointer"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
                <span>Cerrar sesión en este dispositivo</span>
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Modal simulado de videollamada */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <span>Sala de Videollamada</span>
              </h3>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              La sesión con la Dra. Elena Vidal estará disponible 10 minutos antes de la hora acordada (Jueves 18:00 hrs).
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300 break-all border border-slate-200/80 dark:border-slate-700">
              https://meet.habitapp.io/sesion-mindfulness-ev724
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("https://meet.habitapp.io/sesion-mindfulness-ev724");
                  setVideoModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
              >
                Copiar enlace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Harmonious Footer Note ── */}
      <footer className="text-center mt-8 py-2 text-slate-400 dark:text-slate-500 text-xs">
        HabitApp versión 2.4.1 (Build 418) • © 2025 HabitApp Inc. Hecho con serenidad.
      </footer>
    </div>
  );
}
