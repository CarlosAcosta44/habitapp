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

// ─── createRutinaAction — compatible con useActionState ──────────────────────
// Reemplaza el equivalente de modules/entrenador/entrenador.actions.ts
export async function createRutinaAction(
  _prevState: { success: boolean; message: string; errors?: Record<string, string[]> } | null,
  formData: FormData
): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  const rawData = {
    tipo:        formData.get("tipo") as string,
    descripcion: formData.get("descripcion") as string | undefined || undefined,
    duracion:    formData.get("duracion") ? Number(formData.get("duracion")) : undefined,
    objetivo:    formData.get("objetivo") as string | undefined || undefined,
    nivel:       formData.get("nivel") as string,
  };

  // Validación de forma (shape) — la validación de negocio la hace el backend
  if (!rawData.tipo || rawData.tipo.length < 3) {
    return { success: false, message: "El tipo debe tener al menos 3 caracteres" };
  }
  if (!rawData.nivel || !["Principiante", "Intermedio", "Avanzado"].includes(rawData.nivel)) {
    return { success: false, message: "Nivel inválido" };
  }

  try {
    const response = await apiClient.post<any>("coach/routines", rawData);
    if (!response.success) return { success: false, message: response.error ?? "Error al crear rutina" };
    revalidatePath("/dashboard/entrenador/rutinas");
    return { success: true, message: "Rutina creada exitosamente" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
