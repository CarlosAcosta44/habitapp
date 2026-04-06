/**
 * @file src/modules/comunidad/types.ts
 * @description Tipos de dominio para el módulo de Comunidad.
 */

// ─── Foro ─────────────────────────────────────────────────────────────────────
export interface Foro {
  idForo:        string;
  titulo:        string;
  descripcion:   string | null;
  categoria:     string | null;
  estado:        "Abierto" | "Cerrado";
  fechaCreacion: string;
}

// ─── Foro con métricas (JOIN con conteos) ─────────────────────────────────────
export interface ForoConMetricas extends Foro {
  totalComentarios: number;
  totalSuscriptores: number;
  estasSuscrito:    boolean; // para el usuario actual
}

// ─── Comentario ───────────────────────────────────────────────────────────────
export interface Comentario {
  idComentario:      string;
  contenido:         string;
  fechaPublicacion:  string;
  idComentarioPadre: string | null;
  idForo:            string;
  idUsuario:         string;
}

// ─── Comentario con autor y respuestas anidadas ───────────────────────────────
export interface ComentarioConAutor extends Comentario {
  autor: {
    nombre:     string;
    apellido:   string;
    fotoPerfil: string | null;
  };
  reacciones: {
    meGusta:   number;
    meMotiva:  number;
    util:      number;
  };
  respuestas: ComentarioConAutor[]; // anidado
}

// ─── Artículo ─────────────────────────────────────────────────────────────────
export interface Articulo {
  idArticulo:       string;
  titulo:           string;
  contenido:        string;
  categoria:        string | null;
  estado:           "Borrador" | "Publicado" | "Archivado";
  fechaPublicacion: string;
}

// ─── Hábitos populares ────────────────────────────────────────────────────────
export interface HabitoPopular {
  idHabito:    string;
  nombre:      string;
  categoria:   string;
  frecuencia:  string;
  totalUsuarios: number;
}

// ─── Entrenador público ───────────────────────────────────────────────────────
export interface EntrenadorPublico {
  idEntrenador: string;
  nombre:       string;
  apellido:     string;
  fotoPerfil:   string | null;
  especialidad: string | null;
  certificacion: string | null;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export type CreateComentarioDTO = Omit<Comentario, "idComentario" | "fechaPublicacion">;
export type CreateReaccionDTO = {
  tipo:         "Me gusta" | "Me motiva" | "Util";
  idUsuario:    string;
  idComentario?: string;
  idArticulo?:   string;
};