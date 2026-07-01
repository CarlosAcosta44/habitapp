"use server";

import { apiClient } from "@/lib/api/client";

export async function getCoachClientsAction() {
  try {
    const response = await apiClient.get<any[]>("coach/clients");
    if (!response.success) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCoachRoutinesAction() {
  try {
    const response = await apiClient.get<any[]>("coach/routines");
    if (!response.success) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClientProgressAction(clientId: string) {
  try {
    const response = await apiClient.get<any>(`coach/clients/${clientId}/progress`);
    if (!response.success) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
