/**
 * @file src/repositories/amigos.repository.ts
 * @description Repositorio para la gestión de amigos.
 * @layer Data & Infrastructure (Capa 4)
 */

import { createClient } from "@/lib/supabase/server";
import { err, ok } from "@/lib/result";
import type { Result } from "@/lib/result";

export class AmigosRepository {
  async existsRelation(userId: string, targetUserId: string): Promise<Result<boolean>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .schema("gestion")
      .from("amigos")
      .select("idamistad")
      .or(
        `and(idusuario_solicitante.eq.${userId},idusuario_receptor.eq.${targetUserId}),and(idusuario_solicitante.eq.${targetUserId},idusuario_receptor.eq.${userId})`
      )
      .limit(1);

    if (error) return err(`Error al validar amistad existente: ${error.message}`);
    return ok((data ?? []).length > 0);
  }

  async createAcceptedRelation(userId: string, targetUserId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase
      .schema("gestion")
      .from("amigos")
      .insert({
        idusuario_solicitante: userId,
        idusuario_receptor: targetUserId,
        estado: "Aceptado",
      });

    if (error) {
      if (error.code === "23505") {
        return err("Ya tienes una relación de amistad con este usuario");
      }
      return err(`Error al agregar amigo: ${error.message}`);
    }

    return ok(undefined);
  }
}
