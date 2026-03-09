/**
 * HabitCard.jsx
 * Componente de presentacion: muestra la tarjeta de un hábito.
 * Principio SOLID - S: Single Responsibility / O: Open-Closed
 */
export default function HabitCard({ habit, imageUrl, liked, hasError, onSelect, onToggleLike, onImageError }) {
  return (
    <div className="border-b-4 border-orange-400 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect(habit)}>

      <div className="relative">
        {hasError ? (
          <div className="w-full h-48 flex flex-col items-center justify-center bg-orange-50 text-4xl">
            <span className="text-sm text-gray-400 mt-2">Imagen no encontrada</span>
          </div>
        ) : (
          <img src={imageUrl} alt={habit.name} className="w-full h-48 object-cover" onError={onImageError} />
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mt-2">
            <h2 className="text-base font-bold text-orange-600 font-syne">{habit.name}</h2>
            <button
                className="text-xs bg-gray-400 p-1"
                onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
                aria-label={liked ? "Quitar favorito" : "Agregar favorito"}
                >
                {liked ? "💚" : "🤍"}
            </button>
        </div>
        <p className="text-gray-400 mt-1 text-sm">{habit.desc}</p>
        <div className="flex justify-between items-center mt-2">
            <p className="text-xs font-semibold text-orange-400 bg-orange-100 rounded-xl py-1 px-2">{habit.meta}</p>
            <p className="font-bold text-orange-400 text-sm">Ver más →</p>
        </div>
      </div>
    </div>
  );
}