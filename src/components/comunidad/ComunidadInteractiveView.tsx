'use client';

import React, { useState, useMemo, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Trophy,
  X,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import type { Reto } from '@/domain/reto.types';
import {
  clonarHabitoAction,
  unirseRetoAction,
  salirRetoAction,
  checkinRetoAction,
  reaccionarAction,
  deleteForoAction,
} from '@/actions/comunidad.actions';
import { CreateForoModal } from '@/components/modals/CreateForoModal';
import { ShareHabitModal } from '@/components/modals/ShareHabitModal';
import { CreateRetoModal } from '@/components/modals/CreateRetoModal';
import { EditForoModal } from '@/components/modals/EditForoModal';
import { ArticleReaderModal } from '@/components/modals/ArticleReaderModal';

interface ComunidadInteractiveViewProps {
  readonly initialForos: any[];
  readonly initialHabitosComunidad: any[];
  readonly initialArticulos: any[];
  readonly initialEspecialistas: any[];
  readonly initialRetos: Reto[];
  readonly userHabitos?: any[];
  readonly userId?: string;
  readonly isAdmin?: boolean;
  readonly totalMiembros?: number;
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
  totalMiembros = 30,
}: ComunidadInteractiveViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Tab activo sincronizado con query param ?tab=
  const initialTabParam = searchParams.get('tab') as TabType;
  const [activeTab, setActiveTab] = useState<TabType>(
    initialTabParam && ['todo', 'foros', 'habitos', 'articulos', 'especialistas', 'retos'].includes(initialTabParam)
      ? initialTabParam
      : 'todo'
  );

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['todo', 'foros', 'habitos', 'articulos', 'especialistas', 'retos'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Buscador y atajo ⌘K
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Filtro de categoría en Foros
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'recientes' | 'populares' | 'sin_responder'>('recientes');

  // Filtros de categoría para Especialistas
  const [selectedEspCategory, setSelectedEspCategory] = useState<string>('Todos');

  // Modal para crear foro, compartir hábito y crear reto
  const [isCreateForoOpen, setIsCreateForoOpen] = useState(false);
  const [isShareHabitOpen, setIsShareHabitOpen] = useState(false);
  const [isCreateRetoOpen, setIsCreateRetoOpen] = useState(false);
  const [editingForo, setEditingForo] = useState<any | null>(null);

  // Filtro de retos: 'todos' | 'participando'
  const [retoFilterTab, setRetoFilterTab] = useState<'todos' | 'participando'>('todos');

  // Menú de opciones de foro y eliminación
  const [openForoMenuId, setOpenForoMenuId] = useState<string | null>(null);
  const [deletingForoId, setDeletingForoId] = useState<string | null>(null);

  // Feedback de acciones
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [joiningRetoId, setJoiningRetoId] = useState<string | null>(null);
  const [leavingRetoId, setLeavingRetoId] = useState<string | null>(null);
  const [checkingInRetoId, setCheckingInRetoId] = useState<string | null>(null);
  const [reactingForoId, setReactingForoId] = useState<string | null>(null);

  // Modal de especialista para agendar o ver perfil
  const [selectedSpecialist, setSelectedSpecialist] = useState<any | null>(null);

  // Modal interactivo de detalle de Reto
  const [selectedRetoModal, setSelectedRetoModal] = useState<any | null>(null);

  // Modal de lectura de artículo
  const [selectedArticuloModal, setSelectedArticuloModal] = useState<any | null>(null);

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
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    let displayMsg = msg;
    if (msg.includes('invalid input syntax') || msg.includes('JWT') || msg.includes('Token')) {
      displayMsg = 'Ocurrió un error al procesar la solicitud. Por favor intenta de nuevo.';
    }
    setToast({ message: displayMsg, type });
    setTimeout(() => setToast(null), 4000);
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
    if (selectedEspCategory !== 'Todos') {
      const q = selectedEspCategory.toLowerCase();
      list = list.filter((e) => e.especialidad?.toLowerCase().includes(q));
    }
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
  }, [initialEspecialistas, selectedEspCategory, searchQuery]);

  // ── Retos en los que participa el usuario actual ──
  const misRetos = useMemo(() => {
    return initialRetos.filter(
      (r) =>
        (userId && r.usuarios_participando?.includes(userId)) ||
        r.inscrito === true
    );
  }, [initialRetos, userId]);

  // ── Retos activos vigentes (cuya fecha de fin no ha expirado) ──
  const retosVigentesCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return initialRetos.filter((r) => !r.fechafin || r.fechafin >= today).length;
  }, [initialRetos]);

  // ── Filtrado de Retos ──
  const retosFiltrados = useMemo(() => {
    let list = retoFilterTab === 'participando' ? misRetos : initialRetos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.titulo?.toLowerCase().includes(q) ||
          r.descripcion?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialRetos, misRetos, retoFilterTab, searchQuery]);

  // ── Acción: Eliminar Foro ──
  const handleDeleteForo = (foroId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Estás seguro de que deseas eliminar este foro? Esta acción no se puede deshacer.')) return;

    setDeletingForoId(foroId);
    startTransition(async () => {
      const res = await deleteForoAction(foroId);
      if (res.success) {
        showToast('Foro eliminado con éxito ✨');
        router.refresh();
      } else {
        showToast(res.message || 'Error al eliminar el foro', 'error');
      }
      setDeletingForoId(null);
      setOpenForoMenuId(null);
    });
  };

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
        showToast(res.message || 'Error al clonar hábito', 'error');
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
        if (selectedRetoModal && (selectedRetoModal.idreto === id || selectedRetoModal.id === id)) {
          setSelectedRetoModal((prev: any) =>
            prev
              ? {
                  ...prev,
                  participantes_count: (prev.participantes_count || 0) + 1,
                  usuarios_participando: [...(prev.usuarios_participando || []), userId],
                  inscrito: true,
                }
              : null
          );
        }
        router.refresh();
      } else {
        showToast(res.message || 'Error al unirse al reto', 'error');
      }
      setJoiningRetoId(null);
    });
  };

  // ── Acción: Salir de Reto ──
  const handleLeaveReto = (reto: Reto) => {
    const id = reto.idreto || reto.idReto || reto.id || '';
    setLeavingRetoId(id);

    startTransition(async () => {
      const res = await salirRetoAction(id);
      if (res.success) {
        showToast(`Has salido de "${reto.titulo}"`);
        if (selectedRetoModal && (selectedRetoModal.idreto === id || selectedRetoModal.id === id)) {
          setSelectedRetoModal((prev: any) =>
            prev
              ? {
                  ...prev,
                  participantes_count: Math.max(0, (prev.participantes_count || 1) - 1),
                  usuarios_participando: (prev.usuarios_participando || []).filter((uId: string) => uId !== userId),
                  inscrito: false,
                }
              : null
          );
        }
        router.refresh();
      } else {
        showToast(res.message || 'Error al salir del reto', 'error');
      }
      setLeavingRetoId(null);
    });
  };

  // ── Acción: Registrar Avance / Check-in en Reto ──
  const handleCheckinReto = (reto: Reto) => {
    const id = reto.idreto || reto.idReto || reto.id || '';
    setCheckingInRetoId(id);

    startTransition(async () => {
      const res = await checkinRetoAction(id);
      if (res.success) {
        showToast(res.message || '¡Avance registrado! 🎯');
        if (selectedRetoModal && (selectedRetoModal.idreto === id || selectedRetoModal.id === id)) {
          setSelectedRetoModal((prev: any) =>
            prev
              ? {
                  ...prev,
                  progreso: res.progreso ?? Math.min(100, (prev.progreso || 0) + 15),
                  dias_progreso: res.dias_progreso ?? ((prev.dias_progreso || 0) + 1),
                  completado: res.completed || prev.completado,
                }
              : null
          );
        }
        router.refresh();
      } else {
        showToast(res.message || 'Error al registrar avance', 'error');
      }
      setCheckingInRetoId(null);
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
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 max-w-md break-words border ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800'
              : 'bg-slate-900 text-white border-slate-800 dark:bg-slate-900 dark:text-white dark:border-slate-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          )}
          <span className="text-xs sm:text-sm font-semibold break-words leading-snug">{toast.message}</span>
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
                {totalMiembros} miembros conectados
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

      {/* ── Banner Destacado para Crear Foro (Solo en pestaña Foros) ── */}
      {activeTab === 'foros' && (
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

      {/* ── Multi-Column Grid Layout (2 columnas en Todo, ancho completo en pestañas específicas) ── */}
      <div className={activeTab === 'todo' ? "grid grid-cols-1 xl:grid-cols-12 gap-7 items-start" : "w-full"}>
        {/* ═══════════ COLUMNA PRINCIPAL ═══════════ */}
        <div className={activeTab === 'todo' ? "xl:col-span-8 flex flex-col gap-8" : "w-full flex flex-col gap-8"}>
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
                              {habito.clones_count && habito.clones_count > 0
                                ? `${habito.clones_count} ${habito.clones_count === 1 ? 'persona hace esto' : 'hacen esto'}`
                                : 'Nuevo'}
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

                          <div className="flex items-center gap-2">
                            {(foro.likes_count || 0) > 10 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 text-[11px] font-semibold">
                                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                                Destacado
                              </span>
                            )}

                            {Boolean(userId && (foro.idusuario === userId || isAdmin)) && (
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenForoMenuId(openForoMenuId === id ? null : id);
                                  }}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Opciones del foro"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {openForoMenuId === id && (
                                  <div
                                    className="absolute right-0 top-9 z-20 w-40 bg-white dark:bg-[#151c2c] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-1.5 animate-in fade-in zoom-in-95 duration-150"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenForoMenuId(null);
                                        setEditingForo(foro);
                                      }}
                                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Editar foro</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled={deletingForoId === id || isPending}
                                      onClick={(e) => handleDeleteForo(id, e)}
                                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left disabled:opacity-50 border-t border-slate-100 dark:border-slate-800/60"
                                    >
                                      {deletingForoId === id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                      )}
                                      <span>Eliminar foro</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
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
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedArticuloModal(art)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedArticuloModal(art);
                          }
                        }}
                        className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group hover:border-[#572de4]/40"
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
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-[#572de4] transition-colors">
                              {art.titulo}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                              {art.contenido}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
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

                          <span className="text-xs font-bold text-[#572de4] dark:text-indigo-400 group-hover:underline flex items-center gap-1">
                            <span>Leer artículo</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ── BLOCK 4: DIRECTORIO COMPLETO DE ESPECIALISTAS ── */}
          {activeTab === 'especialistas' && (
            <div className="flex flex-col gap-7">
              {/* Hero Banner Especialistas */}
              <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 relative z-10">
                  <div className="max-w-3xl flex flex-col gap-4">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-300 w-fit border border-indigo-100 dark:border-indigo-900/50">
                      <ShieldCheck className="w-4 h-4 text-[#572de4] dark:text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Entrenadores y especialistas verificados</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                      Sesiones 1 a 1 y acompañamiento profesional para tus hábitos
                    </h2>
                    <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                      Conecta con especialistas en fuerza, nutrición y acondicionamiento físico para personalizar tu camino hacia una vida más saludable y consistente.
                    </p>

                    {/* Métricas destacadas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">{initialEspecialistas.length}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Especialistas verificados</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">98%</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Valoraciones positivas</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">100%</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Personalizado y guiado</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta de asesoría */}
                  <div className="w-full xl:w-80 shrink-0 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-3xl p-6 flex flex-col justify-between">
                    <div className="flex flex-col gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#572de4] text-white flex items-center justify-center shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base pt-1">
                        ¿No sabes cuál especialista elegir?
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Indícanos tu objetivo principal y te emparejamos con el profesional idóneo según tu nivel y metas.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('¡Pronto activaremos el recomendador inteligente de entrenadores!')}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#572de4] hover:bg-[#461ebd] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
                    >
                      <span>Descubrir especialista</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#572de4]/10 blur-3xl pointer-events-none" />
              </section>

              {/* Filtros de Especialidad */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['Todos', 'Nutrición', 'Fuerza', 'Crossfit'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedEspCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedEspCategory === cat
                          ? 'bg-[#572de4] text-white shadow-sm'
                          : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {especialistasFiltrados.length} profesionales disponibles
                </span>
              </div>

              {/* Cuadrícula de Especialistas */}
              {especialistasFiltrados.length === 0 ? (
                <div className="text-center py-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    No se encontraron especialistas en esta categoría
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {especialistasFiltrados.map((esp) => {
                    const id = esp.idusuario || esp.idEntrenador;
                    const nombreCompleto = `${esp.nombre || ''} ${esp.apellido || ''}`.trim() || 'Especialista HabitApp';
                    const initials = nombreCompleto
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <article
                        key={id}
                        className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between">
                            <div className="relative">
                              {esp.fotoperfil ? (
                                <img
                                  src={esp.fotoperfil}
                                  alt={nombreCompleto}
                                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#572de4] to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                  {initials}
                                </div>
                              )}
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 ring-2 ring-white dark:ring-[#111827] rounded-full" title="En línea hoy" />
                            </div>

                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 px-2 py-0.5 rounded-full">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                4.9 <span className="text-slate-400 font-normal">(68)</span>
                              </span>
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">En línea hoy</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                {nombreCompleto}
                              </h3>
                              <ShieldCheck className="w-4 h-4 text-[#572de4] dark:text-indigo-400 shrink-0" />
                            </div>
                            <p className="text-xs text-[#572de4] dark:text-indigo-400 font-semibold mt-0.5">
                              Especialista en {esp.especialidad || 'Hábitos Saludables'}
                            </p>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 inline-block">
                              Certificado HabitApp • Acompañamiento online
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-800">
                              {esp.especialidad === 'Nutrición' ? 'Planes alimenticios' : esp.especialidad === 'Crossfit' ? 'Resistencia & WOD' : 'Técnica & Progresión'}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-800">
                              Seguimiento continuo
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Sesión 1 a 1 (50 min)</span>
                            <span className="text-base font-bold text-slate-900 dark:text-white">
                              45€ <span className="text-xs text-slate-400 font-normal">/ sesión</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedSpecialist(esp)}
                              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                            >
                              Ver perfil
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`Has solicitado agendar sesión con ${nombreCompleto}. Pronto te contactará 📅`);
                              }}
                              className="px-3 py-2 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white font-semibold text-xs transition-all shadow-sm text-center"
                            >
                              Agendar cita
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── BLOCK 5: DIRECTORIO COMPLETO DE RETOS Y DESAFÍOS ── */}
          {activeTab === 'retos' && (
            <div className="flex flex-col gap-7">
              {/* Header de Retos */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Retos y Desafíos Comunitarios
                  </h2>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm text-xs font-semibold">
                    <Award className="w-4 h-4 text-[#572de4]" />
                    <span>{retosVigentesCount} {retosVigentesCount === 1 ? 'reto activo' : 'retos activos'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateRetoOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear reto</span>
                  </button>
                </div>
              </div>

              {/* Selector de Pestañas de Retos: Todos vs Participando */}
              <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRetoFilterTab('todos')}
                  className={`pb-3 text-xs sm:text-sm font-bold transition-all relative ${
                    retoFilterTab === 'todos'
                      ? 'text-[#572de4] dark:text-indigo-400 border-b-2 border-[#572de4]'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Todos los desafíos ({initialRetos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRetoFilterTab('participando')}
                  className={`pb-3 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-1.5 ${
                    retoFilterTab === 'participando'
                      ? 'text-[#572de4] dark:text-indigo-400 border-b-2 border-[#572de4]'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>En los que participas ({misRetos.length})</span>
                </button>
              </div>

              {/* Fila Destacada: Retos en Curso del Usuario */}
              {retoFilterTab === 'todos' && misRetos.length > 0 && (
                <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#572de4] dark:text-indigo-300 uppercase tracking-wider">
                      <Trophy className="w-4 h-4" />
                      <span>Tus Retos en Curso ({misRetos.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRetoFilterTab('participando')}
                      className="text-xs font-bold text-[#572de4] dark:text-indigo-400 hover:underline"
                    >
                      Filtrar solo mis retos →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {misRetos.map((mr) => (
                      <div
                        key={mr.idreto}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedRetoModal(mr)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedRetoModal(mr);
                          }
                        }}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-indigo-100/80 dark:border-indigo-900/50 shadow-sm cursor-pointer hover:border-[#572de4] transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {mr.titulo}
                          </span>
                          <span className="text-sm">{mr.insignia_recompensa || '🏆'}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {mr.descripcion}
                        </span>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#572de4] dark:text-indigo-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span>+{mr.puntos_recompensa || 50} pts</span>
                          <span className="text-emerald-600 dark:text-emerald-400">Participando ✓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Banner Destacado Retos */}
              <section className="relative overflow-hidden rounded-3xl p-7 bg-gradient-to-r from-[#572de4] via-indigo-600 to-violet-700 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative z-10 flex items-start gap-4 max-w-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-white/80 font-bold uppercase tracking-widest">
                      Comunidad &amp; Superación
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      ¿Listo para elevar tus hábitos al siguiente nivel?
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      Únete a los desafíos colectivos, compite saludablemente, acumula puntos de recompensa y desbloquea insignias exclusivas.
                    </p>
                  </div>
                </div>
                <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute right-1/3 -bottom-16 w-48 h-48 rounded-full bg-violet-400/20 blur-xl pointer-events-none" />
              </section>

              {/* Encabezado de Lista de Retos */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {retoFilterTab === 'participando' ? 'Retos en los que estás participando' : 'Explorar todos los retos'}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {retosFiltrados.length} {retosFiltrados.length === 1 ? 'reto disponible' : 'retos disponibles'}
                </span>
              </div>

              {/* Cuadrícula de Retos */}
              {retosFiltrados.length === 0 ? (
                <div className="text-center py-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    No se encontraron retos disponibles
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {retosFiltrados.map((reto) => {
                    const id = reto.idreto || reto.idReto || reto.id || '';
                    const isJoiningThis = joiningRetoId === id;
                    const isLeavingThis = leavingRetoId === id;
                    const puntos = reto.puntos_recompensa ?? 0;
                    const isEnrolled = Boolean(
                      (userId && reto.usuarios_participando?.includes(userId)) ||
                      reto.inscrito === true
                    );
                    const participantesCount = reto.participantes_count ?? (reto.usuarios_participando?.length ?? 0);
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const isExpired = Boolean(reto.fechafin && reto.fechafin < todayStr) || reto.estado === 'Finalizado';

                    return (
                      <article
                        key={id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedRetoModal(reto)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedRetoModal(reto);
                          }
                        }}
                        className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 cursor-pointer group hover:border-[#572de4]/40"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            {isExpired ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
                                <X className="w-3 h-3" />
                                Caducado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#572de4] dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                                <Sparkles className="w-3 h-3" />
                                {reto.fechafin ? `Límite: ${reto.fechafin}` : 'Reto continuo'}
                              </span>
                            )}
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
                        </div>

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

                          {isEnrolled ? (
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
                                      reto.completado || (reto.progreso ?? 0) >= 100
                                        ? 'bg-emerald-500'
                                        : 'bg-gradient-to-r from-[#572de4] to-indigo-400'
                                    }`}
                                    style={{ width: `${Math.min(100, reto.progreso ?? 0)}%` }}
                                  />
                                </div>
                              </div>

                              {reto.completado || (reto.progreso ?? 0) >= 100 ? (
                                <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                                  <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span className="truncate">¡Reto Completado!</span>
                                </div>
                              ) : isExpired ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
                                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span>Reto finalizado</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLeaveReto(reto);
                                    }}
                                    disabled={isLeavingThis || isPending}
                                    className="px-2.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
                                    title="Salir del reto"
                                  >
                                    {isLeavingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                    <span>Salir</span>
                                  </button>
                                </div>
                              ) : reto.checkin_hecho_hoy ? (
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
                                      handleLeaveReto(reto);
                                    }}
                                    disabled={isLeavingThis || isPending}
                                    className="px-2.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
                                    title="Salir del reto"
                                  >
                                    {isLeavingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                    <span>Salir</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCheckinReto(reto);
                                    }}
                                    disabled={checkingInRetoId === id || isPending}
                                    className="flex-1 py-2 px-3 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                                    title="Registrar avance de hoy"
                                  >
                                    {checkingInRetoId === id ? (
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
                                      handleLeaveReto(reto);
                                    }}
                                    disabled={isLeavingThis || isPending || checkingInRetoId === id}
                                    className="px-2.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
                                    title="Salir del reto"
                                  >
                                    {isLeavingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                    <span>Salir</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : isExpired ? (
                            <div className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
                              <span>Reto finalizado</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinReto(reto);
                              }}
                              disabled={isJoiningThis || isPending}
                              className="w-full py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                            >
                              {isJoiningThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Flag className="w-3.5 h-3.5" />
                              )}
                              <span>Unirme al reto</span>
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════ SIDEBAR LATERAL (4 Cols) - Solo visible en pestaña 'Todo' ═══════════ */}
        {activeTab === 'todo' && (
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
              const puntos = reto.puntos_recompensa ?? 0;
              const isEnrolled = Boolean(
                (userId && reto.usuarios_participando?.includes(userId)) ||
                reto.inscrito === true
              );
              const participantesCount = reto.participantes_count ?? (reto.usuarios_participando?.length ?? 0);

              return (
                <div
                  key={id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedRetoModal(reto)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedRetoModal(reto);
                    }
                  }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3.5 cursor-pointer hover:border-[#572de4]/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#572de4]/10 dark:bg-indigo-950 text-[#572de4] dark:text-indigo-300 text-[11px] font-bold">
                        +{puntos} pts de recompensa
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                        {reto.titulo}
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-[#572de4]/10 dark:bg-indigo-950 text-[#572de4] dark:text-indigo-300 flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {reto.descripcion}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {participantesCount} participante{participantesCount === 1 ? '' : 's'}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {reto.fechafin ? `Hasta: ${reto.fechafin}` : 'Activo'}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>En curso</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinReto(reto);
                      }}
                      disabled={isJoiningThis || isPending}
                      className="w-full py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isJoiningThis ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Flag className="w-3.5 h-3.5" />
                      )}
                      <span>Unirme al Reto</span>
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        </aside>
      )}
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
        habitosPublicados={initialHabitosComunidad}
        currentUserId={userId}
        onShared={() => {
          showToast('¡Hábito compartido en la comunidad con éxito! ✨');
          router.refresh();
        }}
      />

      {/* ── Modal para Crear Reto ── */}
      <CreateRetoModal
        isOpen={isCreateRetoOpen}
        onClose={() => setIsCreateRetoOpen(false)}
        onSuccess={() => {
          showToast('¡Reto comunitario creado y te has unido exitosamente! 🏆');
          router.refresh();
        }}
      />

      {/* ── Modal para Editar Foro ── */}
      <EditForoModal
        isOpen={Boolean(editingForo)}
        onClose={() => setEditingForo(null)}
        foro={editingForo}
        onSuccess={() => {
          showToast('¡Foro actualizado con éxito! ✨');
          router.refresh();
        }}
      />

      {/* ── Modal de Lectura de Artículo ── */}
      <ArticleReaderModal
        isOpen={Boolean(selectedArticuloModal)}
        onClose={() => setSelectedArticuloModal(null)}
        articulo={selectedArticuloModal}
      />

      {/* ── Modal de Perfil de Especialista ── */}
      {selectedSpecialist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedSpecialist(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedSpecialist(null);
          }}
          role="presentation"
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95"
            role="dialog"
            aria-modal="true"
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
      {/* ── Modal Interactivo de Detalle de Reto ── */}
      {selectedRetoModal && (() => {
        const modalId = selectedRetoModal.idreto || selectedRetoModal.idReto || selectedRetoModal.id || '';
        const modalPuntos = selectedRetoModal.puntos_recompensa ?? 0;
        const modalEnrolled = Boolean(
          (userId && selectedRetoModal.usuarios_participando?.includes(userId)) ||
          selectedRetoModal.inscrito === true
        );
        const modalParticipantes = selectedRetoModal.participantes_count ?? (selectedRetoModal.usuarios_participando?.length ?? 0);
        const isJoiningModal = joiningRetoId === modalId;
        const isLeavingModal = leavingRetoId === modalId;
        const todayModalStr = new Date().toISOString().slice(0, 10);
        const isModalExpired = Boolean(selectedRetoModal.fechafin && selectedRetoModal.fechafin < todayModalStr) || selectedRetoModal.estado === 'Finalizado';

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedRetoModal(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSelectedRetoModal(null);
            }}
            role="presentation"
          >
            <div
              className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-200"
              role="dialog"
              aria-modal="true"
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
                  onClick={() => setSelectedRetoModal(null)}
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
                    {selectedRetoModal.icono || '🏆'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {selectedRetoModal.titulo}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedRetoModal.descripcion || 'Sin descripción detallada disponible.'}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#572de4]" />
                    Fecha de Inicio
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {selectedRetoModal.fechainicio || 'Inmediato'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#572de4]" />
                    Fecha de Cierre
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {selectedRetoModal.fechafin || 'Sin fecha límite'}
                  </span>
                </div>
              </div>

              {/* Status / Action */}
              {modalEnrolled ? (
                <div className="flex flex-col gap-3">
                  {/* Progress bar in modal */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#572de4]" />
                        Progreso completado: <strong className="text-slate-900 dark:text-white">{selectedRetoModal.dias_progreso ?? 0} / {selectedRetoModal.dias_objetivo ?? 7} días</strong>
                      </span>
                      <span className="text-[#572de4] dark:text-indigo-400 font-bold">{selectedRetoModal.progreso ?? 0}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedRetoModal.completado || (selectedRetoModal.progreso ?? 0) >= 100
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-[#572de4] to-indigo-400'
                        }`}
                        style={{ width: `${Math.min(100, selectedRetoModal.progreso ?? 0)}%` }}
                      />
                    </div>
                  </div>

                  {selectedRetoModal.completado || (selectedRetoModal.progreso ?? 0) >= 100 ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
                      <Trophy className="w-7 h-7 text-emerald-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">🎉 ¡Reto Completado con Éxito!</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-300">
                          Has asegurado los +{modalPuntos} puntos y avanzado en tus logros de comunidad.
                        </span>
                      </div>
                    </div>
                  ) : isModalExpired ? (
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
                        onClick={() => handleLeaveReto(selectedRetoModal)}
                        disabled={isLeavingModal || isPending}
                        className="w-full py-3 rounded-2xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLeavingModal ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>Salir de este reto</span>
                      </button>
                    </div>
                  ) : selectedRetoModal.checkin_hecho_hoy ? (
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
                        onClick={() => handleLeaveReto(selectedRetoModal)}
                        disabled={isLeavingModal || isPending}
                        className="w-full py-3 rounded-2xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLeavingModal ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>Salir de este reto</span>
                      </button>
                    </div>
                  ) : (
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

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCheckinReto(selectedRetoModal)}
                          disabled={checkingInRetoId === (selectedRetoModal.id || (selectedRetoModal as any).id_reto) || isPending}
                          className="flex-1 py-3.5 rounded-2xl bg-[#572de4] hover:bg-[#461ebd] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                          {checkingInRetoId === (selectedRetoModal.id || (selectedRetoModal as any).id_reto) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>Hacer Check-in Diario (+1 día)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleLeaveReto(selectedRetoModal)}
                          disabled={isLeavingModal || isPending}
                          className="px-4 py-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                          title="Salir de este reto"
                        >
                          {isLeavingModal ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          <span>Salir</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : isModalExpired ? (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-center text-xs sm:text-sm font-semibold">
                  Este reto ya ha finalizado y no admite nuevas inscripciones.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleJoinReto(selectedRetoModal)}
                  disabled={isJoiningModal || isPending}
                  className="w-full py-3.5 rounded-2xl bg-[#572de4] hover:bg-[#461ebd] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isJoiningModal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trophy className="w-4 h-4" />
                  )}
                  <span>Unirme a este reto (+{modalPuntos} pts)</span>
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
