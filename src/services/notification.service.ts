/**
 * @file src/services/notification.service.ts
 * @description Service Layer para la comunicación con el backend NestJS para la gestión de notificaciones.
 * @layer Business Logic (Capa 3)
 */

import { notificationRepository } from "@/repositories/notification.repository";
import type { Result } from "@/lib/result";
import type { Notification } from "@/domain/notification.types";

export class NotificationService {
  /**
   * Obtiene las últimas 30 notificaciones del usuario autenticado actual.
   * Llama a: GET /notifications
   */
  async getNotifications(): Promise<Result<Notification[]>> {
    return notificationRepository.get<Notification[]>("notifications");
  }

  /**
   * Marca una notificación como leída.
   * Llama a: PATCH /notifications/:id/read
   */
  async markAsRead(id: string): Promise<Result<void>> {
    return notificationRepository.patch<void>(`notifications/${id}/read`);
  }

  /**
   * Marca todas las notificaciones del usuario como leídas.
   * Llama a: PATCH /notifications/read-all
   */
  async markAllAsRead(): Promise<Result<void>> {
    return notificationRepository.patch<void>("notifications/read-all");
  }
}
