/**
 * @file src/repositories/habito.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo habito.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class HabitoRepository extends BaseRepository {}

export const habitoRepository = new HabitoRepository();
