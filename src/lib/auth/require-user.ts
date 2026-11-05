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
  let token = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!token && !refreshToken) {
    if (options?.redirectToLogin) redirect("/login");
    return err("No autorizado. Inicia sesión para continuar.");
  }

  // Intentamos obtener el perfil del usuario desde el backend
  let result = token ? await apiClient.get<any>("/users/me") : { success: false, data: null };

  // Si falló (ej. access_token expirado) y contamos con refresh_token, renovamos silenciosamente
  if (!result.success && refreshToken) {
    const refreshResult = await apiClient.post<any>("/auth/refresh", {
      refreshToken,
    });

    if (refreshResult.success && refreshResult.data?.access_token) {
      token = refreshResult.data.access_token as string;
      cookieStore.set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (refreshResult.data.refresh_token) {
        cookieStore.set("refresh_token", refreshResult.data.refresh_token as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      // Reintentamos /users/me con el token recién emitido
      result = await apiClient.get<any>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

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
