"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Toma agua",
    progress: "4 de 5 vasos completados",
    percent: 80,
    icon: "💧",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Caminar",
    progress: "8.5k pasos",
    percent: 100,
    racha: "RACHA: 12",
    icon: "🚶",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Meditación",
    progress: "¡Objetivo alcanzado!",
    percent: 100,
    icon: "🧘",
    color: "from-indigo-500 to-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function ProgressSection() {
  return (
    <section id="funcionalidades" className="py-32 relative bg-[#030612]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white">Sigue tu progreso</h2>
            <p className="text-slate-500 italic">Tus metas, visualizadas de forma premium.</p>
          </div>
          <div className="text-indigo-500 text-3xl">🗠</div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-12">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${feature.bg} text-2xl`}>
                  {feature.icon}
                </div>
                {feature.racha && (
                  <span className="px-3 py-1 bg-pink-500 text-[10px] font-bold text-white rounded-full">
                    {feature.racha}
                  </span>
                )}
                {!feature.racha && (
                   <span className="text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full border border-white/10">
                     {feature.percent}%
                   </span>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${feature.percent}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${feature.color}`}
                    />
                  </div>
                  <p className="text-slate-400 text-sm">{feature.progress}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
