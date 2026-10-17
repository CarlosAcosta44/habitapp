'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  X,
  Archive,
  RotateCcw,
  Trash2,
  Sparkles,
  Dumbbell,
  Zap,
  Utensils,
  Moon,
  Smile,
  Droplets,
  BookOpen,
  Heart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
} from 'lucide-react';
import {
  getArchivadosAction,
  reactivarHabitoAction,
  deleteHabitoAction,
} from '@/actions/habito.actions';

interface ArchivedHabitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReactivate?: (idHabito: string) => void;
  onDelete?: (idHabito: string) => void;
}

export function ArchivedHabitsModal({
  isOpen,
  onClose,
  onReactivate,
  onDelete,
}: ArchivedHabitsModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [habitos, setHabitos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar hábitos archivados al abrir el modal
  const fetchArchivados = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getArchivadosAction();
      setHabitos(Array.isArray(data) ? data : []);
    } catch (_err: unknown) {
      // Notificar al usuario amigablemente en caso de error de red
      setErrorMsg('No se pudieron cargar los hábitos archivados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void fetchArchivados();
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  // Reactivar hábito
  const handleReactivate = (habito: any) => {
    const id = habito.idHabito || habito.idhabito;
    const nombre = habito.nombre || 'Hábito';
    setActionId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await reactivarHabitoAction(id);
      if (res.success) {
        setHabitos((prev) => prev.filter((h) => (h.idHabito || h.idhabito) !== id));
        setSuccessMsg(`¡"${nombre}" ha sido reactivado y volvió a tu rutina diaria! ✨`);
        if (onReactivate) onReactivate(id);
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Error al reactivar el hábito');
      }
      setActionId(null);
    });
  };

  // Eliminar hábito permanentemente
  const handleDelete = (habito: any) => {
    const id = habito.idHabito || habito.idhabito;
    const nombre = habito.nombre || 'Hábito';

    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar permanentemente "${nombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setActionId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', id);

      const res = await deleteHabitoAction(null, fd);
      if (res.success) {
        setHabitos((prev) => prev.filter((h) => (h.idHabito || h.idhabito) !== id));
        setSuccessMsg(`"${nombre}" ha sido eliminado permanentemente.`);
        if (onDelete) onDelete(id);
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Error al eliminar el hábito');
      }
      setActionId(null);
    });
  };

  // Helper para obtener icono y color de categoría
  const getCategoryInfo = (habito: any) => {
    const catNombre =
      habito.categoria?.nombre ||
      habito.categorias_habitos?.nombre ||
      'General';
    const catLower = catNombre.toLowerCase();

    if (catLower.includes('ejercicio') || catLower.includes('deporte') || catLower.includes('gym')) {
      return { Icon: Dumbbell, color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/70', name: catNombre };
    }
    if (catLower.includes('productiv') || catLower.includes('trabajo') || catLower.includes('estudio')) {
      return { Icon: Zap, color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70', name: catNombre };
    }
    if (catLower.includes('nutri') || catLower.includes('comida') || catLower.includes('aliment')) {
      return { Icon: Utensils, color: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/70', name: catNombre };
    }
    if (catLower.includes('sueño') || catLower.includes('dormir') || catLower.includes('descanso')) {
      return { Icon: Moon, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/70', name: catNombre };
    }
    if (catLower.includes('mental') || catLower.includes('mindful') || catLower.includes('paz')) {
      return { Icon: Heart, color: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/70', name: catNombre };
    }
    if (catLower.includes('agua') || catLower.includes('hidrata')) {
      return { Icon: Droplets, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/70', name: catNombre };
    }
    if (catLower.includes('lectura') || catLower.includes('libro')) {
      return { Icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70', name: catNombre };
    }
    return { Icon: Sparkles, color: 'text-[#572de4] dark:text-indigo-400 bg-[#572de4]/10 dark:bg-indigo-950/70', name: catNombre };
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="presentation"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-[0_20px_50px_rgba(87,45,228,0.2)] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Encabezado del Modal ── */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-sm">
              <Archive className="w-5 h-5 text-[#572de4] dark:text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Hábitos Archivados
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {habitos.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pausados de tu rutina diaria. Puedes reactivarlos en cualquier momento.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Alertas de Feedback ── */}
        {successMsg && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="flex-1">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* ── Contenido / Lista de Hábitos Archivados ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#572de4]" />
              <p className="text-xs font-semibold">Cargando hábitos archivados...</p>
            </div>
          ) : habitos.length === 0 ? (
            <div className="py-14 px-4 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                <Archive className="w-7 h-7" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                No tienes hábitos archivados
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Cuando desees pausar un hábito sin perder su historial de estadísticas, archívalo desde su ventana de detalle y se guardará aquí.
              </p>
            </div>
          ) : (
            habitos.map((habito) => {
              const id = habito.idHabito || habito.idhabito;
              const nombre = habito.nombre;
              const descripcion = habito.descripcion;
              const metaDiaria = habito.metaDiaria ?? habito.meta_diaria ?? 1;
              const unidadMedida = habito.unidadMedida ?? habito.unidad_medida ?? 'veces';
              const { Icon, color, name: catName } = getCategoryInfo(habito);
              const isItemBusy = actionId === id;

              return (
                <div
                  key={id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                          {nombre}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/70 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                          {catName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          Archivado
                        </span>
                      </div>

                      {descripcion && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {descripcion}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Target className="w-3 h-3 text-[#572de4] dark:text-indigo-400" />
                          Meta: {metaDiaria} {unidadMedida}/día
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDelete(habito)}
                      disabled={isItemBusy || isPending}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 active:scale-95 transition-all disabled:opacity-40"
                      title="Eliminar permanentemente"
                    >
                      {isItemBusy ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReactivate(habito)}
                      disabled={isItemBusy || isPending}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white active:scale-95 shadow-sm text-xs font-bold transition-all disabled:opacity-40"
                      title="Reactivar hábito en el dashboard"
                    >
                      {isItemBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                      <span>Reactivar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer del Modal ── */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {habitos.length > 0
              ? 'Reactivar un hábito lo colocará de inmediato en tus hábitos de hoy.'
              : 'Gestor de hábitos pausados de HabitApp'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
