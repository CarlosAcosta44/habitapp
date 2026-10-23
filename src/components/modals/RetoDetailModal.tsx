'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import {
  Trophy,
  X,
  Star,
  Users,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { Reto } from '@/domain/reto.types';

interface RetoDetailModalProps {
  readonly reto: Reto | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userId?: string;
  readonly isJoining: boolean;
  readonly isLeaving: boolean;
  readonly isCheckingIn: boolean;
  readonly isPending: boolean;
  readonly onJoin: (reto: Reto) => void;
  readonly onLeave: (reto: Reto) => void;
  readonly onCheckIn: (reto: Reto) => void;
}

export function RetoDetailModal({
  reto,
  isOpen,
  onClose,
  userId,
  isJoining,
  isLeaving,
  isCheckingIn,
  isPending,
  onJoin,
  onLeave,
  onCheckIn,
}: RetoDetailModalProps) {
  if (!isOpen || !reto) return null;

  const modalId = reto.idreto || reto.idReto || reto.id || '';
  const modalPuntos = reto.puntos_recompensa ?? 0;
  const modalEnrolled = Boolean(
    (userId && reto.usuarios_participando?.includes(userId)) ||
    reto.inscrito === true
  );
  const modalParticipantes = reto.participantes_count ?? (reto.usuarios_participando?.length ?? 0);
  const todayModalStr = new Date().toISOString().slice(0, 10);
  const isModalExpired = Boolean(reto.fechafin && reto.fechafin < todayModalStr) || reto.estado === 'Finalizado';
  const isCompleted = reto.completado || (reto.progreso ?? 0) >= 100;

  const renderActiveActionButtons = () => {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onCheckIn(reto)}
          disabled={isCheckingIn || isPending}
          className="flex-1 py-3.5 rounded-2xl bg-[#572de4] hover:bg-[#461ebd] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {isCheckingIn ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>Hacer Check-in Diario (+1 día)</span>
        </button>

        <button
          type="button"
          onClick={() => onLeave(reto)}
          disabled={isLeaving || isPending}
          className="px-4 py-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          title="Salir de este reto"
        >
          {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          <span>Salir</span>
        </button>
      </div>
    );
  };

  const renderEnrolledContent = () => {
    if (isCompleted) {
      return (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
          <Trophy className="w-7 h-7 text-emerald-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">🎉 ¡Reto Completado con Éxito!</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-300">
              Has asegurado los +{modalPuntos} puntos y avanzado en tus logros de comunidad.
            </span>
          </div>
        </div>
      );
    }

    if (isModalExpired) {
      return (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-3">
            <X className="w-6 h-6 text-rose-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Este reto ha finalizado</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                La fecha límite concluyó. No es posible registrar más avances diarios.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onLeave(reto)}
            disabled={isLeaving || isPending}
            className="w-full py-3 rounded-2xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Salir de este reto</span>
          </button>
        </div>
      );
    }

    if (reto.checkin_hecho_hoy) {
      return (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ¡Check-in de hoy registrado!
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ya sumaste tu día. Vuelve mañana para continuar con tu progreso.
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onLeave(reto)}
            disabled={isLeaving || isPending}
            className="w-full py-3 rounded-2xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Salir de este reto</span>
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold">
              Participando activamente
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            +{modalPuntos} pts al finalizar
          </span>
        </div>

        {renderActiveActionButtons()}
      </>
    );
  };

  const renderModalActions = () => {
    if (modalEnrolled) {
      return (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#572de4]" />
                Progreso completado: <strong className="text-slate-900 dark:text-white">{reto.dias_progreso ?? 0} / {reto.dias_objetivo ?? 7} días</strong>
              </span>
              <span className="text-[#572de4] dark:text-indigo-400 font-bold">{reto.progreso ?? 0}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
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
          {renderEnrolledContent()}
        </div>
      );
    }

    if (isModalExpired) {
      return (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-center text-xs sm:text-sm font-semibold">
          Este reto ya ha finalizado y no admite nuevas inscripciones.
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onJoin(reto)}
        disabled={isJoining || isPending}
        className="w-full py-3.5 rounded-2xl bg-[#572de4] hover:bg-[#461ebd] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
      >
        {isJoining ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trophy className="w-4 h-4" />
        )}
        <span>Unirme a este reto (+{modalPuntos} pts)</span>
      </button>
    );
  };

  const modalElement = (
    <dialog
      open
      aria-labelledby="reto-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-transparent animate-in fade-in duration-200 w-full h-full max-w-none max-h-none m-0 border-0"
    >
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm -z-10 cursor-default"
      />
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Desafío Comunitario
              </span>
              <span className="text-xs text-slate-400">
                ID: RETO-{modalId.slice(0, 6)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Badges */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200/60 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              +{modalPuntos} pts de recompensa
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-300">
              <Users className="w-3.5 h-3.5 inline mr-1" />
              {modalParticipantes} participante{modalParticipantes === 1 ? '' : 's'}
            </span>
            {isModalExpired && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                <X className="w-3 h-3" />
                Caducado
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center shrink-0 select-none shadow-xs">
              {reto.icono || '🏆'}
            </span>
            <h3 id="reto-detail-modal-title" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {reto.titulo}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {reto.descripcion || 'Sin descripción detallada disponible.'}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#572de4]" />
              Fecha de Inicio
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {reto.fechainicio || 'Inmediato'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#572de4]" />
              Fecha de Cierre
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {reto.fechafin || 'Sin fecha límite'}
            </span>
          </div>
        </div>

        {/* Status / Action */}
        {renderModalActions()}
      </div>
    </dialog>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : null;
}
