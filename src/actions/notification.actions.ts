"use server";
import { NotificationService } from "@/services/notification.service";

export async function getNotificationsAction() {
  const service = new NotificationService();
  return await service.getNotifications();
}

export async function marcarComoLeidaAction(id: string) {
  const service = new NotificationService();
  return await service.markAsRead(id);
}

export async function marcarTodasComoLeidasAction() {
  const service = new NotificationService();
  return await service.markAllAsRead();
}
