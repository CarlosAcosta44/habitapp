/**
 * @file src/components/notifications/NotificationList.tsx
 * @description Lista interactiva de notificaciones del usuario, conectada al backend NestJS.
 * @layer Presentation & UI Components (Capa 1)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Users, 
  Info, 
  Check, 
  Inbox,
  Clock,
  Sparkles
} from 'lucide-react';
import { NotificationService } from '@/services/notification.service';
import type { Notification, NotificationType } from '@/types/domain/notification.types';

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const notificationService = new NotificationService();

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    const res = await notificationService.getNotifications();
    if (res.success) {
      setNotifications(res.data);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const res = await notificationService.markAsRead(id);
    if (res.success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      // Notificar a la campanita de que el conteo cambió
      window.dispatchEvent(new Event('notifications-update'));
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await notificationService.markAllAsRead();
    if (res.success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      // Notificar a la campanita de que el conteo cambió
      window.dispatchEvent(new Event('notifications-update'));
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'Habito':
        return {
          icon: CheckSquare,
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-500/20'
        };
      case 'Comunidad':
        return {
          icon: Users,
          bg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
          border: 'border-indigo-500/20'
        };
      case 'Entrenador':
        return {
          icon: Sparkles,
          bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
          border: 'border-amber-500/20'
        };
      case 'Sistema':
      default:
        return {
          icon: Info,
          bg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400',
          border: 'border-sky-500/20'
        };
    }
  };

  const formatFriendlyDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 italic space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Cargando tu bandeja de entrada...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
        <p className="font-bold">Error al cargar notificaciones</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          onClick={loadNotifications}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl transition-all"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#111827] rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bandeja de entrada vacía</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          No tienes notificaciones de momento. ¡Buen trabajo manteniéndote al día!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabecera de la lista */}
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-semibold text-slate-500">
          Tienes {unreadCount} {unreadCount === 1 ? 'notificación pendiente' : 'notificaciones pendientes'}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            id="mark-all-read-btn"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Grid / Lista */}
      <div className="space-y-3">
        {notifications.map((n) => {
          const style = getTypeStyles(n.type);
          const Icon = style.icon;

          return (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkAsRead(n.id)}
              className={`group flex items-start gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${
                n.isRead
                  ? 'bg-white dark:bg-[#111827]/40 border-slate-200 dark:border-slate-800/40 text-slate-700 dark:text-slate-400 opacity-75 hover:opacity-100'
                  : 'bg-white dark:bg-[#111827] border-slate-300 dark:border-indigo-500/20 text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Icono del tipo */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.bg} border ${style.border}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {n.type}
                  </span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${!n.isRead ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {n.message}
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatFriendlyDate(n.createdAt)}</span>
                </div>
              </div>

              {/* Botón de acción rápida si no está leída */}
              {!n.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(n.id);
                  }}
                  title="Marcar como leída"
                  className="self-center p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
