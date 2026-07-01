"use server";

import { apiClient } from "@/lib/api/client";
import { revalidatePath } from "next/cache";

export async function getCoachClientProgressAction(clientId: string) {
  try {
    const response = await apiClient.get<any>(`coach/clients/${clientId}/progress`);
    if (!response.success) throw new Error(response.error);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoutineAction(dto: any) {
  try {
    const response = await apiClient.post<any>(`coach/routines`, dto);
    if (!response.success) throw new Error(response.error);
    revalidatePath("/entrenador");
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCoachRoutineByIdAction(id: string) {
  try {
    const response = await apiClient.get<any>(`coach/routines/${id}`);
    if (!response.success) throw new Error(response.error);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRoutineAction(id: string, dto: any) {
  try {
    const response = await apiClient.patch<any>(`coach/routines/${id}`, dto);
    if (!response.success) throw new Error(response.error);
    revalidatePath("/entrenador");
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteRoutineAction(id: string) {
  try {
    const response = await apiClient.delete<any>(`coach/routines/${id}`);
    if (!response.success) throw new Error(response.error);
    revalidatePath("/entrenador");
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignRoutineToClientAction(clientId: string, routineId: string) {
  try {
    const response = await apiClient.post<any>(`coach/clients/${clientId}/routines/${routineId}/assign`);
    if (!response.success) throw new Error(response.error);
    revalidatePath("/entrenador");
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCoachRoutinesAction() {
  try {
    const response = await apiClient.get<any>(`coach/routines`);
    if (!response.success) throw new Error(response.error);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCoachClientsAction() {
  try {
    const response = await apiClient.get<any>(`coach/clients`);
    if (!response.success) throw new Error(response.error);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
