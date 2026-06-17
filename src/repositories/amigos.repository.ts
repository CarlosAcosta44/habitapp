import { createClient } from "@/lib/supabase/server";
import { err, ok } from "@/lib/result";
import type { Result } from "@/lib/result";
import type { AmigoReal, SugerenciaAmigo } from "@/types/domain/perfil.types";

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

  /**
   * Obtiene la lista de amigos aceptados del usuario, incluyendo sus puntajes de perfil.
   */
  async getAcceptedFriends(userId: string): Promise<Result<AmigoReal[]>> {
    const supabase = await createClient();

    // 1. Obtener relaciones de amistad aceptadas
    const { data: misAmistades, error: amistadError } = await supabase
      .from("api_amigos")
      .select("*")
      .eq("estado", "Aceptado")
      .or(`idusuario_solicitante.eq.${userId},idusuario_receptor.eq.${userId}`);

    if (amistadError) {
      return err(`Error al obtener amistades: ${amistadError.message}`);
    }

    const amigosIds = misAmistades?.map((a) =>
      a.idusuario_solicitante === userId ? a.idusuario_receptor : a.idusuario_solicitante
    ) || [];

    if (amigosIds.length === 0) {
      return ok([]);
    }

    // 2. Obtener perfiles de los amigos
    const { data: perfilesAmigos, error: perfilesError } = await supabase
      .from("perfiles_usuarios_api")
      .select("idusuario, nombre, apellido, puntostotales")
      .in("idusuario", amigosIds)
      .order("puntostotales", { ascending: false });

    if (perfilesError) {
      return err(`Error al obtener perfiles de amigos: ${perfilesError.message}`);
    }

    const amigosReales: AmigoReal[] = (perfilesAmigos ?? []).map((pa, idx) => ({
      id: pa.idusuario,
      nombre: pa.nombre,
      apellido: pa.apellido,
      puntos: pa.puntostotales,
      top: idx === 0 && pa.puntostotales > 0,
    }));

    return ok(amigosReales);
  }

  /**
   * Obtiene sugerencias de nuevos amigos, excluyendo a los que ya son amigos y al propio usuario.
   */
  async getFriendSuggestions(userId: string, limit: number = 12): Promise<Result<SugerenciaAmigo[]>> {
    const supabase = await createClient();

    // 1. Obtener todas las relaciones de amistad (de cualquier estado) para excluir
    const { data: misAmistades, error: amistadError } = await supabase
      .from("api_amigos")
      .select("idusuario_solicitante, idusuario_receptor")
      .or(`idusuario_solicitante.eq.${userId},idusuario_receptor.eq.${userId}`);

    if (amistadError) {
      return err(`Error al obtener amistades para exclusión: ${amistadError.message}`);
    }

    const amigosIds = misAmistades?.map((a) =>
      a.idusuario_solicitante === userId ? a.idusuario_receptor : a.idusuario_solicitante
    ) || [];

    const amigosExistentesSet = new Set(amigosIds);

    // 2. Obtener perfiles para sugerencias
    const { data: sugerenciasRaw, error: perfilesError } = await supabase
      .from("perfiles_usuarios_api")
      .select("idusuario, nombre, apellido")
      .neq("idusuario", userId)
      .limit(40);

    if (perfilesError) {
      return err(`Error al obtener sugerencias de amigos: ${perfilesError.message}`);
    }

    const sugerenciasAmigos: SugerenciaAmigo[] = (sugerenciasRaw ?? [])
      .filter((u) => !amigosExistentesSet.has(u.idusuario))
      .slice(0, limit)
      .map((u) => ({
        id: u.idusuario,
        nombre: u.nombre || "Usuario",
        apellido: u.apellido || "",
      }));

    return ok(sugerenciasAmigos);
  }
}

