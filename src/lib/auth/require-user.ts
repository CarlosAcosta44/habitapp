import { cookies } from "next/headers";
import { apiClient } from "@/lib/api/client";
import { ok, err, Result } from "@/lib/result";
import { redirect } from "next/navigation";

export interface AppUser {
  id: string;
  idusuario?: string;
  email: string;
  nombre?: string;
  apellido?: string;
  fotoperfil?: string | null;
  telefono?: string | null;
  genero?: string | null;
  fechanacimiento?: string | null;
  puntostotales?: number;
  idrol?: string | number;
  nombrerol?: string;
}

/**
 * Helper para validar el usuario autenticado en Server Actions y Server Components.
 * Devuelve un Result<AppUser> o redirige automáticamente.
 */
export async function requireUser(options?: { redirectToLogin?: boolean }): Promise<Result<AppUser>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    if (options?.redirectToLogin) redirect("/login");
    return err("No autorizado. Inicia sesión para continuar.");
  }

  // Obtenemos el usuario real desde el backend
  const result = await apiClient.get<any>("/users/me");

  if (!result.success || !result.data) {
    if (options?.redirectToLogin) redirect("/login");
    return err("Sesión expirada o inválida.");
  }

  // Mapear idusuario (del backend NestJS) a id (esperado por el frontend)
  const mappedUser: AppUser = {
    ...result.data,
    id: result.data.idusuario || result.data.id,
  };

  return ok(mappedUser);
}
/**
 * Helper para Server Components que requieren un usuario puro.
 * Si falla, redirige automáticamente a /login.
 */
export async function requireUserStrict(): Promise<AppUser> {
  const result = await requireUser({ redirectToLogin: true });
  if (!result.success || !result.data) {
    redirect("/login");
  }
  return result.data;
}
