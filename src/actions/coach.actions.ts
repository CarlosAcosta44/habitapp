"use server";

import { revalidatePath } from "next/cache";
import { coachService } from "@/services/coach.service";

export async function getCoachClientProgressAction(clientId: string) {
  const response = await coachService.getClientProgress(clientId);
  if (!response.success) return { success: false, error: response.error };
  return { success: true, data: response.data };
}

export async function createRoutineAction(dto: any) {
  const response = await coachService.createRoutine(dto);
  if (!response.success) return { success: false, error: response.error };
  revalidatePath("/entrenador");
  return { success: true, data: response.data };
}

export async function getCoachRoutineByIdAction(id: string) {
  const response = await coachService.getRoutineById(id);
  if (!response.success) return { success: false, error: response.error };
  return { success: true, data: response.data };
}

export async function updateRoutineAction(id: string, dto: any) {
  const response = await coachService.updateRoutine(id, dto);
  if (!response.success) return { success: false, error: response.error };
  revalidatePath("/entrenador");
  return { success: true, data: response.data };
}

export async function deleteRoutineAction(id: string) {
  const response = await coachService.deleteRoutine(id);
  if (!response.success) return { success: false, error: response.error };
  revalidatePath("/entrenador");
  return { success: true, data: response.data };
}

export async function assignRoutineToClientAction(clientId: string, routineId: string) {
  const response = await coachService.assignRoutine(clientId, routineId);
  if (!response.success) return { success: false, error: response.error };
  revalidatePath("/entrenador");
  return { success: true, data: response.data };
}

export async function getCoachRoutinesAction() {
  const response = await coachService.getRoutines();
  if (!response.success) return { success: false, error: response.error };
  return { success: true, data: response.data };
}

export async function getCoachClientsAction() {
  const response = await coachService.getClients();
  if (!response.success) return { success: false, error: response.error };
  return { success: true, data: response.data };
}

// ─── createRutinaAction — compatible con useActionState ──────────────────────
// Reemplaza el equivalente de modules/entrenador/entrenador.actions.ts
export async function createRutinaAction(
  _prevState: { success: boolean; message: string; errors?: Record<string, string[]> } | null,
  formData: FormData
): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  const rawData = {
    name:        formData.get("tipo") as string,
    description: formData.get("descripcion") as string | undefined || undefined,
  };

  if (!rawData.name || rawData.name.length < 3) {
    return { success: false, message: "El tipo debe tener al menos 3 caracteres" };
  }

  const response = await coachService.createRoutine(rawData);
  if (!response.success) return { success: false, message: response.error ?? "Error al crear rutina" };
  revalidatePath("/dashboard/entrenador/rutinas");
  return { success: true, message: "Rutina creada exitosamente" };
}
