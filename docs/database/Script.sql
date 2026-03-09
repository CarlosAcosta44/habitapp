CREATE TABLE Categorias (
    idCategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(45),
    descripcion VARCHAR(200)
);

CREATE TABLE Habitos (
    idHabito SERIAL PRIMARY KEY,
    nombre VARCHAR(45),
    descripcion VARCHAR(200),
    categoria VARCHAR(45),
    meta VARCHAR(100),
    puntos INT,
    idCategoria INT,
    FOREIGN KEY (idCategoria) REFERENCES Categorias(idCategoria)
);

CREATE TABLE DetallePlan (
    idDetalle SERIAL PRIMARY KEY,
    idHabito INT,
    duracionDias INT,
    frecuencia VARCHAR(45),
    nivelDificultad VARCHAR(20),
    consejo VARCHAR(200),
    FOREIGN KEY (idHabito) REFERENCES Habitos(idHabito)
);

CREATE TABLE Multimedia (
    idMultimedia SERIAL PRIMARY KEY,
    idHabito INT,
    tipoArchivo VARCHAR(20),
    urlS3 VARCHAR(500),
    nombreArchivo VARCHAR(100),
    fechaSubida DATE,
    FOREIGN KEY (idHabito) REFERENCES Habitos(idHabito)
);


INSERT INTO Categorias (nombre, descripcion) VALUES
('Salud Física', 'Hábitos relacionados con el ejercicio y el cuerpo'),
('Nutrición', 'Hábitos relacionados con la alimentación saludable'),
('Salud Mental', 'Hábitos para el bienestar mental y emocional'),
('Sueño', 'Hábitos para mejorar la calidad del sueño');

INSERT INTO Habitos (nombre, descripcion, categoria, meta, puntos, idCategoria) VALUES
('Correr', '30 minutos de carrera diaria al aire libre', 'Salud Física', '30 días', 10, 1),
('Tomar agua', 'Tomar 8 vasos de agua al día', 'Nutrición', 'Todo el día', 5, 2),
('Meditar', '10 minutos de meditación cada mañana', 'Salud Mental', '21 días', 8, 3),
('Dormir 8 horas', 'Mantener un horario fijo de sueño', 'Sueño', '30 días', 7, 4),
('Comer frutas', 'Consumir 3 porciones de fruta al día', 'Nutrición', '30 días', 6, 2);

INSERT INTO DetallePlan (idHabito, duracionDias, frecuencia, nivelDificultad, consejo) VALUES
(1, 30, 'Diario', 'Medio', 'Empieza con 10 minutos e incrementa gradualmente'),
(2, 30, 'Diario', 'Fácil', 'Lleva una botella de agua contigo siempre'),
(3, 21, 'Diario', 'Fácil', 'Busca un lugar tranquilo sin distracciones'),
(4, 30, 'Diario', 'Medio', 'Evita pantallas 1 hora antes de dormir'),
(5, 30, 'Diario', 'Fácil', 'Prepara las frutas desde la noche anterior');

INSERT INTO Multimedia (idHabito, tipoArchivo, urlS3, nombreArchivo, fechaSubida) VALUES
(1, 'imagen', 'https://habitapp-media-store.s3.amazonaws.com/imagenes/correr.jpg', 'correr.jpg', '2026-03-01'),
(2, 'imagen', 'https://habitapp-media-store.s3.amazonaws.com/imagenes/agua.jpg', 'agua.jpg', '2026-03-01'),
(3, 'video', 'https://habitapp-media-store.s3.amazonaws.com/videos/meditacion.mp4', 'meditacion.mp4', '2026-03-01'),
(4, 'pdf', 'https://habitapp-media-store.s3.amazonaws.com/pdfs/sueno.pdf', 'sueno.pdf', '2026-03-01'),
(5, 'imagen', 'https://habitapp-media-store.s3.amazonaws.com/imagenes/frutas.jpg', 'frutas.jpg', '2026-03-01');


SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT * FROM Habitos;