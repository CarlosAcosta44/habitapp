"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, HelpCircle, FileText } from "lucide-react";

export default function SoportePage() {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <Link 
          href="/ajustes" 
          className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 text-sm font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Ajustes
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white italic">Soporte</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          ¿Tienes dudas o necesitas ayuda? Estamos aquí para acompañarte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm hover:border-pink-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Email</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Escríbenos directamente y te responderemos en menos de 24h.</p>
          <a href="mailto:soporte@habitapp.com" className="text-pink-500 font-bold text-sm">soporte@habitapp.com</a>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm hover:border-indigo-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Chat en Vivo</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Habla con nuestro equipo de moderadores y soporte técnico.</p>
          <button className="text-indigo-500 font-bold text-sm">Iniciar Chat</button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-500" />
          Preguntas Frecuentes
        </h2>
        
        <div className="space-y-6">
          {[
            { q: "¿Cómo funcionan las rachas?", a: "Las rachas se mantienen completando tus hábitos antes de la medianoche cada día." },
            { q: "¿Puedo ser entrenador?", a: "Sí, puedes solicitar una cuenta de entrenador en la sección de postulaciones." },
            { q: "¿Mis datos son privados?", a: "Absolutamente. Usamos cifrado de extremo a extremo para tu seguridad." }
          ].map((faq, i) => (
            <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{faq.q}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
