'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getNotificationsAction, 
  marcarComoLeidaAction, 
  marcarTodasComoLeidasAction 
} from '@/actions/notification.actions';
import type { Notification } from '@/domain/notification.types';

interface NotificationsContextValue {
  isOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await getNotificationsAction();
      if (res.success) {
        setNotifications(res.data);
        setError(null);
      } else {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial y escucha de eventos de actualización
  useEffect(() => {
    setLoading(true);
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener('notifications-update', handleUpdate);
    window.addEventListener('open-notifications-modal', handleOpenModal);

    return () => {
      window.removeEventListener('notifications-update', handleUpdate);
      window.removeEventListener('open-notifications-modal', handleOpenModal);
    };
  }, [refresh]);

  const openNotifications = useCallback(() => {
    setIsOpen(true);
    // Si la lista está vacía o se abre, refrescamos suavemente
    refresh();
  }, [refresh]);

  const closeNotifications = useCallback(() => {
    setIsOpen(false);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    const res = await marcarComoLeidaAction(id);
    if (!res.success) {
      // Revert si falla
      refresh();
    } else {
      window.dispatchEvent(new Event('notifications-update'));
    }
  }, [refresh]);

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const res = await marcarTodasComoLeidasAction();
    if (!res.success) {
      refresh();
    } else {
      window.dispatchEvent(new Event('notifications-update'));
    }
  }, [refresh]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{
        isOpen,
        openNotifications,
        closeNotifications,
        unreadCount,
        notifications,
        loading,
        error,
        refresh,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

