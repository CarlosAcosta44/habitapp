/**
 * @file src/components/notifications/NotificationBell.tsx
 * @description Botón interactivo de campanita de notificaciones que activa el NotificationsModal.
 * @layer Presentation & UI Components (Capa 1)
 */

'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from './NotificationsContext';

export function NotificationBell() {
  const { unreadCount, openNotifications } = useNotifications();

  return (
    <button
      type="button"
      onClick={openNotifications}
      id="notification-bell"
      aria-label={`Notificaciones${unreadCount > 0 ? ` — ${unreadCount} sin leer` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-500 dark:text-slate-400 hover:text-[#572de4] dark:hover:text-indigo-400 active:scale-95 cursor-pointer"
      title="Abrir notificaciones"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#572de4] dark:bg-indigo-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-pulse px-1">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
