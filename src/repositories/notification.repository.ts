/**
 * @file src/repositories/notification.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo notification.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class NotificationRepository extends BaseRepository {}

export const notificationRepository = new NotificationRepository();
