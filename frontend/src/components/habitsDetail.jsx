/**
 * HabitDetail.jsx
 * Componente de detalle: muestra el modal con imagen, info, video y PDF.
 * Principio SOLID - S: Single Responsibility
 */
export default function HabitDetail({ habit, imageUrl, videoUrl, pdfUrl, hasError, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}>

        {hasError ? (
          <div className="w-full h-48 flex items-center justify-center text-6xl bg-orange-50 rounded-xl mb-4">🌱</div>
        ) : (
          <img src={imageUrl} alt={habit.name} className="w-full h-48 object-cover rounded-xl mb-4" />
        )}

        <h2 className="text-2xl font-bold text-orange-700">{habit.name}</h2>
        <p className="text-gray-500 mt-2">{habit.desc}</p>

        <div className="flex justify-between items-start gap-2 mt-3">
          <p className="font-syne text-sm font-bold text-orange-500 flex flex-col border-2 border-orange-600 rounded-xl py-3 pl-3 w-1/2">
            <span className="text-gray-400 font-normal text-sm">Beneficio:</span>
            {habit.beneficio}
          </p>
          <p className="font-syne text-sm font-bold text-orange-500 flex flex-col border-2 border-orange-600 rounded-xl py-3 pl-3 w-1/2">
            <span className="text-gray-400 font-normal text-sm">Meta:</span>
            {habit.meta}
          </p>
        </div>

        <p className="text-xs text-gray-500 bg-orange-100 p-3 rounded-xl mt-3">
          <span className="font-bold">Consejo:</span> Comienza con versiones micro de este hábito durante los primeros 7 días para que tu cerebro no lo rechace.
        </p>

        <video controls className="w-full rounded-xl mt-4" style={{ background: '#0f0a06' }}>
          <source src={videoUrl} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        <div className="flex justify-between mt-4">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Descargar PDF 📄
          </a>
          <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            Cerrar ✕
          </button>
        </div>
      </div>
    </div>
  );
}