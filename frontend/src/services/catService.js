export const STORAGE_URL= import.meta.env.VITE_STORAGE_URL;

/* 
Contruye la URL completa de imagen para una raza
*/

export function getImageUrl(file){
    return `${STORAGE_URL}/imagenes/${file}`;
}

export function getVideoUrl(file){
    return `${STORAGE_URL}/videos/${file}`;
}

export function getPdfUrl(file){
    return `${STORAGE_URL}/pdfs/${file}`;
}


export async function getHabits() {
  return Promise.resolve([
    {
      file: "imagenes/CORRER.jpg",
      name: "Ejercicio",
      desc: "30 minutos de actividad física al día",
    },
    {
      file: "imagenes/agua.jpg",
      name: "Hidratación",
      desc: "Toma 8 vasos de agua al día",
    },
    {
      file: "imagenes/meditacion.jpg",
      name: "Meditación",
      desc: "5 minutos de mindfulness cada mañana",
    },
  ]);
}
