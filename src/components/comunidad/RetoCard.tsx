'use client';

import React from 'react';
import {
  Calendar,
  Users,
  Trophy,
  Star,
  Sparkles,
  X,
  CheckCircle2,
  Loader2,
  Flag,
} from 'lucide-react';
import type { Reto } from '@/domain/reto.types';

interface RetoCardProps {
  readonly reto: Reto;
  readonly userId?: string;
  readonly isJoining: boolean;
  readonly isLeaving: boolean;
  readonly isCheckingIn: boolean;
  readonly isPending: boolean;
  readonly onSelect: (reto: Reto) => void;
  readonly onJoin: (reto: Reto) => void;
  readonly onLeave: (reto: Reto) => void;
  readonly onCheckIn: (reto: Reto) => void;
}

export function RetoCard({
  reto,
  userId,
  isJoining,
  isLeaving,
  isCheckingIn,
  isPending,
  onSelect,
  onJoin,
  onLeave,
  onCheckIn,
}: RetoCardProps) {
  const puntos = reto.puntos_recompensa ?? 0;
  const isEnrolled = Boolean(
    (userId && reto.usuarios_participando?.includes(userId)) ||
    reto.inscrito === true
  );
  const participantesCount = reto.participantes_count ?? (reto.usuarios_participando?.length ?? 0);
  const todayStr = new Date().toISOString().slice(0, 10);
  const isExpired = Boolean(reto.fechafin && reto.fechafin < todayStr) || reto.estado === 'Finalizado';
  const isCompleted = reto.completado || (reto.progreso ?? 0) >= 100;

  const renderBadge = () => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
          <X className="w-3 h-3" />
          Caducado
        </span>
      );
    }
    const limiteLabel = reto.fechafin ? `Límite: ${reto.fechafin}` : 'Reto continuo';
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#572de4] dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
        <Sparkles className="w-3 h-3" />
        {limiteLabel}
      </span>
    );
  };

  const renderEnrolledActions = () => {
    if (isCompleted) {
      return (
        <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">¡Reto Completado!</span>
        </div>
      );
    }

    if (isExpired) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
            <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Reto finalizado</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLeave(reto);
            }}
            disabled={isLeaving || isPending}
            className="px-2.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
            title="Salir del reto"
          >
            {isLeaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>Salir</span>
          </button>
        </div>
      );
    }

    if (reto.checkin_hecho_hoy) {
      return (
        <div className="flex items-center gap-2">
          <div
            className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default shadow-xs"
            title="Ya registraste tu día de hoy. ¡Vuelve mañana!"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Día de hoy listo ✓</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLeave(reto);
            }}
            disabled={isLeaving || isPending}
            className="px-2.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
            title="Salir del reto"
          >
            {isLeaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>Salir</span>
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCheckIn(reto);
          }}
          disabled={isCheckingIn || isPending}
          className="flex-1 py-2 px-3 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          title="Registrar avance de hoy"
        >
          {isCheckingIn ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>Check-in (+1 día)</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLeave(reto);
          }}
          disabled={isLeaving || isPending || isCheckingIn}
          className="px-2.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
          title="Salir del reto"
        >
          {isLeaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          <span>Salir</span>
        </button>
      </div>
    );
  };

  const renderActionBottom = () => {
    if (isEnrolled) {
      return (
        <div className="flex flex-col gap-2.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 text-slate-500">
                Progreso: <strong className="text-slate-800 dark:text-slate-100">{reto.dias_progreso ?? 0} / {reto.dias_objetivo ?? 7} días</strong>
              </span>
              <span className="text-[#572de4] dark:text-indigo-400 font-bold">{reto.progreso ?? 0}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-[#572de4] to-indigo-400'
                }`}
                style={{ width: `${Math.min(100, reto.progreso ?? 0)}%` }}
              />
            </div>
          </div>
          {renderEnrolledActions()}
        </div>
      );
    }

    if (isExpired) {
      return (
        <div className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
          <span>Reto finalizado</span>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onJoin(reto);
        }}
        disabled={isJoining || isPending}
        className="w-full py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
      >
        {isJoining ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Flag className="w-3.5 h-3.5" />
        )}
        <span>Unirme al reto</span>
      </button>
    );
  };

  return (
    <article className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 group hover:border-[#572de4]/40 text-left">
      <button
        type="button"
        onClick={() => onSelect(reto)}
        className="w-full flex flex-col gap-3 text-left focus:outline-none"
      >
        <div className="w-full flex items-center justify-between">
          {renderBadge()}
          <span className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            +{puntos} pts
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/70 dark:border-indigo-900/40 flex items-center justify-center shrink-0 select-none shadow-xs">
            {reto.icono || '🏆'}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#572de4] transition-colors leading-snug">
            {reto.titulo}
          </h4>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
          {reto.descripcion}
        </p>
      </button>

      <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {reto.fechainicio ? `Inicio: ${reto.fechainicio}` : 'En curso'}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {participantesCount} participante{participantesCount === 1 ? '' : 's'}
          </span>
        </div>

        {renderActionBottom()}
      </div>
    </article>
  );
}
