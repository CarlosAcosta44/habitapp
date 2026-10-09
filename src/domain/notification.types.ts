/**
 * @file src/types/domain/notification.types.ts
 * @description Definición de tipos TypeScript para el dominio de notificaciones de HabitApp.
 * Alineado con el DTO del backend en NestJS.
 */

export type NotificationType = 'Habito' | 'Comunidad' | 'Entrenador' | 'Sistema';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId: string;
}
