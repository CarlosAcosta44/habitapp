/**
 * @file src/repositories/entrenador.repository.ts
 * @description Repositorio para el módulo de Entrenadores.
 * Maneja rutinas, asignaciones y seguimientos con JOINs complejos.
 *
 * @pattern Repository Pattern
 * @principle SRP — solo acceso a datos de entrenadores
 * @layer Data & Infrastructure (Capa 4)
 */

import { createClient } from "@/lib/supabase/server";
import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import type {
  Entrenador,
  EntrenadorConPerfil,
  Rutina,
  RutinaConUsuarios,
  Seguimiento,
  CreateRutinaDTO,
  CreateSeguimientoDTO,
  AsignarRutinaDTO,
} from "@/types/domain/entrenador.types";

// ─── Tipos crudos ─────────────────────────────────────────────────────────────
interface RawEntrenador {
  identrenador:  string;
  especialidad:  string | null;
  certificacion: string | null;
  experiencia:   number | null;
  idusuario:     string;
  usuarios: {
    nombre:      string;
    apellido:    string;
    fotoperfil:  string | null;
    telefono:    string | null;
  } | null;
}

interface RawRutina {
  idrutina:     string;
  tipo:         string;
  descripcion:  string | null;
  duracion:     number | null;
  objetivo:     string | null;
  nivel:        string;
  identrenador: string;
}

interface RawRutinaConUsuarios extends RawRutina {
  usuario_rutina: {
    fechainicio: string;
    estado:      string;
    usuarios: {
      idusuario: string;
      nombre:    string;
      apellido:  string;
    } | null;
  }[];
}

interface RawSeguimiento {
  idseguimiento: string;
  fecha:         string;
  progreso:      string | null;
  observaciones: string | null;
  identrenador:  string;
  idusuario:     string;
}

export class EntrenadorRepository {

  // ─── findById ──────────────────────────────────────────────────────────────
  async findById(
    entrenadorId: string
  ): Promise<Result<EntrenadorConPerfil | null>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("entrenadores")
      .select(`
        identrenador,
        especialidad,
        certificacion,
        experiencia,
        idusuario,
        usuarios!idusuario (
          nombre,
          apellido,
          fotoperfil,
          telefono
        )
      `)
      .eq("identrenador", entrenadorId)
      .returns<RawEntrenador>()
      .single();

    if (error && error.code !== "PGRST116") {
      return err(`Error al buscar entrenador: ${error.message}`);
    }
    if (!data) return ok(null);

    return ok(this.mapEntrenadorToDomain(data as RawEntrenador));
  }

  // ─── findByUsuarioId ───────────────────────────────────────────────────────
  async findByUsuarioId(
    usuarioId: string
  ): Promise<Result<Entrenador | null>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("entrenadores")
      .select("*")
      .eq("idusuario", usuarioId)
      .returns<RawEntrenador>()
      .single();

    if (error && error.code !== "PGRST116") {
      return err(`Error al buscar entrenador: ${error.message}`);
    }
    if (!data) return ok(null);

    return ok({
      idEntrenador:  (data as RawEntrenador).identrenador,
      especialidad:  (data as RawEntrenador).especialidad,
      certificacion: (data as RawEntrenador).certificacion,
      experiencia:   (data as RawEntrenador).experiencia,
      idUsuario:     (data as RawEntrenador).idusuario,
    });
  }

  // ─── findUsuariosAsignados ─────────────────────────────────────────────────
  async findUsuariosAsignados(
    entrenadorId: string
  ): Promise<Result<{ idUsuario: string; nombre: string; apellido: string; fechaInicio: string }[]>> {
    const supabase = await createClient();

    interface RawAsignacion {
      fechainicio: string;
      usuarios: {
        idusuario: string;
        nombre:    string;
        apellido:  string;
      } | null;
    }

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("usuario_entrenador")
      .select(`
        fechainicio,
        usuarios!idusuario (
          idusuario,
          nombre,
          apellido
        )
      `)
      .eq("identrenador", entrenadorId)
      .returns<RawAsignacion[]>();

    if (error) return err(`Error al obtener usuarios del entrenador: ${error.message}`);

    return ok(
      (data ?? []).map((row: RawAsignacion) => ({
        idUsuario:   row.usuarios?.idusuario  ?? "",
        nombre:      row.usuarios?.nombre     ?? "",
        apellido:    row.usuarios?.apellido   ?? "",
        fechaInicio: row.fechainicio,
      }))
    );
  }

  // ─── findRutinasConUsuarios ────────────────────────────────────────────────
  async findRutinasConUsuarios(
    entrenadorId: string
  ): Promise<Result<RutinaConUsuarios[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("rutinas")
      .select(`
        idrutina,
        tipo,
        descripcion,
        duracion,
        objetivo,
        nivel,
        identrenador,
        usuario_rutina!idrutina (
          fechainicio,
          estado,
          usuarios!idusuario (
            idusuario,
            nombre,
            apellido
          )
        )
      `)
      .eq("identrenador", entrenadorId)
      .returns<RawRutinaConUsuarios[]>();

    if (error) return err(`Error al obtener rutinas: ${error.message}`);

    return ok(
      (data ?? []).map((row: RawRutinaConUsuarios) => ({
        ...this.mapRutinaToDomain(row),
        usuariosAsignados: (row.usuario_rutina ?? []).map((ur) => ({
          idUsuario:   ur.usuarios?.idusuario ?? "",
          nombre:      ur.usuarios?.nombre    ?? "",
          apellido:    ur.usuarios?.apellido  ?? "",
          fechaInicio: ur.fechainicio,
          estado:      ur.estado,
        })),
      }))
    );
  }

  // ─── createRutina ──────────────────────────────────────────────────────────
  async createRutina(dto: CreateRutinaDTO): Promise<Result<Rutina>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("rutinas")
      .insert({
        tipo:         dto.tipo,
        descripcion:  dto.descripcion,
        duracion:     dto.duracion,
        objetivo:     dto.objetivo,
        nivel:        dto.nivel,
        identrenador: dto.idEntrenador,
      })
      .select("*")
      .returns<RawRutina>()
      .single();

    if (error) return err(`Error al crear rutina: ${error.message}`);
    return ok(this.mapRutinaToDomain(data as RawRutina));
  }

  // ─── asignarRutina ─────────────────────────────────────────────────────────
  async asignarRutina(dto: AsignarRutinaDTO): Promise<Result<boolean>> {
    const supabase = await createClient();

    const { error } = await supabase
      .schema("seguimiento")
      .from("usuario_rutina")
      .insert({
        idusuario:   dto.idUsuario,
        idrutina:    dto.idRutina,
        fechainicio: dto.fechaInicio,
        estado:      "Activo",
      });

    if (error) return err(`Error al asignar rutina: ${error.message}`);
    return ok(true);
  }

  // ─── createSeguimiento ─────────────────────────────────────────────────────
  async createSeguimiento(
    dto: CreateSeguimientoDTO
  ): Promise<Result<Seguimiento>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("seguimientos")
      .insert({
        fecha:         dto.fecha,
        progreso:      dto.progreso,
        observaciones: dto.observaciones,
        identrenador:  dto.idEntrenador,
        idusuario:     dto.idUsuario,
      })
      .select("*")
      .returns<RawSeguimiento>()
      .single();

    if (error) return err(`Error al crear seguimiento: ${error.message}`);
    return ok(this.mapSeguimientoToDomain(data as RawSeguimiento));
  }

  // ─── findSeguimientosByUsuario ─────────────────────────────────────────────
  async findSeguimientosByUsuario(
    usuarioId:    string,
    entrenadorId: string
  ): Promise<Result<Seguimiento[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("seguimientos")
      .select("*")
      .eq("idusuario",    usuarioId)
      .eq("identrenador", entrenadorId)
      .order("fecha", { ascending: false })
      .returns<RawSeguimiento[]>();

    if (error) return err(`Error al obtener seguimientos: ${error.message}`);
    return ok((data ?? []).map(this.mapSeguimientoToDomain));
  }

  // ─── mappers ───────────────────────────────────────────────────────────────
  private mapEntrenadorToDomain(row: RawEntrenador): EntrenadorConPerfil {
    return {
      idEntrenador:  row.identrenador,
      especialidad:  row.especialidad,
      certificacion: row.certificacion,
      experiencia:   row.experiencia,
      idUsuario:     row.idusuario,
      usuario: {
        nombre:     row.usuarios?.nombre     ?? "",
        apellido:   row.usuarios?.apellido   ?? "",
        fotoPerfil: row.usuarios?.fotoperfil ?? null,
        telefono:   row.usuarios?.telefono   ?? null,
      },
    };
  }

  private mapRutinaToDomain(row: RawRutina): Rutina {
    return {
      idRutina:     row.idrutina,
      tipo:         row.tipo,
      descripcion:  row.descripcion,
      duracion:     row.duracion,
      objetivo:     row.objetivo,
      nivel:        row.nivel as Rutina["nivel"],
      idEntrenador: row.identrenador,
    };
  }

  private mapSeguimientoToDomain(row: RawSeguimiento): Seguimiento {
    return {
      idSeguimiento: row.idseguimiento,
      fecha:         row.fecha,
      progreso:      row.progreso,
      observaciones: row.observaciones,
      idEntrenador:  row.identrenador,
      idUsuario:     row.idusuario,
    };
  }
}
