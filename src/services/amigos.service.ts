/**
 * @file src/services/amigos.service.ts
 * @description Service Layer para la gestión de amigos — llamadas pasan por apiClient hacia NestJS.
 * @layer Business Logic (Capa 3)
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";

export class AmigosService {
  async addFriend(targetUserId: string): Promise<Result<any>> {
    return apiClient.post<any>("friends", { targetUserId });
  }

  async getFriends(): Promise<Result<any[]>> {
    return apiClient.get<any[]>("friends");
  }

  async getFriendSuggestions(limit = 12): Promise<Result<any[]>> {
    return apiClient.get<any[]>(`friends/suggestions?limit=${limit}`);
  }
}
