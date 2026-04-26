'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { X, Sparkles, Plus, Ban, Smile, ArrowLeft } from 'lucide-react';
import { createHabitoAction } from '@/actions/habito.actions';

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewHabitModal({ isOpen, onClose }: NewHabitModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<'buen_habito' | 'mal_habito' | 'animo'>('buen_habito');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#13112E] w-full max-w-[500px] rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {view === 'buen_habito' ? 'Nuevo Buen Hábito' : 
               view === 'mal_habito' ? 'Dejar Mal Hábito' : 'Estado de Ánimo'}
            </h2>
          </div>
          <button 
            onClick={() => { setView('buen_habito'); onClose(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Categories (TABS) */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div 
            onClick={() => setView('mal_habito')} 
            className={`border rounded-2xl p-4 flex flex-col items-center cursor-pointer transition text-center ${view === 'mal_habito' ? 'bg-[#201D45] border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#1A183A] border-transparent hover:bg-[#201D45]'}`}
          >
            <div className={`w-12 h-12 rounded-xl mb-2 flex items-center justify-center ${view === 'mal_habito' ? 'bg-gradient-to-tr from-red-600 to-orange-500 text-white' : 'bg-slate-800 text-red-400'}`}>
               <Ban size={24} />
            </div>
            <span className={`text-xs font-semibold ${view === 'mal_habito' ? 'text-white' : 'text-slate-300'}`}>Dejar mal hábito</span>
          </div>
          
          <div 
            onClick={() => setView('buen_habito')} 
            className={`border rounded-2xl p-4 flex flex-col items-center cursor-pointer transition text-center ${view === 'buen_habito' ? 'bg-[#201D45] border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-[#1A183A] border-transparent hover:bg-[#201D45]'}`}
          >
            <div className={`w-12 h-12 rounded-xl mb-2 flex items-center justify-center ${view === 'buen_habito' ? 'bg-gradient-to-tr from-indigo-500 to-purple-400 text-white' : 'bg-slate-800 text-indigo-400'}`}>
               <Sparkles size={24} />
            </div>
            <span className={`text-xs font-semibold ${view === 'buen_habito' ? 'text-white' : 'text-slate-300'}`}>Nuevo buen hábito</span>
          </div>

          <div 
            onClick={() => setView('animo')} 
            className={`border rounded-2xl p-4 flex flex-col items-center cursor-pointer transition text-center ${view === 'animo' ? 'bg-[#201D45] border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-[#1A183A] border-transparent hover:bg-[#201D45]'}`}
          >
            <div className={`w-12 h-12 rounded-xl mb-2 flex items-center justify-center ${view === 'animo' ? 'bg-gradient-to-tr from-orange-500 to-yellow-500 text-white' : 'bg-orange-900/40 text-orange-400'}`}>
               <Smile size={24} />
            </div>
            <span className={`text-xs font-semibold ${view === 'animo' ? 'text-white' : 'text-slate-300'}`}>Estado de ánimo</span>
          </div>
        </div>

        {/* Tab Content */}

        {view === 'animo' && (
          <div className="text-center py-6">
             <p className="text-slate-400 text-sm mb-6">¿Cómo te sientes en este momento?</p>
             <div className="flex justify-center gap-4">
                {['😄','🙂','😐','😔','😡'].map(emoji => (
                   <button 
                     key={emoji} 
                     type="button"
                     onClick={() => {
                        alert(`¡Registramos que te sientes ${emoji}! (Simulado)`);
                        setView('buen_habito');
                        onClose();
                     }}
                     className="text-4xl hover:scale-125 transition-transform cursor-pointer"
                   >{emoji}</button>
                ))}
             </div>
          </div>
        )}

        {view === 'buen_habito' && (
          <HabitList 
            items={[
              { nombre: 'Caminar', icono: '🏃', cat: 'cat-ejercicio', pts: 30, u: 1500 },
              { nombre: 'Nadar', icono: '🏊', cat: 'cat-ejercicio', pts: 40, u: 800 },
              { nombre: 'Leer', icono: '📚', cat: 'cat-productividad', pts: 30, u: 3200 },
              { nombre: 'Dormir 8h', icono: '🌙', cat: 'cat-sueno', pts: 50, u: 4500 }
            ]}
            onClose={() => { setView('buen_habito'); onClose(); }}
          />
        )}

        {view === 'mal_habito' && (
          <HabitList 
            isBad
            items={[
               { nombre: 'Fumar', icono: '🚬', cat: 'cat-salud-mental', pts: 50, u: 2100 },
               { nombre: 'Alcohol', icono: '🍺', cat: 'cat-nutricion', pts: 50, u: 1800 },
               { nombre: 'Comida Chatarra', icono: '🍔', cat: 'cat-nutricion', pts: 30, u: 3400 },
               { nombre: 'Procrastinar', icono: '📱', cat: 'cat-productividad', pts: 30, u: 5600 }
            ]}
            onClose={() => { setView('buen_habito'); onClose(); }}
          />
        )}

        {/* Custom Habit Button ALWAYS VISIBLE */}
        <Link 
          href="/habitos/crear" 
          onClick={() => { setView('buen_habito'); onClose(); }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full border border-dashed border-slate-600 text-slate-300 font-semibold text-sm hover:border-indigo-400 hover:text-indigo-300 transition-colors bg-slate-800/30 hover:bg-slate-800/60 mt-4"
        >
          <Plus size={18} />
          Crear hábito personalizado
        </Link>

      </div>
    </div>,
    document.body
  );
}

// Sub-componente interactivo para crear en 1 click
function HabitList({ items, onClose, isBad }: { items: any[], onClose: ()=>void, isBad?: boolean }) {
   const [loadingIdx, setLoadingIdx] = useState<number | null>(null);

   const handleAdd = async (habito: any, idx: number) => {
      setLoadingIdx(idx);
      const fd = new FormData();
      fd.append('nombre', isBad ? `Dejar de ${habito.nombre.toLowerCase()}` : habito.nombre);
      fd.append('descripcion', isBad ? 'Evitar este hábito hoy' : 'Hábito predeterminado del sistema');
      fd.append('fechaInicio', new Date().toISOString().split('T')[0]);
      fd.append('puntos', habito.pts.toString());
      fd.append('idCategoria', habito.cat);
      fd.append('metaDiaria', '1');
      fd.append('unidadMedida', 'veces');
      
      const res = await createHabitoAction(null, fd);
      setLoadingIdx(null);
      if (res.success) {
         alert('✨ Hábito adoptado exitosamente en tu perfil');
         onClose();
      } else {
         alert('Error al adoptar: ' + res.message);
      }
   };

   return (
      <div className="space-y-3 pb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
         {items.map((item, idx) => (
            <div key={item.nombre} className={`${isBad ? 'bg-[#3A1818]/40 border-red-900/40' : 'bg-[#E6F0FF]/10 border-indigo-900/40'} border rounded-2xl p-3 pr-4 flex items-center gap-3 transition block`}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-xl">
                {item.icono}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${isBad ? 'text-red-300' : 'text-slate-100'}`}>{isBad ? 'Dejar de ' : ''}{item.nombre}</p>
                <p className="text-slate-500 text-[10px]">{item.u} personas adoptaron esto</p>
              </div>
              <button 
                 disabled={loadingIdx === idx}
                 onClick={() => handleAdd(item, idx)}
                 className={`w-8 h-8 rounded-full border border-slate-600 flex flex-shrink-0 items-center justify-center text-slate-100 hover:bg-slate-700 transition ${loadingIdx===idx ? 'opacity-50 cursor-wait' : ''}`}
               >
                 {loadingIdx === idx ? '...' : <Plus size={16} />}
              </button>
            </div>
         ))}
      </div>
   );
}
