/**
 * @file src/services/amigos.service.ts
 * @description Service Layer para la gestión de amigos.
 * @layer Business Logic (Capa 3)
 */

import { err, ok } from "@/lib/result";
import type { Result } from "@/lib/result";
import { AmigosRepository } from "@/repositories/amigos.repository";
import { createClient } from "@/lib/supabase/server";

export class AmigosService {
  private readonly repo: AmigosRepository;

  constructor(repo?: AmigosRepository) {
    this.repo = repo ?? new AmigosRepository();
  }

  async addFriend(userId: string, targetUserId: string): Promise<Result<void>> {
    if (!userId || !targetUserId) {
      return err("Faltan datos para procesar la solicitud de amistad");
    }

    if (userId === targetUserId) {
      return err("No puedes agregarte a ti mismo como amigo");
    }

    const supabase = await createClient();
    const { data: targetProfile, error: profileError } = await supabase
      .from("perfiles_usuarios_api")
      .select("idusuario")
      .eq("idusuario", targetUserId)
      .single();

    if (profileError || !targetProfile) {
      return err("El usuario que intentas agregar no existe");
    }

    const relationExists = await this.repo.existsRelation(userId, targetUserId);
    if (!relationExists.success) return err(relationExists.error);
    if (relationExists.data) return err("Este usuario ya está en tu red de amigos");

    return this.repo.createAcceptedRelation(userId, targetUserId);
  }
}
