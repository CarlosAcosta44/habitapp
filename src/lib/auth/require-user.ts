import { createClient } from "@/lib/supabase/server";
import { ok, err, Result } from "@/lib/result";
import { User } from "@supabase/supabase-js";

/**
 * Helper para validar el usuario autenticado en Server Actions y Server Components.
 * Devuelve un Result<User> manteniendo la cohesión con la arquitectura del sistema.
 */
export async function requireUser(): Promise<Result<User>> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return err("No autorizado. Inicia sesión para continuar.");
  }

  return ok(user);
}
