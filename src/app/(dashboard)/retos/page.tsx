'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, Droplet, Footprints, Flower2, Wind, Check, Plus, Medal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DetalleRetoPage() {
  const [hasJoined, setHasJoined] = useState(false);
  const [tasks, setTasks] = useState({
    water: false,
    walk: false,
    plants: false,
    meditate: false
  });

  const toggleTask = (key: keyof typeof tasks) => {
    setTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(tasks).filter(Boolean).length;

  return (
    <div className="min-h-screen w-full bg-[#0A0718] text-slate-200 p-6 lg:p-12">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold font-serif text-[#9DA8FF]">Detalle del Reto</h1>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <Search size={20} className="hover:text-white cursor-pointer transition" />
          <div className="relative">
            <Bell size={20} className="hover:text-white cursor-pointer transition" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 overflow-hidden cursor-pointer hover:border-slate-500 transition">
             {/* Using Pravatar for demo */}
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-[#6972FF] to-[#8089FF] rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[280px]">
          {/* Background decorative circles */}
          <div className="absolute -right-20 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute right-20 -bottom-20 w-60 h-60 bg-indigo-900/20 rounded-full blur-2xl flex items-center justify-center mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between w-full lg:w-2/3">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest backdrop-blur-md uppercase shadow-sm">
                Reto Comunitario
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8 font-serif tracking-tight drop-shadow-md">
                ¡Mejores<br />corredores!
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://i.pravatar.cc/100?img=5" alt="user" className="w-10 h-10 rounded-full border-2 border-[#6972FF]" />
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://i.pravatar.cc/100?img=12" alt="user" className="w-10 h-10 rounded-full border-2 border-[#6972FF]" />
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://i.pravatar.cc/100?img=9" alt="user" className="w-10 h-10 rounded-full border-2 border-[#6972FF]" />
                <div className="w-10 h-10 rounded-full border-2 border-[#6972FF] bg-white text-indigo-600 text-xs flex items-center justify-center font-bold">
                  +9
                </div>
              </div>
              <p className="text-sm text-white/90 leading-tight font-medium max-w-[200px]">
                Únete a 142 corredores esta semana
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-20">
            <button 
              onClick={() => setHasJoined(true)}
              disabled={hasJoined}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-transform transform active:scale-95 shadow-xl ${hasJoined ? 'bg-green-400 text-slate-900 shadow-green-400/20' : 'bg-white text-slate-900 hover:bg-slate-50 shadow-white/20'}`}
            >
              {hasJoined ? '¡Estás dentro!' : 'Unirse al reto'}
            </button>
          </div>
          
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
            <Footprints size={200} className="text-white" />
          </div>
        </div>

        {/* BOTTOM CONTENT */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Info */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Information Card */}
            <div className="bg-[#181636] rounded-[2rem] p-8 shadow-xl border border-slate-800">
              <h3 className="text-xl font-bold text-[#9DA8FF] mb-6">Información</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Este reto está diseñado para aquellos que buscan superar sus límites. No se trata solo de velocidad, sino de constancia y bienestar integral.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-slate-300 leading-snug">Completa las 4 tareas diarias.</span>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-slate-300 leading-snug">Mantén una racha de 7 días.</span>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-slate-300 leading-snug">Gana la insignia "Flash Comunitario".</span>
                </li>
              </ul>
            </div>

            {/* Rewards Card */}
            <div className="bg-[#181636] rounded-[2rem] p-8 shadow-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Próximos Premios</h3>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shadow-inner">
                  <Medal size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Insignia Elite</h4>
                  <p className="text-xs text-slate-400">Nivel de prestigio Platino</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Tasks */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold font-serif text-white">Tareas del Reto</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{completedCount}/4 COMPLETADAS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* TASK: Water */}
              <div className="bg-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E6F0FF] text-blue-500 flex items-center justify-center shadow-inner">
                    <Droplet size={24} />
                  </div>
                  <div className="flex -space-x-2">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.pravatar.cc/100?img=3" alt="user" className="w-7 h-7 rounded-full border-2 border-white" />
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.pravatar.cc/100?img=8" alt="user" className="w-7 h-7 rounded-full border-2 border-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Beber agua</h3>
                <p className="text-xs italic text-slate-400 mb-6">2000 ML Diarios</p>
                
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className={`h-full bg-blue-400 transition-all duration-700 ${tasks.water ? 'w-full' : 'w-[45%]'}`}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>900 ML</span>
                  <span>{tasks.water ? '100%' : '45%'}</span>
                </div>
                <div onClick={() => toggleTask('water')} className="absolute inset-0 z-10"></div>
              </div>

              {/* TASK: Walk */}
              <div className="bg-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shadow-inner">
                    <Footprints size={24} />
                  </div>
                  <div className="flex -space-x-2">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.pravatar.cc/100?img=16" alt="user" className="w-7 h-7 rounded-full border-2 border-white" />
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-700">
                      +5
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Correr</h3>
                <p className="text-xs italic text-slate-400 mb-6">10000 Pasos Diarios</p>
                
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className={`h-full bg-pink-400 transition-all duration-700 ${tasks.walk ? 'w-full' : 'w-[82%]'}`}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>8200 STEPS</span>
                  <span>{tasks.walk ? '100%' : '82%'}</span>
                </div>
                <div onClick={() => toggleTask('walk')} className="absolute inset-0 z-10"></div>
              </div>

              {/* TASK: Water Plants */}
               <div className="bg-white rounded-[2rem] p-6 shadow-xl flex flex-col justify-between custom-hover cursor-pointer h-[160px] relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center shadow-inner">
                    <Flower2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">Tomar el sol</h3>
                    <p className="text-xs italic text-slate-400">4 veces al día</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleTask('plants')}
                  className={`absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center pointer-events-auto transition-all ${tasks.plants ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  {tasks.plants ? <Check size={18} /> : <Plus size={18} />}
                </button>
              </div>

               {/* TASK: Meditate */}
               <div className="bg-white rounded-[2rem] p-6 shadow-xl flex flex-col justify-between custom-hover cursor-pointer h-[160px] relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-400 flex items-center justify-center shadow-inner">
                    <Wind size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">Meditar</h3>
                    <p className="text-xs italic text-slate-400">30/30 MIN</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleTask('meditate')}
                  className={`absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center pointer-events-auto transition-all ${tasks.meditate ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                   {tasks.meditate ? <Check size={18} /> : <Plus size={18} />}
                </button>
              </div>            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
