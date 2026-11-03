"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Edit3,
  Flame,
  Trophy,
  TrendingUp,
  ArrowRight,
  Sun,
  Droplet,
  Sparkles,
  Award,
  UserPlus,
  Check,
  Search,
  CheckCircle2,
} from "lucide-react";
import { AddFriendForm } from "./AddFriendForm";

interface PerfilData {
  perfil: any;
  rachaGlobal: number;
  diasActivosMensuales: number;
  eficienciaMensual: number;
  diasEnElMes: number;
  actividad: any[];
  amigos: any[];
  sugerenciasAmigos: any[];
  logros: any[];
  logroDestacado: any;
  proximoObjetivo: any;
  porcentajeObj: number;
  totalHabitosActivos?: number;
}

interface PerfilInteractiveViewProps {
  data: PerfilData;
}

export function PerfilInteractiveView({ data }: PerfilInteractiveViewProps) {
  const [copied, setCopied] = useState(false);
  const [saludos, setSaludos] = useState<Record<string, boolean>>({});
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  const perfil = data.perfil;
  const displayName = `${perfil?.nombre || "Usuario"} ${perfil?.apellido || ""}`.trim();
  const initials = `${perfil?.nombre?.charAt(0) || ""}${perfil?.apellido?.charAt(0) || ""}`.toUpperCase() || "HA";
  const email = perfil?.email || "usuario@habitapp.io";
  const racha = data.rachaGlobal || perfil?.racha_actual || 24;
  const puntos = perfil?.puntos ?? perfil?.puntostotales ?? 2840;
  const habitosActivos = data.totalHabitosActivos ?? 6;
  const tasaExito = data.eficienciaMensual || 94;
  const diasTotales = data.diasActivosMensuales || 86;

  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaludar = (amigoId: string) => {
    setSaludos((prev) => ({ ...prev, [amigoId]: true }));
    setTimeout(() => {
      setSaludos((prev) => ({ ...prev, [amigoId]: false }));
    }, 3000);
  };

  // Logros predefinidos con la estética del diseño Figma
  const logrosList = [
    {
      id: "logro-1",
      nombre: "Madrugador",
      desc: "5 días seguidos antes de las 7:00",
      puntos: "+100 pts",
      completado: true,
      icon: <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />,
      bgIcon: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      id: "logro-2",
      nombre: "7 Días Racha",
      desc: "Semana perfecta sin fallar un hábito",
      puntos: "+150 pts",
      completado: true,
      icon: <Flame className="w-6 h-6 text-rose-600 dark:text-rose-400 fill-rose-500" aria-hidden="true" />,
      bgIcon: "bg-rose-50 dark:bg-rose-950/40",
    },
    {
      id: "logro-3",
      nombre: "Mente Clara",
      desc: "15 sesiones de respiración o meditación",
      puntos: "+120 pts",
      completado: true,
      icon: <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />,
      bgIcon: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      id: "logro-4",
      nombre: "Hidratación Pro",
      desc: "Alcanzar meta de agua 20 días",
      puntos: "+80 pts",
      completado: false,
      progresoTexto: "17/20 d",
      progresoPorcentaje: 85,
      icon: <Droplet className="w-6 h-6 text-blue-600 dark:text-blue-400 fill-blue-500" aria-hidden="true" />,
      bgIcon: "bg-blue-50 dark:bg-blue-900/30",
    },
  ];

  // Lista de amigos con fallback si no hay amigos registrados
  const fallbackAmigos = [
    {
      id: "f-1",
      nombre: "David Gómez",
      subtitulo: "18 días en racha",
      isRacha: true,
      color: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
      initials: "DG",
    },
    {
      id: "f-2",
      nombre: "Clara Sánchez",
      subtitulo: "12 días • Reto meditación",
      isRacha: false,
      color: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
      initials: "CS",
    },
    {
      id: "f-3",
      nombre: "Sofía Aranda",
      subtitulo: "31 días • Top 10 ranking",
      isRacha: false,
      color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
      initials: "SA",
    },
  ];

  const amigosDisplay =
    data.amigos && data.amigos.length > 0
      ? data.amigos.map((a: any, idx: number) => ({
          id: a.idamigo || a.id || `amigo-${idx}`,
          nombre: `${a.nombre || "Amigo"} ${a.apellido || ""}`.trim(),
          subtitulo: a.racha ? `${a.racha} días en racha` : "Compañero de hábitos",
          isRacha: !!a.racha,
          color: idx % 3 === 0 ? "bg-blue-100 text-blue-700" : idx % 3 === 1 ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700",
          initials: `${a.nombre?.charAt(0) || "A"}${a.apellido?.charAt(0) || ""}`.toUpperCase(),
        }))
      : fallbackAmigos;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-7 pb-16">
      {/* ── 1. Top Breadcrumb & Page Header ── */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>MI CUENTA</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">PERFIL DE USUARIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Perfil de Usuario
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
            Gestiona tu identidad, revisa tus logros de bienestar y conecta con tu comunidad de hábitos diarios.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-200/80 dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>¡Enlace copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>Compartir perfil</span>
              </>
            )}
          </button>
          <Link
            href="/perfil/editar"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Edit3 className="w-4 h-4" aria-hidden="true" />
            <span>Editar perfil</span>
          </Link>
        </div>
      </section>

      {/* ── 2. Hero Profile Banner Card ── */}
      <section className="relative bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          {/* Left side: Avatar + User Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {perfil?.fotoperfil ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={perfil.fotoperfil}
                  alt={displayName}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-blue-500/20">
                  {initials}
                </div>
              )}
            </div>

            {/* Identity & Streak Badge */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {displayName}
                </h2>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                  {email}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200/80 dark:border-amber-800/40">
                  <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500" aria-hidden="true" />
                  <span>{racha} días de racha</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Quick stats triplets */}
          <div className="grid grid-cols-3 gap-3 w-full xl:w-auto shrink-0">
            <div className="flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center min-w-[110px]">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {habitosActivos}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hábitos activos
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center min-w-[110px]">
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {tasaExito}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tasa de éxito
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center min-w-[110px]">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {diasTotales}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Días totales
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Unified Prominent Points & Ranking Banner Card ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/20">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-sky-300/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Points Section */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Trophy className="w-8 h-8 text-amber-300" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-blue-100 font-bold">
                  Puntos de Bienestar
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                  +320 esta semana
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {puntos.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-blue-100">pts</span>
              </div>
            </div>
          </div>

          {/* Call to Action: Access Ranking */}
          <div className="flex items-center">
            <Link
              href="/ranking"
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 active:scale-95 text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Ranking Completo</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Two Column Content Grid (Achievements & Friends) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* LEFT: Achievements & Badges (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Logros y Medallas
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                12 de 24
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
              <span>Vitrina personal</span>
            </span>
          </div>

          {/* Badges 2x2 Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {logrosList.map((logro) => (
              <div
                key={logro.id}
                className="flex items-start gap-3.5 p-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${logro.bgIcon} flex items-center justify-center shrink-0`}>
                  {logro.icon}
                </div>
                <div className="flex flex-col min-w-0 w-full">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {logro.nombre}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {logro.desc}
                  </span>

                  {logro.completado ? (
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                        Completado
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold">
                        {logro.puntos}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 mt-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          En progreso: {logro.progresoPorcentaje}%
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">
                          {logro.progresoTexto}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                          style={{ width: `${logro.progresoPorcentaje}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: Friends (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Amigos
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {amigosDisplay.length} amigos
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddFriendModal(true)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Añadir</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 bg-white dark:bg-[#111827] rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800">
            {amigosDisplay.map((amigo) => (
              <div
                key={amigo.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl ${amigo.color} font-bold flex items-center justify-center shrink-0 text-xs`}
                  >
                    {amigo.initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {amigo.nombre}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                      {amigo.isRacha && (
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" aria-hidden="true" />
                      )}
                      <span className="truncate">{amigo.subtitulo}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaludar(amigo.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    saludos[amigo.id]
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {saludos[amigo.id] ? "¡Saludado! 🎉" : "Saludar 👋"}
                </button>
              </div>
            ))}

            {/* Bottom Action Strip */}
            <button
              type="button"
              onClick={() => setShowAddFriendModal(true)}
              className="mt-2 w-full py-2.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-800"
            >
              <Search className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <span>Buscar amigos por contacto o enlace</span>
            </button>
          </div>
        </section>
      </div>

      {/* Modal para añadir amigos */}
      {showAddFriendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <span>Añadir Amigo</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddFriendModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecciona a un compañero para enviarle una solicitud de amistad.
            </p>
            <AddFriendForm suggestions={data.sugerenciasAmigos || []} />
          </div>
        </div>
      )}
    </div>
  );
}
