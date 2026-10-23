'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Dumbbell,
  Zap,
  Utensils,
  Moon,
  Smile,
  Droplets,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { createHabitoAction, getCategoriasAction } from '@/actions/habito.actions';
import { getLocalDateString } from '@/lib/date-utils';
import type { CategoriaHabito } from '@/domain/habito.types';

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHabitCreated?: () => void;
}

// Configuración de las 6 categorías del diseño visual
const CATEGORIAS_CONFIG = [
  { id: 'cat-ejercicio', nombre: 'Ejercicio', icon: Dumbbell },
  { id: 'cat-productividad', nombre: 'Productividad', icon: Zap },
  { id: 'cat-nutricion', nombre: 'Nutrición', icon: Utensils },
  { id: 'cat-sueno', nombre: 'Sueño', icon: Moon },
  { id: 'cat-salud-mental', nombre: 'Salud Mental', icon: Smile },
  { id: 'cat-hidratacion', nombre: 'Hidratación', icon: Droplets },
];

const DIAS_SEMANA = [
  { num: 1, label: 'L', name: 'Lunes' },
  { num: 2, label: 'M', name: 'Martes' },
  { num: 3, label: 'M', name: 'Miércoles' },
  { num: 4, label: 'J', name: 'Jueves' },
  { num: 5, label: 'V', name: 'Viernes' },
  { num: 6, label: 'S', name: 'Sábado' },
  { num: 7, label: 'D', name: 'Domingo' },
];

export function NewHabitModal({ isOpen, onClose, onHabitCreated }: NewHabitModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [nombre, setNombre] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Ejercicio');
  const [descripcion, setDescripcion] = useState('');
  const [frequencyPreset, setFrequencyPreset] = useState<'todos' | 'laborales' | 'personalizado'>('todos');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [metaDiaria, setMetaDiaria] = useState<number | string>(1);
  const [unidadMedida, setUnidadMedida] = useState('veces');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminders, setReminders] = useState<string[]>(['08:00']);

  // Async & UI states
  const [dbCategorias, setDbCategorias] = useState<CategoriaHabito[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Solo montar portal en cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar categorías reales de la base de datos
  useEffect(() => {
    if (isOpen) {
      void getCategoriasAction()
        .then((cats) => {
          if (cats && cats.length > 0) {
            setDbCategorias(cats);
          }
        })
        .catch(() => {
          // Si falla, se usan las categorías predefinidas por defecto
        });
    }
  }, [isOpen]);

  // Manejar selector rápido de frecuencia
  const handlePresetChange = (preset: 'todos' | 'laborales' | 'personalizado') => {
    setFrequencyPreset(preset);
    if (preset === 'todos') {
      setSelectedDays([1, 2, 3, 4, 5, 6, 7]);
    } else if (preset === 'laborales') {
      setSelectedDays([1, 2, 3, 4, 5]);
    }
  };

  // Toggle de un día individual
  const handleToggleDay = (diaNum: number) => {
    let newDays: number[];
    if (selectedDays.includes(diaNum)) {
      if (selectedDays.length === 1) return; // Mínimo un día seleccionado
      newDays = selectedDays.filter((d) => d !== diaNum);
    } else {
      newDays = [...selectedDays, diaNum].sort((a, b) => a - b);
    }
    setSelectedDays(newDays);

    if (newDays.length === 7) {
      setFrequencyPreset('todos');
    } else if (
      newDays.length === 5 &&
      [1, 2, 3, 4, 5].every((d) => newDays.includes(d))
    ) {
      setFrequencyPreset('laborales');
    } else {
      setFrequencyPreset('personalizado');
    }
  };

  // Manejadores de recordatorios múltiples
  const handleAddReminder = () => {
    setReminders((prev) => [...prev, '12:00']);
  };

  const handleUpdateReminder = (index: number, newTime: string) => {
    setReminders((prev) => prev.map((t, i) => (i === index ? newTime : t)));
  };

  const handleRemoveReminder = (index: number) => {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset del formulario
  const handleReset = () => {
    setNombre('');
    setSelectedCategoria('Ejercicio');
    setDescripcion('');
    setFrequencyPreset('todos');
    setSelectedDays([1, 2, 3, 4, 5, 6, 7]);
    setMetaDiaria(1);
    setUnidadMedida('veces');
    setReminderEnabled(false);
    setReminders(['08:00']);
    setErrorMessage(null);
    setIsSubmitting(false);
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedNombre = nombre.trim();
    if (trimmedNombre.length < 3) {
      setErrorMessage('El nombre del hábito debe tener al menos 3 caracteres.');
      return;
    }
    if (trimmedNombre.length > 45) {
      setErrorMessage('El nombre no puede superar 45 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Resolver ID de la categoría (UUID de la BD si coincide, o fallback por nombre)
      const matchedCat = dbCategorias.find(
        (c) => c.nombre.toLowerCase() === selectedCategoria.toLowerCase()
      );
      const idCatToSend = matchedCat ? matchedCat.idCategoria : selectedCategoria;

      const hoyStr = getLocalDateString(new Date());

      const formData = new FormData();
      formData.append('nombre', trimmedNombre);
      if (descripcion.trim()) {
        formData.append('descripcion', descripcion.trim());
      }
      formData.append('fechaInicio', hoyStr);
      formData.append('puntos', '10'); // 10 puntos por defecto
      formData.append('idCategoria', idCatToSend);
      formData.append('metaDiaria', (Number(metaDiaria) || 1).toString());
      formData.append('unidadMedida', unidadMedida.trim() || 'veces');
      formData.append('diasSemana', JSON.stringify(selectedDays));

      if (reminderEnabled && reminders.length > 0) {
        formData.append('recordatorios', JSON.stringify(reminders));
      }

      const res = await createHabitoAction(null, formData);

      if (res.success) {
        handleReset();
        onClose();
        router.refresh();
        onHabitCreated?.();
      } else {
        setErrorMessage(res.message || 'No se pudo crear el hábito. Por favor intenta de nuevo.');
      }
    } catch (err: any) {
      console.error('Error al crear hábito:', err);
      setErrorMessage(err?.message || 'Ocurrió un error inesperado al guardar el hábito.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-[0_20px_50px_rgba(87,45,228,0.2)] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header del Modal ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#572de4]/10 dark:bg-indigo-950/80 flex items-center justify-center text-[#572de4] dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Crear nuevo hábito
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Define una rutina para cuidar tu bienestar y constancia
            </p>
          </div>

          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
            title="Cerrar"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Cuerpo del Modal (Scrollable Form) ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
          {/* Alerta de Error */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm text-red-600 dark:text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Nombre del hábito */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Nombre del hábito *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="p. ej., Meditación guiada matutina, Beber 2L de agua..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#572de4] transition-all"
            />
          </div>

          {/* 2. Icono y Categoría */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Icono y Categoría
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {CATEGORIAS_CONFIG.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategoria.toLowerCase() === cat.nombre.toLowerCase();

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoria(cat.nombre)}
                    className={`
                      flex items-center gap-2 p-2 sm:p-2.5 rounded-xl transition-all font-semibold text-left
                      ${
                        isSelected
                          ? 'bg-[#572de4]/10 dark:bg-[#572de4]/20 border-2 border-[#572de4] text-[#572de4] dark:text-indigo-300 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                        isSelected ? 'text-[#572de4] dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    <span className="truncate text-xs sm:text-sm">{cat.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Propósito y motivación */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Propósito y motivación
            </label>
            <textarea
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="¿Por qué es importante para ti este hábito? (Opcional)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#572de4] transition-all resize-none"
            />
          </div>

          {/* 4. Frecuencia y Días */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Frecuencia y Días
              </label>

              {/* Segmented Controller de Frecuencia */}
              <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/40 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePresetChange('todos')}
                  className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-lg text-[11px] sm:text-xs text-center transition-all truncate ${
                    frequencyPreset === 'todos'
                      ? 'font-semibold bg-white dark:bg-slate-700 text-[#572de4] dark:text-indigo-300 shadow-sm'
                      : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Todos los días
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('laborales')}
                  className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-lg text-[11px] sm:text-xs text-center transition-all truncate ${
                    frequencyPreset === 'laborales'
                      ? 'font-semibold bg-white dark:bg-slate-700 text-[#572de4] dark:text-indigo-300 shadow-sm'
                      : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Laborales
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('personalizado')}
                  className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-lg text-[11px] sm:text-xs text-center transition-all truncate ${
                    frequencyPreset === 'personalizado'
                      ? 'font-semibold bg-white dark:bg-slate-700 text-[#572de4] dark:text-indigo-300 shadow-sm'
                      : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Personalizado
                </button>
              </div>
            </div>

            {/* Días circulares [L, M, M, J, V, S, D] */}
            <div className="flex items-center justify-between gap-1 pt-1 w-full">
              {DIAS_SEMANA.map((dia) => {
                const isSelected = selectedDays.includes(dia.num);

                return (
                  <button
                    key={dia.num}
                    type="button"
                    onClick={() => handleToggleDay(dia.num)}
                    title={dia.name}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center transition-all select-none
                      ${
                        isSelected
                          ? 'bg-[#572de4] text-white shadow-[0_2px_8px_rgba(87,45,228,0.3)] scale-105'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold'
                      }
                    `}
                  >
                    {dia.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Meta diaria y Recordatorios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Meta diaria */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Meta diaria
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={metaDiaria}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setMetaDiaria('');
                    } else {
                      const num = Number.parseInt(val, 10);
                      if (!Number.isNaN(num)) setMetaDiaria(num);
                    }
                  }}
                  onBlur={() => {
                    if (metaDiaria === '' || Number(metaDiaria) < 1) {
                      setMetaDiaria(1);
                    }
                  }}
                  className="w-20 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white font-bold text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#572de4]"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    list="unidades-sugeridas-crear"
                    value={unidadMedida}
                    onChange={(e) => setUnidadMedida(e.target.value)}
                    placeholder="Unidad (ej: minutos, km...)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#572de4]"
                  />
                  <datalist id="unidades-sugeridas-crear">
                    <option value="veces" />
                    <option value="minutos" />
                    <option value="páginas" />
                    <option value="vasos" />
                    <option value="km" />
                    <option value="horas" />
                    <option value="pasos" />
                    <option value="porciones" />
                    <option value="capítulos" />
                    <option value="repeticiones" />
                    <option value="series" />
                  </datalist>
                </div>
              </div>
            </div>

            {/* Recordatorios */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Recordatorios
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      reminderEnabled
                        ? 'bg-[#572de4]/15 text-[#572de4] dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {(() => {
                      if (!reminderEnabled) return 'Desactivado';
                      const sufijo = reminders.length === 1 ? 'activo' : 'activos';
                      return `${reminders.length} ${sufijo}`;
                    })()}
                  </span>

                  {/* Toggle switch */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !reminderEnabled;
                      setReminderEnabled(next);
                      if (next && reminders.length === 0) {
                        setReminders(['08:00']);
                      }
                    }}
                    className={`
                      w-11 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0
                      ${reminderEnabled ? 'bg-[#572de4] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}
                    `}
                    title={reminderEnabled ? 'Desactivar recordatorios' : 'Activar recordatorios'}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
              </div>

              {reminderEnabled && (
                <div className="flex flex-col gap-2 pt-1">
                  {reminders.map((time, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 text-sm">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => handleUpdateReminder(idx, e.target.value)}
                          className="bg-transparent font-medium w-full focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveReminder(idx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Eliminar recordatorio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddReminder}
                    className="self-start text-xs font-semibold text-[#572de4] dark:text-indigo-400 hover:underline flex items-center gap-1 pt-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir otro recordatorio</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* ── Footer del Modal ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-sm font-bold shadow-[0_4px_16px_rgba(87,45,228,0.3)] hover:shadow-[0_6px_20px_rgba(87,45,228,0.4)] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Crear Hábito</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
