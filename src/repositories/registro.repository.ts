/**
 * @file src/repositories/registro.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo registro.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class RegistroRepository extends BaseRepository {}

export const registroRepository = new RegistroRepository();
