'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { X, Flame, Trash2, Ban, CheckCircle2 } from 'lucide-react';
import type { HabitoConProgreso } from '@/types/domain/habito.types';
import { 
  marcarCompletadoAction, 
  avanzarProgresoAction 
} from '@/actions/registro.actions';
import { deleteHabitoAction } from '@/actions/habito.actions';

interface HabitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  habito: HabitoConProgreso;
  rachaActual: number;
}

export function HabitDetailModal({ isOpen, onClose, habito, rachaActual }: HabitDetailModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  const completado = habito.registroHoy?.completado ?? false;
  const progresoActual = habito.registroHoy?.progresoActual ?? 0;
  const metaDiaria = habito.metaDiaria;
  
  // Calcular porcentaje limitando al 100%
  const percentage = Math.min(100, Math.round((progresoActual / metaDiaria) * 100));
  
  // Radius and Circumference for the SVG circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleCompletarTodo = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set('idHabito', habito.idHabito);
      fd.set('fecha', new Date().toISOString().split('T')[0]);
      
      // Enviamos el maximo a sumar para forzar el llenado si es cuantitativo
      // o simplemente marcarCompletado si no lo es.
      fd.set('cantidadAsumar', metaDiaria.toString());
      fd.set('metaDiaria', metaDiaria.toString());
      
      await avanzarProgresoAction(null, fd);
      onClose();
    });
  };

  const handleSaltar = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set('idHabito', habito.idHabito);
      fd.set('fecha', new Date().toISOString().split('T')[0]);
      fd.set('cantidadAsumar', '0');
      fd.set('metaDiaria', metaDiaria.toString());
      fd.set('observacion', 'Saltado voluntariamente');
      // Técnicamente avanza 0, pero guarda la observación
      await avanzarProgresoAction(null, fd);
      onClose();
    });
  };

  const handleEliminar = () => {
    startTransition(async () => {
      if (confirm('¿Estás seguro de que quieres eliminar este hábito y todo su progreso?')) {
        const fd = new FormData();
        fd.set('id', habito.idHabito);
        const result = await deleteHabitoAction(null, fd);
        
        if (result.success) {
          onClose();
        } else {
          alert(`Error: ${result.message}`);
        }
      }
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#13112E] w-full max-w-[450px] rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-2xl flex items-center justify-center border border-slate-700/50 shadow-inner">
               💧
            </div>
            <div>
              <h2 className="text-xl font-bold">{habito.nombre}</h2>
              <p className="text-slate-400 text-sm italic">{habito.descripcion || 'Mantén tu racha activa'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Panel */}
        <div className="grid grid-cols-[1fr_1.2fr] gap-4 mb-6">
          
          {/* Progress Circle Container */}
          <div className="flex flex-col items-center justify-center py-4 bg-[#1A183A]/50 rounded-3xl border border-white/5 relative">
            <svg width="150" height="150" className="transform -rotate-90 drop-shadow-xl">
               <circle
                 cx="75"
                 cy="75"
                 r={radius}
                 className="stroke-slate-800/60"
                 strokeWidth="12"
                 fill="none"
               />
               <circle
                 cx="75"
                 cy="75"
                 r={radius}
                 className={`transition-all duration-1000 ease-out ${completado ? 'stroke-indigo-400' : 'stroke-indigo-500'}`}
                 strokeWidth="12"
                 fill="none"
                 strokeDasharray={circumference}
                 strokeDashoffset={strokeDashoffset}
                 strokeLinecap="round"
               />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black tracking-tighter">
                {progresoActual}<span className="text-sm font-normal text-slate-400"> {habito.unidadMedida === 'veces' && metaDiaria === 1 ? '' : habito.unidadMedida}</span>
              </span>
              {(metaDiaria > 1 || habito.unidadMedida !== 'veces') && (
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  META: {metaDiaria}
                </span>
              )}
            </div>
          </div>

          {/* Stats Column */}
          <div className="flex flex-col gap-3">
             <div className="bg-[#1A183A]/50 rounded-2xl border border-white/5 p-4 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <Flame className="text-indigo-400" size={16} />
                 <span className="text-xs font-medium text-slate-400">Racha actual</span>
               </div>
               <span className="font-bold">{rachaActual} días</span>
             </div>

             <div className="bg-[#1A183A]/50 rounded-2xl border border-white/5 p-4 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <span className="text-pink-400 text-lg leading-none">🏆</span>
                 <span className="text-xs font-medium text-slate-400">Mejor racha</span>
               </div>
               <span className="font-bold">{habito.puntos} pts</span>
             </div>

             <div className="bg-[#1A183A]/50 rounded-2xl border border-white/5 p-4 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-indigo-400" size={16} />
                 <span className="text-xs font-medium text-slate-400">Progreso hoy</span>
               </div>
               <span className="font-bold">{progresoActual}/{metaDiaria}</span>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 h-[52px]">
           <button 
             onClick={handleSaltar}
             disabled={isPending}
             className="flex-1 rounded-full border border-slate-700/50 bg-[#1A183A] flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 hover:bg-[#201D45] transition disabled:opacity-50"
           >
             <Ban size={14} /> Saltar hábito
           </button>
           <button 
             onClick={handleEliminar}
             disabled={isPending}
             className="flex-1 rounded-full border border-red-900/30 bg-[#1A183A] text-red-400 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-red-900/20 transition disabled:opacity-50"
           >
             <Trash2 size={14} /> Eliminar
           </button>
           <button 
             onClick={handleCompletarTodo}
             disabled={isPending || completado}
             className="flex-[1.2] rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] text-white flex items-center justify-center gap-2 text-sm font-bold hover:brightness-110 transition disabled:opacity-50 disabled:grayscale"
           >
             <CheckCircle2 size={16} /> ¡Completado!
           </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
