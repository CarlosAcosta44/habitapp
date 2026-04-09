/**
 * @file src/modules/habitos/habito.repository.ts
 * @description Repositorio para seguimiento.habitos con JOINs y operaciones compuestas.
 * @pattern Repository Pattern
 * @principle SRP — acceso a datos de hábitos únicamente
 * @principle OCP — implementa IRepository sin modificarlo
 * @principle DIP — depende de abstracciones, no de Supabase directamente
 */

import { createClient } from "@/lib/supabase/server";import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import type {
  IRepository,
  IUserScopedRepository,
} from "@/lib/interfaces/repository.interface";
import type {
  Habito,
  HabitoConCategoria,
  HabitoConProgreso,
  CreateHabitoDTO,
  UpdateHabitoDTO,
  HabitoFilters,
  CategoriaHabito,
} from "./types";

// ─── Tipo crudo que devuelve Supabase ─────────────────────────────────────────
// Definimos el tipo explícitamente para evitar errores de inferencia
interface RawHabito {
  idhabito:    string;
  nombre:      string;
  descripcion: string | null;
  fechainicio: string;
  fechafin:    string | null;
  estado:      string;
  puntos:      number;
  idusuario:   string;
  idcategoria: string;
  categorias_habitos: {
    idcategoria: string;
    nombre:      string;
    descripcion: string | null;
  } | null;
}

interface RawHabitoConRegistro extends RawHabito {
  registro_habitos: {
    idregistro:    string;
    completado:    boolean;
    puntos_ganados: number;
    observacion:   string | null;
    fecha:         string;
  }[] | null;
}

// ─── Query SELECT reutilizable ────────────────────────────────────────────────
const HABITO_CON_CATEGORIA_SELECT = `
  idhabito,
  nombre,
  descripcion,
  fechainicio,
  fechafin,
  estado,
  puntos,
  idusuario,
  idcategoria,
  categorias_habitos (
    idcategoria,
    nombre,
    descripcion
  )
` as const;

export class HabitoRepository
  implements
    IRepository<Habito, CreateHabitoDTO>,
    IUserScopedRepository<HabitoConCategoria>
{
  // ─── findById ──────────────────────────────────────────────────────────────
  async findById(id: string): Promise<Result<HabitoConCategoria | null>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("habitos")
      .select(HABITO_CON_CATEGORIA_SELECT)
      .eq("idhabito", id)
      .returns<RawHabito>()
      .single();

    if (error && error.code !== "PGRST116") {
      return err(`Error al buscar hábito: ${error.message}`);
    }
    if (!data) return ok(null);

    return ok(this.mapToDomain(data as RawHabito));
  }

  // ─── findAll ───────────────────────────────────────────────────────────────
  async findAll(): Promise<Result<HabitoConCategoria[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("habitos")
      .select(HABITO_CON_CATEGORIA_SELECT)
      .returns<RawHabito[]>()
      .order("fechainicio", { ascending: false });

    if (error) return err(`Error al obtener hábitos: ${error.message}`);
    return ok((data ?? []).map((row: RawHabito) => this.mapToDomain(row)));
  }

  // ─── findByUserId ──────────────────────────────────────────────────────────
  async findByUserId(
    userId: string,
    filters?: HabitoFilters
  ): Promise<Result<HabitoConCategoria[]>> {
    const supabase = await createClient();

    let query = supabase
      .schema("seguimiento")
      .from("habitos")
      .select(HABITO_CON_CATEGORIA_SELECT)
      .eq("idusuario", userId)
      .order("fechainicio", { ascending: false });

    if (filters?.estado)      query = query.eq("estado",      filters.estado);
    if (filters?.idCategoria) query = query.eq("idcategoria", filters.idCategoria);

    const { data, error } = await query.returns<RawHabito[]>();

    if (error) return err(`Error al obtener hábitos del usuario: ${error.message}`);
    return ok((data ?? []).map((row: RawHabito) => this.mapToDomain(row)));
  }

  // ─── findByUserIdConProgreso ───────────────────────────────────────────────
  async findByUserIdConProgreso(
    userId: string
  ): Promise<Result<HabitoConProgreso[]>> {
    const supabase = await createClient();
    const hoy = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("habitos")
      .select(`
        idhabito,
        nombre,
        descripcion,
        fechainicio,
        fechafin,
        estado,
        puntos,
        idusuario,
        idcategoria,
        categorias_habitos (
          idcategoria,
          nombre,
          descripcion
        ),
        registro_habitos (
          idregistro,
          completado,
          puntos_ganados,
          observacion,
          fecha
        )
      `)
      .eq("idusuario", userId)
      .eq("estado", "Activo")
      .order("nombre", { ascending: true })
      .returns<RawHabitoConRegistro[]>();

    if (error) return err(`Error al obtener hábitos con progreso: ${error.message}`);

    const result = (data ?? []).map((row: RawHabitoConRegistro) => {
      const registros   = row.registro_habitos ?? [];
      const registroHoy = registros.find((r) => r.fecha === hoy) ?? null;

      return {
        ...this.mapToDomain(row),
        registroHoy: registroHoy
          ? {
              idRegistro:    registroHoy.idregistro,
              completado:    registroHoy.completado,
              puntosGanados: registroHoy.puntos_ganados,
              observacion:   registroHoy.observacion,
            }
          : null,
      } as HabitoConProgreso;
    });

    return ok(result);
  }

  // ─── create ────────────────────────────────────────────────────────────────
  async create(data: CreateHabitoDTO): Promise<Result<Habito>> {
    const supabase = await createClient();

    const { data: created, error } = await supabase
      .schema("seguimiento")
      .from("habitos")
      .insert({
        nombre:      data.nombre,
        descripcion: data.descripcion,
        fechainicio: data.fechaInicio,
        fechafin:    data.fechaFin,
        estado:      data.estado,
        puntos:      data.puntos,
        idusuario:   data.idUsuario,
        idcategoria: data.idCategoria,
      })
      .select("*")
      .returns<RawHabito>()
      .single();

    if (error) return err(`Error al crear hábito: ${error.message}`);
    return ok(this.mapToDomain(created as RawHabito));
  }

  // ─── update ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    updates: UpdateHabitoDTO
  ): Promise<Result<Habito | null>> {
    const supabase = await createClient();

    const dbUpdates: Record<string, unknown> = {};
    if (updates.nombre      !== undefined) dbUpdates.nombre      = updates.nombre;
    if (updates.descripcion !== undefined) dbUpdates.descripcion = updates.descripcion;
    if (updates.fechaFin    !== undefined) dbUpdates.fechafin    = updates.fechaFin;
    if (updates.estado      !== undefined) dbUpdates.estado      = updates.estado;
    if (updates.puntos      !== undefined) dbUpdates.puntos      = updates.puntos;
    if (updates.idCategoria !== undefined) dbUpdates.idcategoria = updates.idCategoria;

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("habitos")
      .update(dbUpdates)
      .eq("idhabito", id)
      .select("*")
      .returns<RawHabito>()
      .single();

    if (error) return err(`Error al actualizar hábito: ${error.message}`);
    return ok(data ? this.mapToDomain(data as RawHabito) : null);
  }

  // ─── delete ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<Result<boolean>> {
    const supabase = await createClient();

    const { error } = await supabase
      .schema("seguimiento")
      .from("habitos")
      .delete()
      .eq("idhabito", id);

    if (error) return err(`Error al eliminar hábito: ${error.message}`);
    return ok(true);
  }

  // ─── findCategorias ────────────────────────────────────────────────────────
  async findCategorias(): Promise<Result<CategoriaHabito[]>> {
    const supabase = await createClient();

    // Definimos el tipo crudo de la tabla categorias_habitos
    interface RawCategoria {
      idcategoria: string;
      nombre:      string;
      descripcion: string | null;
    }

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("categorias_habitos")
      .select("idcategoria, nombre, descripcion")
      .order("nombre", { ascending: true })
      .returns<RawCategoria[]>();

    if (error) {
      console.error("[HabitoRepository.findCategorias] Error Supabase:", {
        message: error.message,
        code:    error.code,
        details: error.details,
        hint:    error.hint,
      });
      return err(`Error al obtener categorías: ${error.message}`);
    }

    console.log("[HabitoRepository.findCategorias] Filas recibidas:", data?.length ?? 0);

    return ok(
      (data ?? []).map((row: RawCategoria) => ({
        idCategoria: row.idcategoria,
        nombre:      row.nombre,
        descripcion: row.descripcion,
      }))
    );
  }
  // ─── mapToDomain ───────────────────────────────────────────────────────────
  private mapToDomain(row: RawHabito): HabitoConCategoria {
    const cat = row.categorias_habitos;
    return {
      idHabito:    row.idhabito,
      nombre:      row.nombre,
      descripcion: row.descripcion,
      fechaInicio: row.fechainicio,
      fechaFin:    row.fechafin,
      estado:      row.estado as Habito["estado"],
      puntos:      row.puntos,
      idUsuario:   row.idusuario,
      idCategoria: row.idcategoria,
      categoria: {
        idCategoria: cat?.idcategoria ?? "",
        nombre:      cat?.nombre      ?? "",
        descripcion: cat?.descripcion ?? null,
      },
    };
  }
}