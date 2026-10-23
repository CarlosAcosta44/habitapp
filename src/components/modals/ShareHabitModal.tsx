'use client';

import React, { useState, useTransition } from 'react';
import {
  Share2,
  X,
  Droplets,
  Flame,
  BookOpen,
  Sparkles,
  Dumbbell,
  Moon,
  Info,
  Check,
  Loader2,
  Zap,
} from 'lucide-react';
import { compartirHabitoAction } from '@/actions/comunidad.actions';

interface ShareHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitos: any[];
  onShared?: (idHabito: string) => void;
  habitosPublicados?: any[];
  currentUserId?: string;
}

export function ShareHabitModal({
  isOpen,
  onClose,
  habitos = [],
  onShared,
  habitosPublicados = [],
  currentUserId,
}: ShareHabitModalProps) {
  const [isPending, startTransition] = useTransition();
  const [sharedIds, setSharedIds] = useState<Record<string, boolean>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShare = (habito: any) => {
    const id = habito.idHabito || habito.idhabito || habito.id;
    if (!id || sharedIds[id]) return;

    setLoadingId(id);
    setFeedbackError(null);

    startTransition(async () => {
      try {
        const res = await compartirHabitoAction(id);
        if (res.success) {
          setSharedIds((prev) => ({ ...prev, [id]: true }));
          if (onShared) onShared(id);
        } else {
          let errorMsg = res.message || 'Error al compartir el hábito';
          if (errorMsg.includes('invalid input syntax') || errorMsg.includes('JWT') || errorMsg.includes('Token')) {
            errorMsg = 'Error al compartir el hábito con la comunidad. Por favor reintenta.';
          }
          setFeedbackError(errorMsg);
        }
      } catch (e: any) {
        setFeedbackError(e.message || 'Error inesperado al compartir');
      } finally {
        setLoadingId(null);
      }
    });
  };

  const activeHabitos = habitos.filter(
    (h) => (h.estado ?? 'Activo').toLowerCase() === 'activo'
  );

  const getCategoryName = (habito: any): string => {
    if (typeof habito?.categoria_nombre === 'string') return habito.categoria_nombre;
    if (typeof habito?.categoria === 'string') return habito.categoria;
    if (habito?.categoria?.nombre && typeof habito.categoria.nombre === 'string') return habito.categoria.nombre;
    if (habito?.categorias_habitos?.nombre && typeof habito.categorias_habitos.nombre === 'string') return habito.categorias_habitos.nombre;
    return 'Hábito diario';
  };

  const getCategoryIcon = (catName?: any) => {
    const raw = typeof catName === 'string' ? catName : (catName?.nombre || '');
    const name = (raw || '').toLowerCase();
    if (name.includes('agua') || name.includes('hidrat')) return Droplets;
    if (name.includes('ejercicio') || name.includes('movim') || name.includes('físic')) return Dumbbell;
    if (name.includes('sueño') || name.includes('dormir') || name.includes('noche')) return Moon;
    if (name.includes('mente') || name.includes('emocion') || name.includes('gratitud')) return BookOpen;
    return Zap;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-[650px] bg-white dark:bg-[#111827] rounded-3xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)] border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm border border-blue-100 dark:border-blue-900/50">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                Compartir Hábito
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Elige uno de tus hábitos activos para inspirar y ayudar a otros miembros de la comunidad.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Header */}
        <div className="px-6 sm:px-7 py-3 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
            Tus Hábitos Activos
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {activeHabitos.length} disponibles
          </span>
        </div>

        {feedbackError && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 break-words">
            {feedbackError}
          </div>
        )}

        {/* Habits List */}
        <div className="p-6 sm:p-7 py-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto no-scrollbar">
          {activeHabitos.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tienes hábitos activos disponibles para compartir.</p>
            </div>
          ) : (
            activeHabitos.map((habito) => {
              const id = habito.idHabito || habito.idhabito || habito.id;
              const habitName = (habito.nombre || '').trim().toLowerCase();
              const alreadyPublished =
                Array.isArray(habitosPublicados) &&
                habitosPublicados.some((ph) => {
                  const phUserId = ph.idusuario || ph.idUsuario || ph.usuario_id;
                  const matchUser = !currentUserId || phUserId === currentUserId;
                  const phHabitId = ph.idhabito || ph.idHabito;
                  const phName = (ph.nombre_habito || ph.titulo || ph.nombre || '').trim().toLowerCase();
                  return matchUser && ((phHabitId && phHabitId === id) || (Boolean(habitName) && phName === habitName));
                });

              const isShared = Boolean(sharedIds[id]) || Boolean(habito.es_publico) || Boolean(habito.compartido) || alreadyPublished;
              const isLoading = loadingId === id;
              const catName = getCategoryName(habito);
              const CatIcon = getCategoryIcon(catName);
              const racha = habito.rachaActual ?? 0;

              return (
                <div
                  key={id}
                  className="bg-white dark:bg-[#151c2c] hover:bg-slate-50 dark:hover:bg-[#1a2337] transition-all p-4 rounded-2xl flex items-center justify-between gap-4 border border-slate-200/80 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
                        {catName}
                      </span>
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        {habito.nombre}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          Racha de {racha} {racha === 1 ? 'día' : 'días'}
                        </span>
                        <span>•</span>
                        <span>
                          {habito.metaDiaria ? `${habito.metaDiaria} ${habito.unidadMedida || 'meta'} diarios` : 'Rutina diaria'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {isShared ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Compartido</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleShare(habito)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all shrink-0 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Compartir</span>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Privacy Notice Box */}
        <div className="px-6 sm:px-7 py-3">
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 p-3.5 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Al compartir, solo se mostrará el nombre y tu consejo del hábito. Tus notas y datos privados no serán visibles para el resto de la comunidad.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-7 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
