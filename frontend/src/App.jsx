import Gallery from './pages/gallery.jsx';

function App() {
  return (
    <div className="w-full min-h-screen bg-orange-50">

      <header className="py-8 text-center p-20 pb-0">
        <h1 className="text-black font-extrabold font-syne text-6xl">
          10 Hábitos que <span className="text-orange-500">Transforman</span> tu Vida
        </h1>
        <p className="mt-2 text-gray-600">
          Pequeñas acciones consistentes producen resultados extraordinarios. Explora cada hábito.
        </p>
      </header>

      <Gallery />

      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold font-syne text-center text-black mb-2">
          Aprende a <span className="text-orange-500">construir</span> hábitos
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Mira este video y descubre cómo pequeños cambios transforman tu vida
        </p>
        <video className="w-full rounded-2xl shadow-xl" controls
          src={`${import.meta.env.VITE_STORAGE_URL}/videos/video.mp4`}>
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