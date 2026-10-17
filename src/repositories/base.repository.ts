/**
 * @file src/repositories/base.repository.ts
 * @description Repositorio base que encapsula los métodos HTTP comunes para todas las entidades.
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";

export abstract class BaseRepository {
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
