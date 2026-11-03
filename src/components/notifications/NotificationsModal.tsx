'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  X,
  Bell,
  CheckSquare,
  Users,
  Sparkles,
  Info,
  Check,
  CheckCheck,
  Inbox,
  Clock,
  Settings,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useNotifications } from './NotificationsContext';
import type { Notification, NotificationType } from '@/domain/notification.types';

export function NotificationsModal() {
  const {
    isOpen,
    closeNotifications,
    notifications,
    loading,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [mounted, setMounted] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Manejo de tecla Escape y bloqueo de scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeNotifications();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeNotifications]);

  if (!isOpen || !mounted) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  const getTypeConfig = (type: NotificationType) => {
    switch (type) {
      case 'Habito':
        return {
          icon: CheckSquare,
          label: 'Hábito',
          badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        };
      case 'Comunidad':
        return {
          icon: Users,
          label: 'Comunidad',
          badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        };
      case 'Entrenador':
        return {
          icon: Sparkles,
          label: 'Coach & Guía',
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        };
      case 'Sistema':
      default:
        return {
          icon: Info,
          label: 'Sistema',
          badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
        };
    }
  };

  const formatFriendlyTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Justo ahora';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;

      return new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const handleMarkAll = async () => {
    try {
      setIsMarkingAll(true);
      await markAllAsRead();
    } finally {
      setIsMarkingAll(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeNotifications}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-modal-title"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER DEL MODAL ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#572de4]/10 dark:bg-indigo-950/80 border border-[#572de4]/20 flex items-center justify-center text-[#572de4] dark:text-indigo-400 flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="notifications-modal-title"
                  className="text-lg font-bold text-slate-900 dark:text-white leading-tight"
                >
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#572de4]/10 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-400 border border-[#572de4]/20">
                    {unreadCount} {unreadCount === 1 ? 'nueva' : 'nuevas'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bandeja de actividad, hábitos y avisos de bienestar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeNotifications}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar modal"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── BARRA DE TABS Y ACCIONES RÁPIDAS ── */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 text-xs">
          {/* Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sin leer
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#572de4] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Marcar todas como leídas */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={isMarkingAll}
              className="flex items-center gap-1.5 font-bold text-[#572de4] dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Marcar todas</span>
            </button>
          )}
        </div>

        {/* ── CONTENIDO PRINCIPAL SCROLLABLE ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-[220px] max-h-[55vh]">
          {/* Estado de carga */}
          {loading && (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 animate-pulse flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700/60 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-1/4 bg-slate-200 dark:bg-slate-700/60 rounded" />
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700/60 rounded" />
                    <div className="h-3 w-1/6 bg-slate-200 dark:bg-slate-700/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estado de error */}
          {!loading && error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-center space-y-2 my-4">
              <div className="flex items-center justify-center gap-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Error al cargar notificaciones</span>
              </div>
              <p className="text-xs text-red-600/80 dark:text-red-400/80">{error}</p>
              <button
                type="button"
                onClick={() => refresh()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reintentar
              </button>
            </div>
          )}

          {/* Estado vacío */}
          {!loading && !error && filteredNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm">
                <Inbox className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeTab === 'unread' ? 'Sin notificaciones pendientes' : 'Bandeja al día'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                  {activeTab === 'unread'
                    ? '¡Excelente trabajo! Has revisado todas tus alertas y mensajes.'
                    : 'Cuando recibas recordatorios de hábitos, consejos de tu coach o alertas, aparecerán aquí.'}
                </p>
              </div>
            </div>
          )}

          {/* Lista de Notificaciones */}
          {!loading && !error && filteredNotifications.length > 0 && (
            <div className="space-y-2.5">
              {filteredNotifications.map((n) => {
                const config = getTypeConfig(n.type);
                const Icon = config.icon;

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) {
                        markAsRead(n.id);
                      }
                    }}
                    className={`group relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                      n.isRead
                        ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        : 'bg-white dark:bg-[#151c2e] border-indigo-200 dark:border-indigo-500/30 shadow-sm hover:shadow-md hover:border-[#572de4]/40'
                    }`}
                  >
                    {/* Icono temático */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.badge}`}
                        >
                          {config.label}
                        </span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#572de4] dark:bg-indigo-400 animate-pulse" />
                        )}
                      </div>

                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          !n.isRead
                            ? 'font-semibold text-slate-900 dark:text-white'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {n.message}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatFriendlyTime(n.createdAt)}</span>
                      </div>
                    </div>

                    {/* Botón marcar leída individual */}
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n.id);
                        }}
                        title="Marcar como leída"
                        aria-label="Marcar como leída"
                        className="self-center p-1.5 rounded-lg text-slate-400 hover:text-[#572de4] dark:hover:text-indigo-400 hover:bg-[#572de4]/10 dark:hover:bg-indigo-950/60 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── FOOTER DEL MODAL ── */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <Link
            href="/ajustes/notificaciones"
            onClick={closeNotifications}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurar alertas</span>
          </Link>

          <button
            type="button"
            onClick={closeNotifications}
            className="px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

