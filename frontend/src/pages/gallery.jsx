/**
 * Gallery.jsx
 * Página principal: orquesta la galería de hábitos.
 * Consume el hook useHabits y renderiza HabitCard y HabitDetail.
 */
import HabitCard from '../components/habitsCard';
import HabitDetail from '../components/habitsDetail';
import { useHabits } from '../hooks/useHabits';

export default function Gallery() {
  const {
    habitList,
    loading,
    liked,
    errors,
    selected,
    likedCount,
    toggleLike,
    selectHabit,
    closeHabit,
    registerError,
    getImageUrl,
    getVideoUrl,
    getPdfUrl,
  } = useHabits();

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-xl">
        Cargando hábitos...
      </div>
    );
  }

  return (
    <>
      {likedCount > 0 && (
        <div className="text-center py-1 text-orange-600 font-semibold text-sm">
          ❤️ Has marcado {likedCount} hábito{likedCount > 1 ? 's' : ''} como favorito{likedCount > 1 ? 's' : ''}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {habitList.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              imageUrl={getImageUrl(habit.file)}
              liked={!!liked[habit.name]}
              hasError={!!errors[habit.name]}
              onSelect={selectHabit}
              onToggleLike={() => toggleLike(habit.name)}
              onImageError={() => registerError(habit.name)}
            />
          ))}
        </div>
      </main>

      {selected && (
        <HabitDetail
          habit={selected}
          imageUrl={getImageUrl(selected.file)}
          videoUrl={getVideoUrl("video.mp4")}
          pdfUrl={getPdfUrl(selected.pdf)}
          hasError={!!errors[selected.name]}
          onClose={closeHabit}
        />
      )}
    </>
  );
}