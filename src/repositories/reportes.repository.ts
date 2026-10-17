/**
 * @file src/repositories/reportes.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo reportes.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class ReportesRepository extends BaseRepository {}

export const reportesRepository = new ReportesRepository();
