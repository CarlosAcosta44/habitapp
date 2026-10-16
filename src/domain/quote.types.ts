/**
 * @file src/domain/quote.types.ts
 * @description Tipos de dominio para frases motivacionales.
 * @layer Domain (Capa 4 — Núcleo)
 */

export interface DailyQuote {
  id?: string;
  phrase: string;
  author: string;
  created_at?: string;
}
