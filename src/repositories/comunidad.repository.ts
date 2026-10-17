/**
 * @file src/repositories/comunidad.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo comunidad.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class ComunidadRepository extends BaseRepository {}

export const comunidadRepository = new ComunidadRepository();
