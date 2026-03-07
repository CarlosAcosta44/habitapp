import { habits, getImageUrl } from './services/habitsService';

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
        <h2 className="text-xl font-bold text-green-700">{habit.name}</h2>
        <p className="text-gray-500 mt-1 text-sm">{habit.desc}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-full min-h-screen bg-green-50 p-20">
      <header className="text-white py-8 text-center">
        <h1 className="text-black font-extrabold font-syne text-6xl">10 Hábitos que <span className='text-orange-500'>Transforman</span> tu Vida</h1>
        <p className="mt-2 text-gray-600">Pequeñas acciones consistentes producen resultados extraordinarios. Explora cada hábito.</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm">
        HabitApp © 2026 - AWS Academy
      </footer>
    </div>
  );
}

export default App;