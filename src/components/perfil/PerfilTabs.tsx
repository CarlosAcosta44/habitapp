/**
 * @file src/components/perfil/PerfilTabs.tsx
 * @description Client component para manejar las tabs del perfil.
 * Actividad | Amigos | Logros
 */

"use client";

import { useState } from "react";

interface PerfilTabsProps {
  children: React.ReactNode[];
  tabs: string[];
}

export function PerfilTabs({ children, tabs }: PerfilTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-6 border-b border-slate-800/50 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === i
                ? "text-indigo-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
            {activeTab === i && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>{children[activeTab]}</div>
    </div>
  );
}
