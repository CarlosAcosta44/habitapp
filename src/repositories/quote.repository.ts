/**
 * @file src/repositories/quote.repository.ts
 * @description Repositorio para acceder a las frases motivacionales del backend.
 * @layer Data Access / Repository (Capa 2)
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";
import type { DailyQuote } from "@/domain/quote.types";

export class QuoteRepository {
  async getDailyQuote(): Promise<Result<DailyQuote>> {
    return apiClient.get<DailyQuote>("admin/quotes/daily");
  }
}

export const quoteRepository = new QuoteRepository();
