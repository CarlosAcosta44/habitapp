'use client';

import React, { useState, useMemo, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MessageSquare,
  Users,
  Sparkles,
  BookOpen,
  Award,
  Plus,
  ArrowRight,
  Heart,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  ShieldCheck,
  Star,
  Flag,
  Share2,
  Dumbbell,
  Zap,
  Utensils,
  Moon,
  Smile,
  Droplets,
  Edit3,
} from 'lucide-react';
import type { Reto } from '@/domain/reto.types';
import {
  clonarHabitoAction,
  unirseRetoAction,
  reaccionarAction,
} from '@/actions/comunidad.actions';
import { CreateForoModal } from '@/components/modals/CreateForoModal';
import { ShareHabitModal } from '@/components/modals/ShareHabitModal';

interface ComunidadInteractiveViewProps {
  initialForos: any[];
  initialHabitosComunidad: any[];
  initialArticulos: any[];
  initialEspecialistas: any[];
  initialRetos: Reto[];
  userHabitos?: any[];
  userId?: string;
  isAdmin?: boolean;
}

type TabType = 'todo' | 'foros' | 'habitos' | 'articulos' | 'especialistas' | 'retos';

export function ComunidadInteractiveView({
  initialForos = [],
  initialHabitosComunidad = [],
  initialArticulos = [],
  initialEspecialistas = [],
  initialRetos = [],
  userHabitos = [],
  userId,
  isAdmin = false,
}: ComunidadInteractiveViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tab activo
  const [activeTab, setActiveTab] = useState<TabType>('todo');

  // Buscador y atajo ⌘K
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Filtro de categoría en Foros
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'recientes' | 'populares' | 'sin_responder'>('recientes');

  // Modal para crear foro y compartir hábito
  const [isCreateForoOpen, setIsCreateForoOpen] = useState(false);
  const [isShareHabitOpen, setIsShareHabitOpen] = useState(false);

  // Feedback de acciones
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [joiningRetoId, setJoiningRetoId] = useState<string | null>(null);
  const [reactingForoId, setReactingForoId] = useState<string | null>(null);

  // Modal de especialista para agendar o ver perfil
  const [selectedSpecialist, setSelectedSpecialist] = useState<any | null>(null);

  // Atajo de teclado ⌘K o Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mostrar toast auto-ocultable
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ── Filtrado de Hábitos Comunitarios ──
  const habitosFiltrados = useMemo(() => {
    let list = initialHabitosComunidad;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.nombre?.toLowerCase().includes(q) ||
          h.descripcion?.toLowerCase().includes(q) ||
          h.categoria_nombre?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialHabitosComunidad, searchQuery]);

  // ── Filtrado y Orden de Foros ──
  const forosFiltrados = useMemo(() => {
    let list = [...initialForos];

    if (selectedTag !== 'Todos') {
      const cleanTag = selectedTag.replace('#', '').toLowerCase();
      list = list.filter((f) =>
        f.categoria?.toLowerCase().includes(cleanTag)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.titulo?.toLowerCase().includes(q) ||
          f.descripcion?.toLowerCase().includes(q) ||
          f.categoria?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'populares') {
      list.sort((a, b) => (b.likes_count || 0) + (b.comments_count || 0) - ((a.likes_count || 0) + (a.comments_count || 0)));
    } else if (sortBy === 'sin_responder') {
      list = list.filter((f) => (f.comments_count || 0) === 0);
    } else {
      // Recientes
      list.sort((a, b) => new Date(b.fechacreacion || 0).getTime() - new Date(a.fechacreacion || 0).getTime());
    }

    return list;
  }, [initialForos, selectedTag, sortBy, searchQuery]);

  // ── Filtrado de Artículos ──
  const articulosFiltrados = useMemo(() => {
    let list = initialArticulos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.titulo?.toLowerCase().includes(q) ||
          a.contenido?.toLowerCase().includes(q) ||
          a.categoria?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialArticulos, searchQuery]);

  // ── Filtrado de Especialistas ──
  const especialistasFiltrados = useMemo(() => {
    let list = initialEspecialistas;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.nombre?.toLowerCase().includes(q) ||
          e.apellido?.toLowerCase().includes(q) ||
          e.especialidad?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialEspecialistas, searchQuery]);

  // ── Filtrado de Retos ──
  const retosFiltrados = useMemo(() => {
    let list = initialRetos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.titulo?.toLowerCase().includes(q) ||
          r.descripcion?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialRetos, searchQuery]);

  // ── Acción: Clonar Hábito Comunitario ──
  const handleCloneHabit = (habito: any) => {
    const id = habito.idhabito || habito.id;
    const nombre = habito.nombre || 'Hábito';
    setCloningId(id);

    startTransition(async () => {
      const res = await clonarHabitoAction(id);
      if (res.success) {
        showToast(`¡"${nombre}" ha sido añadido a tus hábitos diarios! 🎯`);
        router.refresh();
      } else {
        showToast(res.message || 'Error al clonar hábito');
      }
      setCloningId(null);
    });
  };

  // ── Acción: Unirse a Reto ──
  const handleJoinReto = (reto: Reto) => {
    const id = reto.idreto || reto.idReto || reto.id || '';
    setJoiningRetoId(id);

    startTransition(async () => {
      const res = await unirseRetoAction(id);
      if (res.success) {
        showToast(`¡Te uniste a "${reto.titulo}"! 🏆`);
        router.refresh();
      } else {
        showToast(res.message || 'Error al unirse al reto');
      }
      setJoiningRetoId(null);
    });
  };

  // ── Acción: Reaccionar a un Foro ──
  const handleLikeForo = (foro: any) => {
    const id = foro.idforo || foro.idForo;
    setReactingForoId(id);

    startTransition(async () => {
      const res = await reaccionarAction('foro', id, 'like');
      if (res.success) {
        router.refresh();
      }
      setReactingForoId(null);
    });
  };

  // Formato relativo de tiempo
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Reciente';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 2) return 'Ahora mismo';
    if (diffMin < 60) return `hace ${diffMin} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    return `hace ${diffDays} días`;
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-7 pb-16">
      {/* ── Toast de Feedback Flotante ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Top Header & Stats ── */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Comunidad &amp; Bienestar
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                4,890 miembros conectados
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateForoOpen(true)}
            className="sm:hidden self-start px-4 py-2 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Crear foro</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Espacio seguro y colaborativo para compartir rutinas, debatir en círculos de apoyo y conectar con especialistas verificados.
        </p>

        {/* ── Barra de Búsqueda con Atajo ⌘K ── */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar foros, hábitos comunitarios, artículos o especialistas..."
            className="w-full h-12 pl-12 pr-20 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#572de4] transition-all"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* ── Pestañas Horizontales de Categorías ── */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('todo')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'todo'
                ? 'bg-[#572de4] text-white'
                : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Todo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('foros')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'foros'
                ? 'bg-[#572de4] text-white'
                : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Foros de Apoyo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('habitos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'habitos'
                ? 'bg-[#572de4] text-white'
                : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Hábitos Compartidos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('articulos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'articulos'
                ? 'bg-[#572de4] text-white'
                : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Artículos y Guías</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('especialistas')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'especialistas'
                ? 'bg-[#572de4] text-white'
                : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Especialistas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('retos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'retos'
                ? 'bg-[#572de4] text-white'
                : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Retos</span>
          </button>
        </div>
      </div>

      {/* ── Banner Destacado para Crear Foro ── */}
      {(activeTab === 'todo' || activeTab === 'foros') && (
        <section className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#572de4]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col gap-2 max-w-xl relative z-10">
            <div className="flex items-center gap-2 text-[#572de4] dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Iniciativa comunitaria</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              ¿Quieres iniciar una conversación?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Crea un foro, comparte tus reflexiones y conecta con otros miembros de la comunidad en un entorno de apoyo y empatía.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateForoOpen(true)}
              className="h-11 px-6 rounded-2xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Crear foro</span>
            </button>
          </div>
        </section>
      )}

      {/* ── Banner Destacado para Compartir Hábito (Diseño HabitApp Hábitos de la Comunidad) ── */}
      {activeTab === 'habitos' && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#572de4] via-indigo-600 to-violet-700 text-white p-6 sm:p-8 shadow-md">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold w-fit uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Comunidad en Movimiento</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Inspira a miles compartiendo tu hábito
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                Tus pequeñas victorias diarias pueden encender el cambio que alguien más está buscando hoy. Conecta y crece en colectivo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsShareHabitOpen(true)}
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#572de4] font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Compartir hábito</span>
            </button>
          </div>
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
        </section>
      )}

      {/* ── Multi-Column Grid Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        {/* ═══════════ COLUMNA PRINCIPAL (8 Cols) ═══════════ */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* ── BLOCK 1: HÁBITOS DE LA COMUNIDAD ── */}
          {(activeTab === 'todo' || activeTab === 'habitos') && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#572de4] dark:text-indigo-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Hábitos de la comunidad
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Inspirados por otros miembros para cuidar la salud emocional día a día.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsShareHabitOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#572de4]/10 dark:bg-indigo-950/80 hover:bg-[#572de4]/20 text-[#572de4] dark:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Compartir hábito</span>
                  </button>
                  {activeTab === 'todo' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('habitos')}
                      className="text-xs font-bold text-[#572de4] dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Ver todos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {habitosFiltrados.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                  <p className="text-xs text-slate-400">No se encontraron hábitos en esta búsqueda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {habitosFiltrados.slice(0, activeTab === 'habitos' ? 30 : 3).map((habito) => {
                    const id = habito.idhabito || habito.id;
                    const isCloningThis = cloningId === id;

                    return (
                      <div
                        key={id}
                        className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-xl bg-[#572de4]/10 dark:bg-indigo-950/70 text-[#572de4] dark:text-indigo-400 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                              {habito.categoria_nombre || 'General'}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                              {habito.nombre}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                              {habito.descripcion || 'Hábito saludable para tu bienestar diario.'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                            <Users className="w-3.5 h-3.5 text-[#572de4]" />
                            <span>
                              {habito.clones_count ? `${habito.clones_count} hacen esto` : 'Popular'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCloneHabit(habito)}
                            disabled={isCloningThis || isPending}
                            className="px-3.5 py-1.5 rounded-full bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                          >
                            {isCloningThis ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                            <span>Añadir</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ── BLOCK 2: FOROS Y CÍRCULOS DE APOYO ── */}
          {(activeTab === 'todo' || activeTab === 'foros') && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#572de4] dark:text-indigo-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Foros y Círculos de Apoyo
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Conversaciones reales, empáticas y respetuosas guiadas por la comunidad.
                  </p>
                </div>

                {activeTab === 'todo' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('foros')}
                    className="text-xs font-bold text-[#572de4] dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Ver todos los foros</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filtros de Hashtags y Orden (solo visible en pestaña foros o todo) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {['Todos', '#Ansiedad', '#Mindfulness', '#Autoestima', '#Sueño', '#Crecimiento personal'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedTag === tag
                            ? 'bg-[#572de4] text-white shadow-sm'
                            : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#572de4]"
                  >
                    <option value="recientes">Más recientes</option>
                    <option value="populares">Más populares</option>
                    <option value="sin_responder">Sin responder</option>
                  </select>
                </div>
              </div>

              {/* Lista de Foros */}
              {forosFiltrados.length === 0 ? (
                <div className="text-center py-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No hay conversaciones disponibles en esta categoría
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateForoOpen(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#572de4] text-white text-xs font-bold"
                  >
                    Sé el primero en iniciar una conversación
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {forosFiltrados.slice(0, activeTab === 'foros' ? 30 : 2).map((foro) => {
                    const id = foro.idforo || foro.idForo;
                    const authorName = foro.usuarios
                      ? `${foro.usuarios.nombre || ''} ${foro.usuarios.apellido || ''}`.trim() || 'Miembro HabitApp'
                      : 'Miembro HabitApp';
                    const initials = authorName
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <article
                        key={id}
                        className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#572de4]/10 dark:bg-indigo-950/80 flex items-center justify-center text-xs font-bold text-[#572de4] dark:text-indigo-300">
                              {initials}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {authorName}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <span className="text-[11px] text-slate-400">
                                  {formatTimeAgo(foro.fechacreacion)}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-[#572de4] dark:text-indigo-400">
                                #{foro.categoria || 'General'}
                              </span>
                            </div>
                          </div>

                          {(foro.likes_count || 0) > 10 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 text-[11px] font-semibold">
                              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                              Destacado
                            </span>
                          )}
                        </div>

                        <div>
                          <Link href={`/comunidad/foros/${id}`}>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-[#572de4] dark:hover:text-indigo-300 transition-colors cursor-pointer leading-snug">
                              {foro.titulo}
                            </h3>
                          </Link>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                            {foro.descripcion}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-5">
                            <Link
                              href={`/comunidad/foros/${id}`}
                              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#572de4] text-xs font-medium transition-colors"
                            >
                              <MessageCircle className="w-4 h-4 text-[#572de4]" />
                              <span>{foro.comments_count || 0} respuestas</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleLikeForo(foro)}
                              disabled={reactingForoId === id || isPending}
                              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 text-xs font-medium transition-colors"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  foro.liked_by_me ? 'fill-rose-500 text-rose-500' : 'text-rose-500'
                                }`}
                              />
                              <span>{foro.likes_count || 0} apoyos</span>
                            </button>
                          </div>

                          <Link
                            href={`/comunidad/foros/${id}`}
                            className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#572de4]/10 hover:text-[#572de4] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <span>Participar</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ── BLOCK 3: ARTÍCULOS Y GUÍAS CLÍNICAS ── */}
          {(activeTab === 'todo' || activeTab === 'articulos') && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#572de4] dark:text-indigo-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Artículos y Guías Clínicas
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Contenido respaldado por evidencia científica y revisado por profesionales.
                  </p>
                </div>

                {activeTab === 'todo' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('articulos')}
                    className="text-xs font-bold text-[#572de4] dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Ver biblioteca</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {articulosFiltrados.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                  <p className="text-xs text-slate-400">No se encontraron artículos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articulosFiltrados.slice(0, activeTab === 'articulos' ? 20 : 4).map((art) => {
                    const id = art.idarticulo || art.idArticulo || art.id;

                    return (
                      <div
                        key={id}
                        className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#572de4]/10 text-[#572de4] dark:bg-indigo-950/80 dark:text-indigo-300 text-[11px] font-semibold">
                              {art.categoria || 'Salud Mental'}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              5 min lectura
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                              {art.titulo}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                              {art.contenido}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[#572de4] dark:text-indigo-400 text-[11px] font-bold">
                            EV
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                              Dra. Elena Vidal
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Psiquiatra Colegiada
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ═══════════ SIDEBAR LATERAL (4 Cols) ═══════════ */}
        <aside className="xl:col-span-4 flex flex-col gap-6">
          {/* ── WIDGET 1: ESPECIALISTAS VERIFICADOS ── */}
          <section className="flex flex-col gap-4 p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#572de4] dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Especialistas Verificados
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Terapeutas colegiados con sesiones online confidenciales y personalizadas.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              {especialistasFiltrados.slice(0, 3).map((esp, i) => {
                const id = esp.idusuario || esp.idEntrenador || i;
                const nombreCompleto = `${esp.nombre || ''} ${esp.apellido || ''}`.trim() || 'Especialista HabitApp';
                const initials = nombreCompleto
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-full bg-[#572de4] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {initials}
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#111827]" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {nombreCompleto}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {esp.especialidad || 'Psicología Clínica & TCC'}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                              4.9
                            </span>
                            <span className="text-[11px] text-slate-400">(68 reseñas)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En línea
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        45€ <span className="text-xs text-slate-400 font-normal">/ sesión</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedSpecialist(esp)}
                        className="py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center"
                      >
                        Ver perfil
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Has solicitado agendar sesión con ${nombreCompleto}. Pronto te contactará.`);
                        }}
                        className="py-2 rounded-xl bg-[#572de4] text-white text-xs font-bold hover:bg-[#461ebd] shadow-sm transition-all text-center"
                      >
                        Agendar sesión
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('especialistas')}
              className="text-xs font-bold text-[#572de4] dark:text-indigo-400 text-center hover:underline pt-1"
            >
              Ver todos los especialistas disponibles →
            </button>
          </section>

          {/* ── WIDGET 2: RETOS COMUNITARIOS ACTIVOS ── */}
          <section className="flex flex-col gap-4 p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#572de4] dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Retos Comunitarios Activos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('retos')}
                className="text-xs font-bold text-[#572de4] dark:text-indigo-400 hover:underline"
              >
                Ver todos →
              </button>
            </div>

            {retosFiltrados.slice(0, 2).map((reto) => {
              const id = reto.idreto || reto.idReto || reto.id || '';
              const isJoiningThis = joiningRetoId === id;

              return (
                <div
                  key={id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#572de4]/10 dark:bg-indigo-950 text-[#572de4] dark:text-indigo-300 text-[11px] font-bold">
                        {reto.diasRestantes ? `Faltan ${reto.diasRestantes} días` : 'Reto activo'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                        {reto.titulo}
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-[#572de4]/10 dark:bg-indigo-950 text-[#572de4] dark:text-indigo-300 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {reto.descripcion}
                  </p>

                  <div className="flex flex-col gap-1.5 pt-0.5">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#572de4] h-full rounded-full transition-all duration-500"
                        style={{ width: `${reto.porcentajeCompletado || 58}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{reto.participantes || '3,420'} participantes activos</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {reto.porcentajeCompletado || 58}% completado
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleJoinReto(reto)}
                    disabled={isJoiningThis || isPending}
                    className="w-full py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isJoiningThis ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Flag className="w-4 h-4" />
                    )}
                    <span>Unirme al Reto</span>
                  </button>
                </div>
              );
            })}
          </section>
        </aside>
      </div>

      {/* ── Modal para Crear Foro ── */}
      <CreateForoModal
        isOpen={isCreateForoOpen}
        onClose={() => setIsCreateForoOpen(false)}
      />

      {/* ── Modal para Compartir Hábito ── */}
      <ShareHabitModal
        isOpen={isShareHabitOpen}
        onClose={() => setIsShareHabitOpen(false)}
        habitos={userHabitos}
        onShared={() => {
          showToast('¡Hábito compartido en la comunidad con éxito! ✨');
          router.refresh();
        }}
      />

      {/* ── Modal de Perfil de Especialista ── */}
      {selectedSpecialist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedSpecialist(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#572de4] uppercase tracking-wider">
                Perfil de Especialista
              </span>
              <button
                type="button"
                onClick={() => setSelectedSpecialist(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-[#572de4] text-white flex items-center justify-center font-bold text-lg">
                {selectedSpecialist.nombre?.[0] || 'E'}
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedSpecialist.nombre} {selectedSpecialist.apellido || ''}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedSpecialist.especialidad || 'Especialista en Hábitos & Salud Emocional'}
                </span>
                <span className="text-xs text-emerald-600 font-bold mt-1">● Disponible para sesiones online</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Profesional colegiado dedicado al acompañamiento en salud emocional, establecimiento de límites, reducción del sobrepensamiento y consolidación de hábitos de autocuidado sostenibles.
            </p>

            <button
              type="button"
              onClick={() => {
                showToast(`Sesión solicitada con ${selectedSpecialist.nombre}. Te notificaremos pronto.`);
                setSelectedSpecialist(null);
              }}
              className="w-full py-3 rounded-2xl bg-[#572de4] text-white font-bold text-xs shadow-md hover:bg-[#461ebd] transition-all"
            >
              Confirmar solicitud de sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
