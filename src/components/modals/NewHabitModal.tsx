'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, Activity, Plus, Ban, Smile } from 'lucide-react';

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewHabitModal({ isOpen, onClose }: NewHabitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-[#13112E] w-full max-w-[500px] rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Nuevo Buen Hábito
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Dejar mal hábito */}
          <div className="bg-[#1A183A] border border-transparent rounded-2xl p-4 flex flex-col items-center cursor-pointer hover:bg-[#201D45] transition text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800 mb-2 flex items-center justify-center text-red-400">
               <Ban size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-300">Dejar mal hábito</span>
          </div>

          {/* Nuevo buen hábito */}
          <div className="bg-[#201D45] border border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center cursor-pointer relative shadow-[0_0_15px_rgba(99,102,241,0.2)] text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-400 mb-2 flex items-center justify-center text-white">
               <Sparkles size={24} />
            </div>
            <span className="text-xs font-semibold text-white">Nuevo buen hábito</span>
          </div>

          {/* Estado de ánimo */}
          <div className="bg-[#1A183A] border border-transparent rounded-2xl p-4 flex flex-col items-center cursor-pointer hover:bg-[#201D45] transition text-center">
            <div className="w-12 h-12 rounded-xl bg-orange-900/40 mb-2 flex items-center justify-center text-orange-400">
               <Smile size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-300">Estado de ánimo</span>
          </div>
        </div>

        {/* Popular Habits */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Hábitos Populares</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300">Ver todo</button>
          </div>
          
          <div className="space-y-3">
            {/* Caminar */}
            <Link href="/habitos/crear" onClick={onClose} className="bg-[#E6F0FF] rounded-full p-3 pr-4 flex items-center gap-3 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition block">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                🏃
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm">Caminar</p>
                <p className="text-slate-500 text-[10px]">1500 personas hoy</p>
              </div>
              <button className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50">
                <Plus size={14} />
              </button>
            </Link>

            {/* Nadar */}
            <Link href="/habitos/crear" onClick={onClose} className="bg-[#E6FFE6] rounded-full p-3 pr-4 flex items-center gap-3 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition block mt-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                🏊
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm">Nadar</p>
                <p className="text-slate-500 text-[10px]">800 personas hoy</p>
              </div>
              <button className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50">
                <Plus size={14} />
              </button>
            </Link>

            {/* Leer */}
            <Link href="/habitos/crear" onClick={onClose} className="bg-[#FFF0E6] rounded-full p-3 pr-4 flex items-center gap-3 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition block mt-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                📚
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm">Leer</p>
                <p className="text-slate-500 text-[10px]">3200 personas hoy</p>
              </div>
              <button className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50">
                <Plus size={14} />
              </button>
            </Link>
          </div>
        </div>

        {/* Custom Habit Button */}
        <Link 
          href="/habitos/crear" 
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full border border-dashed border-slate-600 text-slate-300 font-semibold text-sm hover:border-indigo-400 hover:text-indigo-300 transition-colors bg-slate-800/30 hover:bg-slate-800/60"
        >
          <Plus size={18} />
          Crear hábito personalizado
        </Link>
      </div>
    </div>
  );
}
