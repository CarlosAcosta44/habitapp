"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";

export default function ValorarPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (rating === 0) return;
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto pb-12 flex flex-col items-center text-center">
      <div className="w-full text-left mb-8">
        <Link 
          href="/ajustes" 
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Ajustes
        </Link>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 rounded-[3rem] p-12 shadow-2xl w-full">
        {!sent ? (
          <>
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
              <Star className="w-10 h-10 fill-amber-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">¿Qué te parece HabitApp?</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 italic">Tu opinión nos ayuda a mejorar. Esta valoración se registra en nuestro sistema de calidad para ser analizada por el equipo de desarrollo.</p>

            <div className="flex justify-center gap-3 mb-10">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform active:scale-95"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      (hover || rating) >= s ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <textarea 
              placeholder="¿Alguna sugerencia especial? (Opcional)"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-all mb-8 min-h-[100px]"
            />

            <button 
              onClick={handleSend}
              disabled={rating === 0}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                rating > 0 
                ? "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              Enviar Valoración
            </button>
          </>
        ) : (
          <div className="py-10">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
              <Star className="w-10 h-10 fill-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">¡Gracias por tu apoyo!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 italic">Cada estrella cuenta para seguir mejorando esta experiencia.</p>
            <Link 
              href="/ajustes"
              className="inline-block px-8 py-3 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold transition-all"
            >
              Cerrar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
