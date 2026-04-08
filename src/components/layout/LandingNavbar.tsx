"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LandingNavbar() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-morphism mx-auto mt-4 max-w-7xl rounded-2xl"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">
          Habit<span className="text-indigo-500">App</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <button
          onClick={() => scrollTo("funcionalidades")}
          className="hover:text-white transition-colors cursor-pointer"
        >
          FUNCIONALIDADES
        </button>
        <button
          onClick={() => scrollTo("nosotros")}
          className="hover:text-white transition-colors cursor-pointer"
        >
          NOSOTROS
        </button>
      </div>

      <Link
        href="/login"
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
      >
        INICIAR SESIÓN
      </Link>
    </motion.nav>
  );
}
