/**
 * @file src/repositories/usuario.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo usuario.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class UsuarioRepository extends BaseRepository {}

export const usuarioRepository = new UsuarioRepository();
