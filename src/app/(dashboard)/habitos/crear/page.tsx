'use client';

import React, { useState } from 'react';
import { ArrowLeft, Bell, Search, Activity, Droplets, BookOpen, Dumbbell, Moon, Sun, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function CrearHabitoPage() {
  const [habitName, setHabitName] = useState('Caminar');
  const [selectedIcon, setSelectedIcon] = useState('activity');
  const [selectedColor, setSelectedColor] = useState('bg-[#A2AAFD]');
  const [frequency, setFrequency] = useState('Todos los días');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['Mañana']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeToggle = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleCreateHabit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert(`¡Hábito "${habitName}" creado con éxito!`);
      setIsSubmitting(false);
      // In a real app we'd router.push('/habitos') here
    }, 800);
  };

  // Helper arrays
  const icons = [
    { id: 'activity', Cmp: Activity },
    { id: 'droplets', Cmp: Droplets },
    { id: 'book', Cmp: BookOpen },
    { id: 'dumbbell', Cmp: Dumbbell },
    { id: 'moon', Cmp: Moon },
    { id: 'sun', Cmp: Sun },
  ];

  const colors = [
    'bg-[#A2AAFD]', 'bg-[#FF99C2]', 'bg-[#99BBFF]', 'bg-[#FF8888]',
    'bg-[#88FFBB]', 'bg-[#FFDD88]'
  ];

  const SelectedIconComponent = icons.find(i => i.id === selectedIcon)?.Cmp || Activity;

  return (
    <div className="min-h-screen w-full bg-[#0A0718] text-slate-200 flex justify-center">
      <div className="flex flex-col lg:flex-row w-full max-w-[1200px]">
        
        {/* LEFT PANEL: Form */}
        <div className="flex-1 lg:max-w-[700px] border-r border-slate-800 p-6 lg:p-12 overflow-y-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link 
              href="/habitos" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-2xl font-bold font-serif tracking-wide text-white">Crear hábito personalizado</h1>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Search size={20} className="hover:text-white cursor-pointer" />
            <div className="relative">
              <Bell size={20} className="hover:text-white cursor-pointer" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full" />
            </div>
          </div>
        </header>

        {/* 01 INFORMACIÓN BÁSICA */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded bg-[#1A183A] text-indigo-400 flex items-center justify-center text-xs font-bold">
              01
            </div>
            <h2 className="text-sm font-bold tracking-widest text-[#9DA8FF] uppercase">Información Básica</h2>
          </div>
          
          <label className="block text-sm text-slate-400 mb-3">¿Cómo se llama tu nuevo hábito?</label>
          <input 
            type="text" 
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="w-full bg-[#13112E] text-white border border-transparent focus:border-[#9DA8FF] rounded-2xl px-6 py-4 outline-none transition font-medium"
            placeholder="Ej. Caminar"
          />
        </section>

        {/* 02 IDENTIDAD VISUAL */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded bg-[#1A183A] text-indigo-400 flex items-center justify-center text-xs font-bold">
              02
            </div>
            <h2 className="text-sm font-bold tracking-widest text-[#9DA8FF] uppercase">Identidad Visual</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Icon */}
            <div className="bg-[#13112E] p-6 rounded-[2rem]">
              <p className="text-xs text-slate-400 mb-4 font-medium">Selecciona un icono</p>
              <div className="grid grid-cols-4 gap-3">
                {icons.map(({ id, Cmp }) => (
                  <button 
                    key={id}
                    onClick={() => setSelectedIcon(id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedIcon === id ? 'bg-[#A2AAFD] text-slate-900 shadow-[0_0_15px_rgba(162,170,253,0.3)]' : 'bg-[#1A183A] text-slate-400 hover:text-white'}`}
                  >
                    <Cmp size={20} />
                  </button>
                ))}
                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1A183A] text-slate-400 hover:text-white">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Select Color */}
            <div className="bg-[#13112E] p-6 rounded-[2rem]">
              <p className="text-xs text-slate-400 mb-4 font-medium">Personaliza el color</p>
              <div className="grid grid-cols-4 gap-3 w-max">
                {colors.map((c, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full transition-transform ${c} ${selectedColor === c ? 'scale-110 ring-4 ring-[#1A183A]' : 'opacity-80 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 03 META & FRECUENCIA */}
        <section className="mb-10">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded bg-[#1A183A] text-indigo-400 flex items-center justify-center text-xs font-bold">
              03
            </div>
            <h2 className="text-sm font-bold tracking-widest text-[#9DA8FF] uppercase">Meta & Frecuencia</h2>
          </div>

          <div className="bg-[#13112E] p-6 rounded-[2rem] space-y-6">
            <div className="flex justify-between items-center bg-[#1A183A] rounded-[2rem] p-4">
              <div className="pl-2">
                <p className="text-sm font-semibold text-white">Repetir hábito</p>
                <p className="text-xs text-slate-400">¿Con qué frecuencia lo realizarás?</p>
              </div>
              <div className="flex bg-[#13112E] rounded-full p-1 border border-[#2A2755]">
                <button 
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition ${frequency === 'Todos los días' ? 'bg-[#9DA8FF] text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setFrequency('Todos los días')}
                >
                  Todos los días
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition ${frequency === 'Días selectos' ? 'bg-[#9DA8FF] text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
                  onClick={() => setFrequency('Días selectos')}
                >
                  Días selectos
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#1A183A] rounded-[2rem] p-4">
              <div className="pl-2">
                <p className="text-sm font-semibold text-white">Meta diaria</p>
                <p className="text-xs text-slate-400">Número de veces por jornada</p>
              </div>
              <div className="flex items-center gap-4 bg-[#13112E] rounded-full px-2 py-1 pr-4 border border-[#2A2755]">
                <button 
                  onClick={() => setTimesPerDay(Math.max(1, timesPerDay - 1))}
                  className="w-8 h-8 rounded-full bg-[#1A183A] flex items-center justify-center text-slate-400 hover:text-white"
                >
                  –
                </button>
                <span className="text-lg font-bold text-white w-4 text-center">{timesPerDay}</span>
                <button 
                  onClick={() => setTimesPerDay(timesPerDay + 1)}
                  className="w-8 h-8 rounded-full bg-[#1A183A] flex items-center justify-center text-slate-400 hover:text-white"
                >
                  +
                </button>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider ml-2">VEZ AL DÍA</span>
              </div>
            </div>
          </div>
        </section>

        {/* 04 RECORDATORIOS */}
        <section className="mb-10 lg:mb-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded bg-[#1A183A] text-indigo-400 flex items-center justify-center text-xs font-bold">
              04
            </div>
            <h2 className="text-sm font-bold tracking-widest text-[#9DA8FF] uppercase">Recordatorios</h2>
          </div>

          <div className="bg-[#13112E] p-6 rounded-[2rem]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2A1D3A] text-[#FF99C2] flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Notificaciones activas</p>
                  <p className="text-xs text-slate-400">Te avisaremos para que no lo olvides</p>
                </div>
              </div>
              {/* Toggle switch visual */}
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${notificationsEnabled ? 'bg-[#9DA8FF]' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {/* Mañana */}
              <div 
                onClick={() => handleTimeToggle('Mañana')}
                className={`rounded-[1.5rem] p-3 text-center cursor-pointer transition ${selectedTimes.includes('Mañana') ? 'border border-[#9DA8FF] bg-[#1A183A] shadow-[0_0_15px_rgba(157,168,255,0.1)]' : 'bg-[#1A183A] opacity-50 hover:opacity-100'}`}
              >
                <p className={`text-[10px] tracking-widest uppercase mb-1 ${selectedTimes.includes('Mañana') ? 'text-[#9DA8FF]' : 'text-slate-400'}`}>Mañana</p>
                <p className="text-xl font-bold text-white">08:00</p>
              </div>
              {/* Tarde */}
              <div 
                onClick={() => handleTimeToggle('Tarde')}
                className={`rounded-[1.5rem] p-3 text-center cursor-pointer transition ${selectedTimes.includes('Tarde') ? 'border border-[#9DA8FF] bg-[#1A183A] shadow-[0_0_15px_rgba(157,168,255,0.1)]' : 'bg-[#1A183A] opacity-50 hover:opacity-100'}`}
              >
                <p className={`text-[10px] tracking-widest uppercase mb-1 ${selectedTimes.includes('Tarde') ? 'text-[#9DA8FF]' : 'text-slate-400'}`}>Tarde</p>
                <p className="text-xl font-bold text-white">14:30</p>
              </div>
              {/* Noche */}
               <div 
                onClick={() => handleTimeToggle('Noche')}
                className={`rounded-[1.5rem] p-3 text-center cursor-pointer transition ${selectedTimes.includes('Noche') ? 'border border-[#9DA8FF] bg-[#1A183A] shadow-[0_0_15px_rgba(157,168,255,0.1)]' : 'bg-[#1A183A] opacity-50 hover:opacity-100'}`}
              >
                <p className={`text-[10px] tracking-widest uppercase mb-1 ${selectedTimes.includes('Noche') ? 'text-[#9DA8FF]' : 'text-slate-400'}`}>Noche</p>
                <p className="text-xl font-bold text-white">20:00</p>
              </div>
              {/* Nuevo */}
              <div className="bg-[#1A183A] rounded-[1.5rem] p-3 text-center border border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition">
                <Plus size={16} className="text-slate-400 mb-1" />
                <p className="text-[10px] tracking-widest text-slate-400 uppercase">Nuevo</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="flex-1 bg-[#0A0718] p-6 lg:p-12 flex flex-col justify-center sticky top-0 h-screen hidden lg:flex">
        
        {/* Habit Card Preview */}
        <div className="bg-white rounded-[32px] p-8 shadow-2xl relative mb-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex justify-between items-start mb-12">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-colors ${selectedColor}`}>
              <SelectedIconComponent size={24} />
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-bold mb-1">Progreso</p>
              <p className="text-2xl font-black text-slate-900">0%</p>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">{habitName || 'Nuevo Hábito'}</h3>
          <p className="text-sm text-slate-500 mb-8">
            {timesPerDay} vez al día, {frequency.toLowerCase()}
          </p>

          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src="https://i.pravatar.cc/100?img=1" alt="friend" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src="https://i.pravatar.cc/100?img=5" alt="friend" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#1A183A] text-[10px] flex items-center justify-center font-bold text-white">
                  +12
                </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">comenzando hoy</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-[#13112E] rounded-[32px] p-8 text-center shadow-xl">
          <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
            Al crear este hábito, se añadirá automáticamente a tu tablero principal y podrás empezar a registrarlo desde hoy mismo.
          </p>
          <button 
            onClick={handleCreateHabit}
            disabled={isSubmitting}
            className="w-full bg-[#9DA8FF] hover:bg-indigo-300 text-slate-950 font-bold py-4 rounded-full mb-4 shadow-[0_0_20px_rgba(157,168,255,0.3)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Creando...' : 'Agregar hábito'}
          </button>
          <button className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-slate-300 transition-colors">
            Guardar como borrador
          </button>
        </div>

        </div>
      </div>
    </div>
  );
}
