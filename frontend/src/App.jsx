import { useState } from 'react';
import { habits, getImageUrl, getPdfUrl } from './services/habitsService';


function Modal({ habit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <img src={getImageUrl(habit.file)} alt={habit.name} className="w-full h-48 object-cover rounded-xl mb-4" />
        <h2 className="text-2xl font-bold text-green-700">{habit.name}</h2>
        <p className="text-gray-500 mt-2">{habit.desc}</p>
        <div className="flex justify-between items-start gap-2 mt-2">
          <p className="font-syne text-sm font-bold text-green-500 flex flex-col p-2 border-2 border-green-600 rounded-xl py-3 pl-3 w-1/2">
            <span className='text-gray-400 font-normal text-sm'>Beneficio:</span> 
            {habit.beneficio}
          </p>
          <p className="font-syne text-sm font-bold text-green-500 flex flex-col p-2 border-2 border-green-600 rounded-xl py-3 pl-3 w-1/2">
            <span className='text-gray-400 font-normal text-sm'>Meta:</span> 
            {habit.meta}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1 bg-green-100 p-3 rounded-xl mt-3"><span className='font-bold'>Consejo:</span> Comienza con versiones micro de este hábito durante los primeros 7 días para que tu cerebro no lo rechace.</p>
        <div className="flex justify-between mt-6">
          <a
            href={getPdfUrl(habit.pdf)}
            target="_blank"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Descargar PDF 📄
          </a>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cerrar ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function HabitCard({ habit }) {
  return (
    <div className="border-b-4 border-green-500 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={getImageUrl(habit.file)}
        alt={habit.name}
        className="w-full h-48 object-cover"
        onError={(e) => e.target.src = 'https://placehold.co/400x300?text=Habito'}
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-green-700 font-syne">{habit.name}</h2>
        <p className="text-gray-500 mt-1 text-sm">{habit.desc}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs font-semibold text-green-500 mt-1 text-sm bg-green-100 rounded-xl py-1 px-2">{habit.meta}</p>
          <p className="font-bold text-green-500 mt-1 text-sm ">Ver más →</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedHabit, setSelectedHabit] = useState(null);
  return (
    <div className="w-full min-h-screen bg-green-50 p-20">
      
      {selectedHabit && (
        <Modal habit={selectedHabit} onClose={() => setSelectedHabit(null)} />
      )}

      <header className="text-white py-8 text-center">
        <h1 className="text-black font-extrabold font-syne text-6xl">10 Hábitos que <span className='text-orange-500'>Transforman</span> tu Vida</h1>
        <p className="mt-2 text-gray-600">Pequeñas acciones consistentes producen resultados extraordinarios. Explora cada hábito.</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {habits.map((habit) => (
            
            <div key={habit.id} onClick={() => setSelectedHabit(habit)} className="cursor-pointer">
              <HabitCard habit={habit} />
            </div>
          ))}
        </div>
      </main>

        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold font-syne text-center text-black mb-2">
            Aprende a <span className="text-green-500">construir</span> hábitos
          </h2>
          <p className="text-center text-gray-500 mb-6">Mira este video y descubre cómo pequeños cambios transforman tu vida</p>
          
          <video
            className="w-full rounded-2xl shadow-xl"
            controls
            src={getVideoUrl("video.mp4")}
          >
            Tu navegador no soporta videos
          </video>
        </section>

      <footer className="text-center py-6 text-gray-400 text-sm">
        HabitApp © 2026 - AWS Academy
      </footer>
    </div>
  );
}

export default App;