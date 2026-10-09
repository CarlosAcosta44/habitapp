/**
 * @file src/repositories/notification.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo notification.
 * Aísla las llamadas HTTP de la lógica de negocio.
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";

// Tipos requeridos
export class NotificationRepository {
  async get<T = any>(url: string, options?: any): Promise<Result<T>> {
    return apiClient.get<T>(url, options);
  }
  
  async post<T = any>(url: string, body?: any, options?: any): Promise<Result<T>> {
    return apiClient.post<T>(url, body, options);
  }
  
  async put<T = any>(url: string, body?: any): Promise<Result<T>> {
    return apiClient.put<T>(url, body);
  }
  
  async patch<T = any>(url: string, body?: any): Promise<Result<T>> {
    return apiClient.patch<T>(url, body);
  }
  
  async delete<T = any>(url: string): Promise<Result<T>> {
    return apiClient.delete<T>(url);
  }
}

export const notificationRepository = new NotificationRepository();
