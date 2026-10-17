/**
 * @file src/repositories/coach.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo coach.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class CoachRepository extends BaseRepository {}

export const coachRepository = new CoachRepository();
