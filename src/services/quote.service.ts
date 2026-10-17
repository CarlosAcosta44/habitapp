/**
 * @file src/services/quote.service.ts
 * @description Servicio de frases motivacionales — orquesta obtención de la frase del día con fallback.
 * @layer Business Logic / Service (Capa 3)
 */

import { quoteRepository } from "@/repositories/quote.repository";
import { ok } from "@/lib/result";
import type { Result } from "@/lib/result";
import type { DailyQuote } from "@/domain/quote.types";

const FALLBACK_QUOTE: DailyQuote = {
  phrase: "Transforma tus metas en hábitos y tus hábitos en realidad.",
  author: "HabitApp",
};

export class QuoteService {
  async getDailyQuote(): Promise<Result<DailyQuote>> {
    const result = await quoteRepository.getDailyQuote();
    if (result.success && result.data?.phrase) {
      return result;
    }
    return ok(FALLBACK_QUOTE);
  }
}

export const quoteService = new QuoteService();
