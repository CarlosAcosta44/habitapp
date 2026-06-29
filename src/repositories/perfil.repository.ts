/**
 * @file src/repositories/perfil.repository.ts
 * @description Repositorio para la gestión de datos específicos de perfil (puntos, logros).
 * @layer Data & Infrastructure (Capa 4)
 */

import { createClient } from "@/lib/supabase/server";
import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import type { PointsHistoryEntry, LogroReal } from "@/types/domain/perfil.types";

export class PerfilRepository {
  /**
   * Obtiene la información básica del perfil del usuario actual.
   */
  async getPerfil(userId: string): Promise<Result<{ nombre: string; apellido: string; fotoperfil: string | null; puntos: number } | null>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("perfiles_usuarios_api")
      .select("nombre, apellido, fotoperfil, puntostotales")
      .eq("idusuario", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return ok(null);
      return err(`Error al obtener perfil: ${error.message}`);
    }

    return ok({
      nombre: data.nombre ?? "Usuario",
      apellido: data.apellido ?? "",
      fotoperfil: data.fotoperfil,
      puntos: data.puntostotales ?? 0,
    });
  }

  /**
   * Obtiene el historial de puntos obtenidos del usuario.
   */
  async getPointsHistory(userId: string, limit: number): Promise<Result<PointsHistoryEntry[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("api_historial_puntos")
      .select("*")
      .eq("idusuario", userId)
      .order("fecha", { ascending: false })
      .limit(limit);

    if (error) {
      return err(`Error al obtener historial de puntos: ${error.message}`);
    }
    return ok((data ?? []) as PointsHistoryEntry[]);
  }

  /**
   * Obtiene la lista de logros desbloqueados por el usuario, con sus detalles del catálogo.
   */
  async getUserAchievements(userId: string): Promise<Result<LogroReal[]>> {
    const supabase = await createClient();

    // 1. Obtener los logros del usuario
    const { data: logrosGanados, error: ganadosError } = await supabase
      .from("api_usuario_logro")
      .select("*")
      .eq("idusuario", userId);

    if (ganadosError) {
      return err(`Error al obtener logros del usuario: ${ganadosError.message}`);
    }

    const idsGanados = logrosGanados?.map((l) => l.idlogro) || [];
    if (idsGanados.length === 0) {
      return ok([]);
    }

    // 2. Obtener detalles de esos logros del catálogo
    const { data: catalogoLogros, error: catalogoError } = await supabase
      .from("api_logros")
      .select("*")
      .in("idlogro", idsGanados);

    if (catalogoError) {
      return err(`Error al obtener catálogo de logros: ${catalogoError.message}`);
    }

    const logrosReales: LogroReal[] = (catalogoLogros ?? []).map((lg) => {
      const meta = logrosGanados?.find((ul) => ul.idlogro === lg.idlogro);
      return {
        id: lg.idlogro,
        nombre: lg.nombre,
        desc: lg.descripcion,
        fecha: meta?.fechaobtenido || "Recientemente",
        icono: lg.icono,
      };
    });

    return ok(logrosReales);
  }
}
