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
    { id: 1, file: "ejercicio.jpg", name: "Ejercicio", desc: "30 minutos de movimiento diario mejoran el estado de ánimo y la longevidad.", meta: "30 min/día", beneficio: "Vitalidad", pdf: "ejercicio.pdf" },
    { id: 2, file: "agua.jpg", name: "Hidratación", desc: "Tomar 2 litros de agua al día mejora la concentración y la salud en general.", meta: "Todo el día", beneficio: "Piel y mente clara", pdf: "agua.pdf"},
    { id: 3, file: "sueno.jpg", name: "Sueño", desc: "Dormir 7-8 horas con un horario fijo restaura el cuerpo y consolida la memoria.", meta: "7-8 horas", beneficio: "Recuperación total", pdf: "sueno.pdf"},
    { id: 4, file: "meditacion.jpg", name: "Meditación", desc: "10 minutos de meditación al día reducen el estrés y mejoran el enfoque mental.", meta: "10 min/día", beneficio: "Paz interior", pdf: "meditacion.pdf" },
    { id: 5, file: "alimentacion.jpg", name: "Alimentación", desc: "Comer sin distracciones y masticar bien mejora la digestión y evita el exceso.", meta: "Cada comida", beneficio: "Digestión óptima", pdf: "alimentacion.pdf" },
    { id: 6, file: "lectura.jpg", name: "Lectura", desc: "20 páginas al día equivalen a 12 libros al año. El conocimiento compuesto es poderoso.", meta: "20 páginas", beneficio: "Vocabulario/sabiduría", pdf: "lectura.pdf" },
    { id: 7, file: "despertar.jpg", name: "Despertar temprano", desc: "Levantarse antes de las 6 AM activa tu metabolismo y te da ventaja sobre el día.", meta: "5:30 AM", beneficio: "Más productividad", pdf: "despertar.pdf" },
    { id: 8, file: "pantallas.jpg", name: "Descanso pantallas", desc: "1 hora sin pantallas antes de dormir mejora el sueño y la calidad de atención.", meta: "1h antes de dormir", beneficio: "Descanso profundo", pdf: "pantallas.pdf" },
    { id: 9, file: "respiracion.jpg", name: "Respiración", desc: "Dedicar 5 minutos al día a respirar profundo reduce el estrés y activa la calma mental.", meta: "5 minutos", beneficio: "Calma y enfoque", pdf: "respiracion.pdf" },
    { id: 10, file: "diario.jpg", name: "Diario personal", desc: "Escribir tus pensamientos cada mañana o noche aclara la mente y reduce la ansiedad.", meta: "10 min/día", beneficio: "Claridad mental", pdf: "diario.pdf" },
];
