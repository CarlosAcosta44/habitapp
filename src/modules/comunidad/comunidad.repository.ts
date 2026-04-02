/**
 * @file src/modules/comunidad/comunidad.repository.ts
 * @description Repositorio para el módulo de Comunidad.
 * Maneja foros, comentarios anidados y reacciones.
 *
 * @pattern Repository Pattern
 * @principle SRP — solo acceso a datos de comunidad
 */

import { createClient } from "@/lib/supabase/server";
import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import type {
  Foro,
  ForoConMetricas,
  Comentario,
  ComentarioConAutor,
  Articulo,
  CreateComentarioDTO,
  CreateReaccionDTO,
} from "./types";

// ─── Tipos crudos ─────────────────────────────────────────────────────────────
interface RawForo {
  idforo:        string;
  titulo:        string;
  descripcion:   string | null;
  categoria:     string | null;
  estado:        string;
  fechacreacion: string;
}

interface RawComentario {
  idcomentario:        string;
  contenido:           string;
  fechapublicacion:    string;
  idcomentario_padre:  string | null;
  idforo:              string;
  idusuario:           string;
  usuarios: {
    nombre:     string;
    apellido:   string;
    fotoperfil: string | null;
  } | null;
  reacciones: {
    tipo: string;
  }[];
}

interface RawArticulo {
  idarticulo:       string;
  titulo:           string;
  contenido:        string;
  categoria:        string | null;
  estado:           string;
  fechapublicacion: string;
}

export class ComunidadRepository {

  // ─── findForos ─────────────────────────────────────────────────────────────
  /**
   * Trae todos los foros abiertos con métricas básicas.
   */
  async findForos(usuarioId: string): Promise<Result<ForoConMetricas[]>> {
    const supabase = await createClient();

    interface RawForoConMetricas extends RawForo {
      comentarios:   { idcomentario: string }[];
      usuario_foro:  { idusuario: string }[];
    }

    const { data, error } = await supabase
      .schema("comunidad")
      .from("foros")
      .select(`
        idforo,
        titulo,
        descripcion,
        categoria,
        estado,
        fechacreacion,
        comentarios!idforo ( idcomentario ),
        usuario_foro!idforo ( idusuario )
      `)
      .eq("estado", "Abierto")
      .order("fechacreacion", { ascending: false })
      .returns<RawForoConMetricas[]>();

    if (error) return err(`Error al obtener foros: ${error.message}`);

    return ok(
      (data ?? []).map((row: RawForoConMetricas) => ({
        ...this.mapForoToDomain(row),
        totalComentarios:  row.comentarios?.length  ?? 0,
        totalSuscriptores: row.usuario_foro?.length ?? 0,
        estasSuscrito: (row.usuario_foro ?? []).some(
          (s) => s.idusuario === usuarioId
        ),
      }))
    );
  }

  // ─── findComentariosByForo ─────────────────────────────────────────────────
  /**
   * ⭐ Trae comentarios de un foro con autor, reacciones y respuestas anidadas.
   *
   * ESTRATEGIA:
   * 1. Traemos todos los comentarios del foro en una consulta
   * 2. Separamos padres e hijos en memoria
   * 3. Anidamos los hijos dentro de sus padres
   * Esto evita N+1 queries y es más eficiente que consultas recursivas.
   */
  async findComentariosByForo(
    foroId: string
  ): Promise<Result<ComentarioConAutor[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("comunidad")
      .from("comentarios")
      .select(`
        idcomentario,
        contenido,
        fechapublicacion,
        idcomentario_padre,
        idforo,
        idusuario,
        usuarios!idusuario (
          nombre,
          apellido,
          fotoperfil
        ),
        reacciones!idcomentario (
          tipo
        )
      `)
      .eq("idforo", foroId)
      .order("fechapublicacion", { ascending: true })
      .returns<RawComentario[]>();

    if (error) return err(`Error al obtener comentarios: ${error.message}`);

    const todos = (data ?? []).map((row: RawComentario) =>
      this.mapComentarioToDomain(row)
    );

    // ── Anidar respuestas en sus comentarios padre ─────────────────────────
    const padres = todos.filter((c) => !c.idComentarioPadre);
    const hijos  = todos.filter((c) =>  c.idComentarioPadre);

    const resultado = padres.map((padre) => ({
      ...padre,
      respuestas: hijos.filter(
        (hijo) => hijo.idComentarioPadre === padre.idComentario
      ),
    }));

    return ok(resultado);
  }

  // ─── createComentario ──────────────────────────────────────────────────────
  async createComentario(
    dto: CreateComentarioDTO
  ): Promise<Result<Comentario>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("comunidad")
      .from("comentarios")
      .insert({
        contenido:          dto.contenido,
        idcomentario_padre: dto.idComentarioPadre ?? null,
        idforo:             dto.idForo,
        idusuario:          dto.idUsuario,
      })
      .select("*")
      .returns<RawComentario>()
      .single();

    if (error) return err(`Error al crear comentario: ${error.message}`);

    const raw = data as RawComentario;
    return ok({
      idComentario:      raw.idcomentario,
      contenido:         raw.contenido,
      fechaPublicacion:  raw.fechapublicacion,
      idComentarioPadre: raw.idcomentario_padre,
      idForo:            raw.idforo,
      idUsuario:         raw.idusuario,
    });
  }

  // ─── toggleReaccion ────────────────────────────────────────────────────────
  /**
   * ⭐ Operación compuesta: agrega o elimina una reacción.
   * Si ya existe la reacción del usuario la elimina (toggle).
   */
  async toggleReaccion(dto: CreateReaccionDTO): Promise<Result<boolean>> {
    const supabase = await createClient();

    // Verificar si ya existe la reacción
    const queryExistente = supabase
      .schema("comunidad")
      .from("reacciones")
      .select("idreaccion")
      .eq("idusuario", dto.idUsuario);

    if (dto.idComentario) {
      queryExistente.eq("idcomentario", dto.idComentario);
    } else if (dto.idArticulo) {
      queryExistente.eq("idarticulo", dto.idArticulo);
    }

    const { data: existente } = await queryExistente
      .returns<{ idreaccion: string }[]>()
      .single();

    if (existente) {
      // Ya existe → eliminar (toggle off)
      const { error } = await supabase
        .schema("comunidad")
        .from("reacciones")
        .delete()
        .eq("idreaccion", (existente as { idreaccion: string }).idreaccion);

      if (error) return err(`Error al eliminar reacción: ${error.message}`);
      return ok(false); // false = reacción eliminada
    }

    // No existe → crear (toggle on)
    const { error } = await supabase
      .schema("comunidad")
      .from("reacciones")
      .insert({
        tipo:         dto.tipo,
        idusuario:    dto.idUsuario,
        idcomentario: dto.idComentario ?? null,
        idarticulo:   dto.idArticulo   ?? null,
      });

    if (error) return err(`Error al crear reacción: ${error.message}`);
    return ok(true); // true = reacción creada
  }

  // ─── suscribirseAForo ──────────────────────────────────────────────────────
  async suscribirseAForo(
    usuarioId: string,
    foroId:    string
  ): Promise<Result<boolean>> {
    const supabase = await createClient();

    const { error } = await supabase
      .schema("comunidad")
      .from("usuario_foro")
      .insert({ idusuario: usuarioId, idforo: foroId });

    if (error) return err(`Error al suscribirse al foro: ${error.message}`);
    return ok(true);
  }

  // ─── desuscribirseAForo ────────────────────────────────────────────────────
  async desuscribirseAForo(
    usuarioId: string,
    foroId:    string
  ): Promise<Result<boolean>> {
    const supabase = await createClient();

    const { error } = await supabase
      .schema("comunidad")
      .from("usuario_foro")
      .delete()
      .eq("idusuario", usuarioId)
      .eq("idforo",    foroId);

    if (error) return err(`Error al desuscribirse del foro: ${error.message}`);
    return ok(true);
  }

  // ─── findArticulosPublicados ───────────────────────────────────────────────
  async findArticulosPublicados(): Promise<Result<Articulo[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("comunidad")
      .from("articulos")
      .select("*")
      .eq("estado", "Publicado")
      .order("fechapublicacion", { ascending: false })
      .returns<RawArticulo[]>();

    if (error) return err(`Error al obtener artículos: ${error.message}`);

    return ok(
      (data ?? []).map((row: RawArticulo) => ({
        idArticulo:       row.idarticulo,
        titulo:           row.titulo,
        contenido:        row.contenido,
        categoria:        row.categoria,
        estado:           row.estado as Articulo["estado"],
        fechaPublicacion: row.fechapublicacion,
      }))
    );
  }

  // ─── mappers ───────────────────────────────────────────────────────────────
  private mapForoToDomain(row: RawForo): Foro {
    return {
      idForo:        row.idforo,
      titulo:        row.titulo,
      descripcion:   row.descripcion,
      categoria:     row.categoria,
      estado:        row.estado as Foro["estado"],
      fechaCreacion: row.fechacreacion,
    };
  }

  private mapComentarioToDomain(row: RawComentario): ComentarioConAutor {
    const reacciones = row.reacciones ?? [];
    return {
      idComentario:      row.idcomentario,
      contenido:         row.contenido,
      fechaPublicacion:  row.fechapublicacion,
      idComentarioPadre: row.idcomentario_padre,
      idForo:            row.idforo,
      idUsuario:         row.idusuario,
      autor: {
        nombre:     row.usuarios?.nombre     ?? "",
        apellido:   row.usuarios?.apellido   ?? "",
        fotoPerfil: row.usuarios?.fotoperfil ?? null,
      },
      reacciones: {
        meGusta:  reacciones.filter((r) => r.tipo === "Me gusta").length,
        meMotiva: reacciones.filter((r) => r.tipo === "Me motiva").length,
        util:     reacciones.filter((r) => r.tipo === "Util").length,
      },
      respuestas: [], // se llena en findComentariosByForo
    };
  }
}