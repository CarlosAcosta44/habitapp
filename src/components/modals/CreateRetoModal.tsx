'use client';

import React, { useState, useTransition } from 'react';
import {
  Trophy,
  X,
  Sparkles,
  Calendar,
  Star,
  Loader2,
  Award,
  Flame,
  Zap,
  Heart,
  Droplets,
  BookOpen,
  Target,
} from 'lucide-react';
import { createRetoAction } from '@/actions/comunidad.actions';

interface CreateRetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BADGES = ['🏆', '⚡', '🔥', '💪', '🧠', '🥗', '💧', '📚', '🧘'];

export function CreateRetoModal({ isOpen, onClose, onSuccess }: CreateRetoModalProps) {
  const [isPending, startTransition] = useTransition();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('🏆');
  const [diasObjetivo, setDiasObjetivo] = useState(30);
  const [fechaInicio, setFechaInicio] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [fechaFin, setFechaFin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || titulo.trim().length < 5) {
      setErrorMsg('El título del reto debe tener al menos 5 caracteres');
      return;
    }
    if (!descripcion.trim() || descripcion.trim().length < 10) {
      setErrorMsg('La descripción del reto debe tener al menos 10 caracteres');
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('titulo', titulo.trim());
      fd.set('descripcion', descripcion.trim());
      fd.set('puntosRecompensa', '50');
      fd.set('fechaInicio', fechaInicio);
      if (fechaFin) fd.set('fechaFin', fechaFin);
      fd.set('insigniaRecompensa', selectedBadge);
      fd.set('icono', selectedBadge);
      fd.set('diasObjetivo', diasObjetivo.toString());

      const res = await createRetoAction(null, fd);
      if (res.success) {
        setTitulo('');
        setDescripcion('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Error al crear el reto comunitario');
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#572de4]/10 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Crear Reto Comunitario
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Lanza un nuevo desafío para motivar a toda la comunidad
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Título del Reto *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: 30 Días sin Azúcar Refinada"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#572de4]"
              required
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Descripción y Reglas *
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Explica en qué consiste el reto y cómo cumplirlo diariamente..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#572de4] resize-none"
              required
            />
          </div>

          {/* Puntos e Insignia */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recompensa
              </label>
              <div className="w-full px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>+50 pts</span>
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Estándar</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Insignia / Ícono
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {BADGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBadge(b)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all shrink-0 ${
                      selectedBadge === b
                        ? 'bg-[#572de4] text-white ring-2 ring-[#572de4]/40 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meta del Reto en Días */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#572de4]" />
                Meta de Cumplimiento (Días) *
              </label>
              <span className="text-xs font-bold text-[#572de4] bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
                {diasObjetivo} check-ins requeridos
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cada participante debe hacer {diasObjetivo} check-ins diarios para completar el reto.
            </p>

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {[7, 14, 21, 30, 60].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiasObjetivo(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    diasObjetivo === d
                      ? 'bg-[#572de4] text-white shadow-sm ring-2 ring-[#572de4]/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {d} días
                </button>
              ))}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[11px] text-slate-400">Otro:</span>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={diasObjetivo}
                  onChange={(e) => setDiasObjetivo(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#572de4]"
                />
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#572de4]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Fecha de Fin (Opcional)
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#572de4]"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trophy className="w-4 h-4" />
              )}
              <span>Crear Reto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
