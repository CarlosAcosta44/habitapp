/**
 * @file src/components/notifications/NotificationBell.tsx
 * @description Componente de cliente para la campanita de notificaciones con conteo no leído en tiempo real.
 * @layer Presentation & UI Components (Capa 1)
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { NotificationService } from '@/services/notification.service';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationService = new NotificationService();

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        const count = res.data.filter(n => !n.isRead).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Error al cargar notificaciones en campanita:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Escuchar actualizaciones dinámicas
    const handleUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener('notifications-update', handleUpdate);
    return () => {
      window.removeEventListener('notifications-update', handleUpdate);
    };
  }, []);

  return (
    <Link
      href="/notificaciones"
      id="notification-bell"
      aria-label={`Notificaciones${unreadCount > 0 ? ` — ${unreadCount} sin leer` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-pulse px-1">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
