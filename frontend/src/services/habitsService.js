export const STORAGE_URL= import.meta.env.VITE_STORAGE_URL;


export function getImageUrl(file){
    return `${STORAGE_URL}/imagenes/${file}`;
}

export function getVideoUrl(file){
    return `${STORAGE_URL}/videos/${file}`;
}

export function getPdfUrl(file){
    return `${STORAGE_URL}/pdfs/${file}`;
}


export const habits = [
    { id: 1, file: "correr.jpg", name: "Ejercicio", desc: "30 minutos de actividad física al día" },
    { id: 2, file: "agua.jpg", name: "Hidratación", desc: "Toma 8 vasos de agua al día" },
    { id: 3, file: "sueno.jpg", name: "Sueño", desc: "Duerme entre 7 y 8 horas diarias" },
    { id: 4, file: "meditacion.jpg", name: "Meditación", desc: "5 minutos de mindfulness cada mañana" },
    { id: 5, file: "frutas.jpg", name: "Frutas", desc: "Come al menos 3 porciones de fruta al día" },
    { id: 6, file: "lectura.jpg", name: "Lectura", desc: "Lee 20 minutos al día" },
    { id: 7, file: "caminar.jpg", name: "Caminar", desc: "Camina al menos 10,000 pasos diarios" },
    { id: 8, file: "vitaminas.jpg", name: "Vitaminas", desc: "Toma tus vitaminas cada mañana" },
    { id: 9, file: "respiracion.jpg", name: "Respiración", desc: "Practica respiración profunda 5 minutos" },
    { id: 10, file: "gratitud.jpg", name: "Gratitud", desc: "Escribe 3 cosas por las que estás agradecido" },
];
