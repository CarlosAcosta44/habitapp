/*====================================================
  DATOS SINTÉTICOS - SistemaDeHabitos
  Orden de inserción respetando FK
====================================================*/

USE SistemaDeHabitos;
GO

/*====================================================
  1. gestion.Rankings  (20 registros)
====================================================*/
INSERT INTO gestion.Rankings (posicion, puntosTotales) VALUES
(1,  0),
(2,  9200),
(3,  8750),
(4,  8100),
(5,  0),
(6,  7100),
(7,  6500),
(8,  0),
(9,  5300),
(10, 4800),
(11, 4200),
(12, 3750),
(13, 3100),
(14, 2600),
(15, 2050),
(16, 0),
(17, 1100),
(18,  700),
(19,  350),
(20,  0);
GO

/*====================================================
  2. gestion.Roles  (5 registros)
====================================================*/
INSERT INTO gestion.Roles (nombreRol, descripcion, permisos) VALUES
('Administrador', 'Control total del sistema',               'CREATE,READ,UPDATE,DELETE'),
('Entrenador',    'Gestión de rutinas y seguimientos',       'CREATE,READ,UPDATE'),
('Usuario',       'Acceso básico a hábitos y comunidad',     'CREATE,READ');
GO

/*====================================================
  3. gestion.Usuarios  (20 registros)
====================================================*/
INSERT INTO gestion.Usuarios (nombre, apellido, correo, contraseña, genero, idRanking, idRol) VALUES
('Carlos',    'Acosta',   'carlos.acosta@mail.com',   'hashed_pw_01', 'Masculino', 1,  1),
('María',     'Torres',    'maria.torres@mail.com',     'hashed_pw_02', 'Femenino',  2,  3),
('Andrés',    'López',     'andres.lopez@mail.com',     'hashed_pw_03', 'Masculino', 3,  3),
('Valentina', 'García',    'vale.garcia@mail.com',      'hashed_pw_04', 'Femenino',  4,  3),
('Diego',     'Martínez',  'diego.martinez@mail.com',   'hashed_pw_05', 'Masculino', 5,  2),
('Sofía',     'Herrera',   'sofia.herrera@mail.com',    'hashed_pw_06', 'Femenino',  6,  3),
('Julián',    'Morales',   'julian.morales@mail.com',   'hashed_pw_07', 'Masculino', 7,  3),
('Camila',    'Jiménez',   'camila.jimenez@mail.com',   'hashed_pw_08', 'Femenino',  8,  2),
('Sebastián', 'Vargas',    'sebastian.vargas@mail.com', 'hashed_pw_09', 'Masculino', 9,  3),
('Daniela',   'Castillo',  'daniela.castillo@mail.com', 'hashed_pw_10', 'Femenino',  10, 3),
('Felipe',    'Ríos',      'felipe.rios@mail.com',      'hashed_pw_11', 'Masculino', 11, 3),
('Natalia',   'Sánchez',   'natalia.sanchez@mail.com',  'hashed_pw_12', 'Femenino',  12, 3),
('Mateo',     'Díaz',      'mateo.diaz@mail.com',       'hashed_pw_13', 'Masculino', 13, 3),
('Isabella',  'Cruz',      'isabella.cruz@mail.com',    'hashed_pw_14', 'Femenino',  14, 3),
('Tomás',     'Reyes',     'tomas.reyes@mail.com',      'hashed_pw_15', 'Masculino', 15, 3),
('Valeria',   'Gómez',     'valeria.gomez@mail.com',    'hashed_pw_16', 'Femenino',  16, 2),
('Nicolás',   'Peña',      'nicolas.pena@mail.com',     'hashed_pw_17', 'Masculino', 17, 3),
('Laura',     'Mendoza',   'laura.mendoza@mail.com',    'hashed_pw_18', 'Femenino',  18, 3),
('Ricardo',   'Flores',    'ricardo.flores@mail.com',   'hashed_pw_19', 'Masculino', 19, 3),
('Alejandra', 'Ruiz',      'alejandra.ruiz@mail.com',   'hashed_pw_20', 'Femenino',  20, 1);
GO

/*====================================================
  4. gestion.Administradores  (5 registros)
     Usuarios con idRol 1 o 2
====================================================*/
INSERT INTO gestion.Administradores (estadoAdmin, idUsuario) VALUES
('Activo',    1),   -- Carlos (Admin)
('Inactivo',  20);  -- Alejandra (admin)
GO

/*====================================================
  5. seguimiento.Entrenadores  (8 registros)
====================================================*/
INSERT INTO seguimiento.Entrenadores (especialidad) VALUES
('Fitness y musculación'),
('Yoga y meditación'),
('Nutrición deportiva'),
('Running y cardio'),
('Pilates y flexibilidad'),
('Hábitos de sueño'),
('Mindfulness y bienestar'),
('CrossFit funcional');
GO

/*====================================================
  6. comunidad.Foros  (10 registros)
====================================================*/
INSERT INTO comunidad.Foros (titulo, descripcion, fechaCreacion) VALUES
('Hábitos matutinos',        'Comparte tu rutina de la mañana y tips para empezar bien el día.',   '2024-01-10'),
('Nutrición y alimentación', 'Foro sobre dietas, recetas saludables y balance nutricional.',       '2024-01-15'),
('Ejercicio en casa',        'Rutinas y ejercicios que puedes hacer sin ir al gimnasio.',           '2024-01-20'),
('Meditación y mindfulness', 'Técnicas y experiencias de meditación para reducir el estrés.',      '2024-02-01'),
('Metas 2025',               'Comparte y realiza seguimiento de tus objetivos del año.',            '2024-12-28'),
('Sueño y descanso',         'Estrategias para mejorar la calidad del sueño.',                     '2024-02-10'),
('Retos semanales',          'Desafíos cortos para formar nuevos hábitos cada semana.',             '2024-03-01'),
('Lectura diaria',           'Club de lectura y hábito de leer al menos 20 minutos al día.',       '2024-03-15'),
('Hidratación',              'Consejos y recordatorios para beber suficiente agua cada día.',       '2024-04-01'),
('Productividad',            'Técnicas como Pomodoro, GTD y gestión del tiempo.',                   '2024-04-10');
GO

/*====================================================
  7. comunidad.Comentarios  (20 registros)
====================================================*/
INSERT INTO comunidad.Comentarios (contenido, fechaPublicacion, idForo) VALUES
('Yo siempre inicio con 10 minutos de estiramiento, ¡transforma el día!',             '2024-01-12', 1),
('El agua con limón en ayunas me ha dado mucha energía.',                              '2024-01-13', 1),
('Recomiendo el libro "Hábitos Atómicos" para empezar con el pie derecho.',            '2024-01-16', 2),
('Llevo un mes sin azúcar y me siento increíble.',                                     '2024-01-18', 2),
('Las sentadillas sin peso son perfectas para empezar en casa.',                       '2024-01-22', 3),
('Yo uso videos de YouTube de 20 minutos, muy efectivos.',                             '2024-01-25', 3),
('La respiración 4-7-8 me ayuda a dormir más rápido.',                                 '2024-02-03', 4),
('Solo 5 minutos de meditación al despertar cambia el humor del día.',                 '2024-02-05', 4),
('Mi meta 2025: correr un 5K. Voy en semana 3 del plan C25K.',                         '2024-12-30', 5),
('Yo quiero leer 24 libros este año, voy en el segundo.',                              '2025-01-05', 5),
('Dormir y despertar a la misma hora, incluso fines de semana, es clave.',             '2024-02-12', 6),
('Evitar pantallas 1 hora antes de dormir mejoró mucho mi descanso.',                  '2024-02-15', 6),
('Reto de esta semana: no revisar el celular antes de las 8am.',                       '2024-03-02', 7),
('Completé el reto de 30 días sin procesados. ¡Lo logré!',                             '2024-03-28', 7),
('Actualmente leyendo "El monje que vendió su Ferrari", muy recomendado.',             '2024-03-17', 8),
('20 páginas al día antes de dormir, llevo 3 meses sin faltarle.',                    '2024-03-20', 8),
('Puse alarmas cada 2 horas para recordarme beber agua, funciona.',                    '2024-04-03', 9),
('Una botella de 1L marcada con horas del día me ayuda a no olvidar.',                 '2024-04-06', 9),
('La técnica Pomodoro (25+5 min) duplicó mi concentración.',                           '2024-04-12', 10),
('Bloquear redes sociales con apps mientras trabajo fue un game changer.',             '2024-04-15', 10);
GO

/*====================================================
  8. comunidad.Articulos  (8 registros)
====================================================*/
INSERT INTO comunidad.Articulos (titulo, contenido, fechaPublicacion) VALUES
('Formar un hábito en 21 días',
 'Existe el mito popular de que un hábito se forma en 21 días. La realidad según estudios de la UCL es que el promedio es 66 días. En este artículo exploramos las fases de formación: iniciación, aprendizaje y automatización, y cómo acelerar cada etapa mediante señales, rutinas y recompensas.',
 '2024-01-20'),

('Hábitos de personas productivas',
 'Desde madrugar hasta la revisión nocturna del día, los profesionales de alto rendimiento comparten patrones comunes. Analizamos investigaciones sobre el bloque de tiempo profundo, la regla del 80/20 y la importancia del descanso activo.',
 '2024-02-05'),

('Nutrición para el rendimiento mental',
 'La relación entre dieta y función cognitiva es estrecha. Omega-3, antioxidantes y una glucosa estable son fundamentales. Describimos qué alimentos potencian la memoria, el foco y el estado de ánimo a largo plazo.',
 '2024-02-18'),

('Meditación para principiantes',
 'No necesitas horas ni silencio absoluto. Con 5 a 10 minutos diarios usando técnicas de respiración consciente y escaneo corporal, empezarás a notar cambios en tu nivel de estrés en menos de dos semanas.',
 '2024-03-01'),

('Sueño y hábitos: la base de todo',
 'Sin suficiente sueño de calidad, cualquier hábito positivo se vuelve insostenible. Explicamos la arquitectura del sueño, los ciclos REM y no-REM, y damos un protocolo de higiene del sueño en 7 pasos.',
 '2024-03-20'),

('El poder de los micro-hábitos',
 'James Clear popularizó la idea de mejorar un 1% cada día. Los micro-hábitos son acciones tan pequeñas que es casi imposible no hacerlas. Presentamos ejemplos reales y un método de expansión gradual para consolidarlos.',
 '2024-04-05'),

('Cómo mantenerse motivado',
 'La motivación fluctúa; los sistemas no. Analizamos la diferencia entre motivación intrínseca y extrínseca, el rol de la identidad en el cambio de comportamiento y técnicas para superar mesetas y recaídas.',
 '2024-04-22'),

('Apps útiles para tus hábitos',
 'Revisamos las aplicaciones más efectivas para seguimiento de hábitos, meditación guiada, planificación y control del tiempo de pantalla. Incluimos criterios para elegir la herramienta adecuada según tu perfil.',
 '2024-05-10');
GO


/*====================================================
  9. TABLAS INTERMEDIAS COMUNIDAD
====================================================*/

-- comunidad.Foro_Administrador
INSERT INTO comunidad.Foro_Administrador (idForo, idAdministrador) VALUES
(1, 1),(2, 1),(3, 2),(4, 2),(5, 1),
(6, 2),(7, 2),(8, 1),(9, 1),(10, 1);
GO

-- comunidad.Administrador_Articulo
INSERT INTO comunidad.Administrador_Articulo (idAdministrador, idArticulo) VALUES
(1, 1),(1, 2),(2, 3),(2, 4),(2, 5),
(1, 6),(2, 7),(1, 8);
GO

-- comunidad.Usuario_Foro
INSERT INTO comunidad.Usuario_Foro (idUsuario, idForo) VALUES
(2,  1),(3,  1),(6,  1),(9,  1),(11, 1),
(2,  2),(4,  2),(7,  2),(13, 2),
(3,  3),(8,  3),(10, 3),(15, 3),
(4,  4),(6,  4),(14, 4),(17, 4),
(5,  5),(9,  5),(12, 5),(16, 5),(18, 5),
(2,  6),(7,  6),(11, 6),
(3,  7),(10, 7),(19, 7),
(6,  8),(14, 8),(18, 8),
(8,  9),(13, 9),(20, 9),
(5,  10),(9, 10),(15, 10);
GO

/*====================================================
  10. gestion.Usuario_Entrenador
====================================================*/
INSERT INTO gestion.Usuario_Entrenador (idUsuario, idEntrenador) VALUES
(2,  1),(2,  4),
(3,  1),(3,  8),
(6,  2),(6,  7),
(7,  3),
(9,  4),(9,  1),
(10, 2),(10, 6),
(11, 5),
(13, 1),(13, 3),
(14, 7),
(15, 4),(15, 8),
(17, 2),
(18, 6),(18, 7),
(19, 1),
(20, 5);
GO

/*====================================================
  11. seguimiento.Habitos  (25 registros)
====================================================*/
INSERT INTO seguimiento.Habitos (nombre, descripcion, categoria, fechaInicio, estado, puntos, idUsuario) VALUES
('Correr 5km',          'Salir a correr 5 km cada mañana antes del desayuno.',         'Ejercicio',    '2024-01-05', 'Activo',     150, 2),
('Meditación diaria',   'Meditar 10 minutos usando la app Headspace al despertar.',     'Bienestar',    '2024-01-08', 'Activo',     100, 3),
('Leer 20 páginas',     'Leer mínimo 20 páginas de cualquier libro cada noche.',        'Aprendizaje',  '2024-01-10', 'Activo',      80, 6),
('Sin azúcar',          'Eliminar azúcar refinada de la dieta completamente.',          'Nutrición',    '2024-01-15', 'Completado', 200, 7),
('Hidratación 2L',      'Beber al menos 2 litros de agua al día.',                      'Salud',        '2024-01-20', 'Activo',      60, 9),
('Planificación semanal','Cada domingo revisar metas y planificar la semana.',          'Productividad','2024-01-22', 'Activo',      90, 10),
('Yoga matutino',       'Sesión de yoga de 30 minutos cada mañana.',                    'Ejercicio',    '2024-02-01', 'Activo',     120, 11),
('Journaling',          'Escribir al menos 5 minutos en un diario personal.',           'Bienestar',    '2024-02-05', 'Activo',      70, 13),
('Dormir 8 horas',      'Ir a cama antes de las 11pm y despertar a las 7am.',           'Salud',        '2024-02-10', 'Activo',     110, 14),
('Aprender inglés',     '30 minutos diarios en Duolingo o plataforma similar.',         'Aprendizaje',  '2024-02-15', 'Activo',     100, 15),
('Sentadillas 50',      '50 sentadillas al día sin peso como base de fuerza.',          'Ejercicio',    '2024-02-20', 'Inactivo',    80, 17),
('Desayuno nutritivo',  'Preparar un desayuno balanceado con proteína y fibra.',        'Nutrición',    '2024-03-01', 'Activo',      75, 18),
('Respiración 4-7-8',   'Practicar técnica de respiración antes de dormir.',            'Bienestar',    '2024-03-05', 'Activo',      60, 19),
('Caminata 30 min',     'Caminar al menos 30 minutos al aire libre cada día.',          'Ejercicio',    '2024-03-10', 'Activo',      90, 2),
('Pomodoro x4',         'Trabajar en bloques de 25 min con descanso de 5 min.',        'Productividad','2024-03-15', 'Activo',     110, 3),
('Sin celular 1h',      'No usar el celular la primera hora del día.',                  'Bienestar',    '2024-03-20', 'Activo',     130, 6),
('Proteína en cada comida','Asegurar fuente proteica en desayuno, almuerzo y cena.',   'Nutrición',    '2024-04-01', 'Activo',      85, 7),
('Estiramiento nocturno','10 minutos de estiramiento antes de dormir.',                'Ejercicio',    '2024-04-05', 'Activo',      65, 9),
('Lectura técnica',     'Leer 15 minutos de contenido de tu área profesional.',        'Aprendizaje',  '2024-04-10', 'Activo',      95, 10),
('Gratitud x3',         'Escribir 3 cosas por las que estás agradecido cada día.',     'Bienestar',    '2024-04-15', 'Activo',      55, 11),
('HIIT 20 min',         'Entrenamiento de alta intensidad 3 veces por semana.',        'Ejercicio',    '2024-04-20', 'Activo',     160, 13),
('Plancha 60 seg',      'Sostener posición de plancha 60 segundos al día.',            'Ejercicio',    '2024-04-25', 'Inactivo',    70, 14),
('Sin refrescos',       'Eliminar bebidas carbonatadas azucaradas.',                   'Nutrición',    '2024-05-01', 'Completado', 120, 15),
('Podcast educativo',   'Escuchar 1 episodio de podcast de desarrollo personal.',      'Aprendizaje',  '2024-05-05', 'Activo',      80, 18),
('Ahorro diario',       'Guardar al menos $5.000 COP al día en alcancía digital.',    'Finanzas',     '2024-05-10', 'Activo',     100, 19);
GO

/*====================================================
  12. seguimiento.Recordatorios  (20 registros)
====================================================*/
INSERT INTO seguimiento.Recordatorios (mensaje, frecuencia, idHabito) VALUES
('¡Hora de salir a correr! Tus zapatillas te esperan.',              'Diario',    1),
('Tómate 10 minutos para meditar. Respira profundo.',                'Diario',    2),
('Antes de apagar la luz, lee tus 20 páginas de hoy.',              'Diario',    3),
('Revisa tu ingesta: ¿has evitado el azúcar hoy?',                  'Diario',    4),
('¿Cuánta agua llevas hoy? Recuerda llegar a 2 litros.',            'Diario',    5),
('Domingo de planificación: ¿qué harás esta semana?',               'Semanal',   6),
('Buenos días, tu colchoneta de yoga te espera.',                    'Diario',    7),
('5 minutos de escritura. ¿Cómo te sentiste hoy?',                  'Diario',    8),
('Son las 10:45pm. Prepárate para dormir.',                          'Diario',    9),
('¡Abre Duolingo! Tu racha te está esperando.',                      'Diario',    10),
('¿Completaste tus 50 sentadillas de hoy?',                         'Diario',    11),
('Recuerda preparar tu desayuno nutritivo de mañana.',               'Diario',    12),
('Antes de dormir: 4 segundos inhala, 7 aguanta, 8 exhala.',        'Diario',    13),
('Tiempo de caminar. Sal 30 minutos y despeja tu mente.',           'Diario',    14),
('Activa tu temporizador Pomodoro y pon el celular boca abajo.',    'Diario',    15),
('Primera hora del día: sin celular. ¡Tú puedes!',                  'Diario',    16),
('¿Tu almuerzo tiene proteína? Revisa tu plato.',                   'Diario',    17),
('Hora del estiramiento nocturno. 10 minutos y mejor sueño.',       'Diario',    18),
('Lee 15 minutos de tu área. La constancia es la clave.',           'Diario',    19),
('Escribe tus 3 gratitudes antes de cerrar el día.',                 'Diario',    20);
GO

/*====================================================
  13. seguimiento.Rutinas  (10 registros)
====================================================*/
INSERT INTO seguimiento.Rutinas (tipo, descripcion, duracion, objetivo, idEntrenador) VALUES
('Fuerza',        'Rutina de fuerza de cuerpo completo con ejercicios compuestos: sentadilla, peso muerto, press de banca y dominadas. 4 series de 8 repeticiones con descanso de 90 seg.',                          60, 'Ganar masa muscular y fuerza funcional',        1),
('Cardio',        'Carrera continua de 5K con calentamiento de 5 minutos y enfriamiento final. Monitoreo de frecuencia cardíaca objetivo al 70-80% FCmax.',                                                          45, 'Mejorar resistencia cardiovascular',            4),
('Yoga',          'Secuencia de Vinyasa para nivel intermedio: saludo al sol, guerrero I, II y III, perro boca abajo y postura del niño como cierre. Incluye pranayama de 5 minutos.',                              40, 'Aumentar flexibilidad y reducir estrés',        2),
('HIIT',          'Circuito de alta intensidad: 40 seg trabajo / 20 seg descanso. Ejercicios: burpees, mountain climbers, saltos de caja, kettlebell swings. 5 rondas.',                                            25, 'Quemar grasa y mejorar acondicionamiento',      8),
('Pilates',       'Rutina de Pilates Mat enfocada en core: hundred, roll-up, single-leg stretch, crisscross y plank. Respiración coordinada con cada movimiento.',                                                   35, 'Fortalecer core y mejorar postura',             5),
('Movilidad',     'Rutina de movilidad articular matutina: círculos de cadera, rotación de hombros, apertura de cadera en cuclillas, movilidad torácica y movilidad de tobillos.',                                   20, 'Prevenir lesiones y mejorar rango de movimiento',1),
('Mindfulness',   'Sesión guiada de meditación: 5 min respiración consciente, 10 min body scan, 5 min visualización positiva y 5 min meditación de bondad amorosa (loving-kindness).',                             25, 'Reducir ansiedad y mejorar bienestar mental',   7),
('Nutrición',     'Plan de alimentación semanal balanceado: desayunos con proteína y fibra, almuerzos con carbohidratos complejos y grasas saludables, cenas ligeras. Lista de snacks permitidos.',                  0, 'Optimizar composición corporal y energía',      3),
('Sueño',         'Protocolo de higiene del sueño: rutina nocturna de 30 min sin pantallas, lectura ligera, técnica de respiración 4-7-8 y temperatura ambiente entre 18-20°C.',                                    30, 'Mejorar calidad y duración del sueño',          6),
('Running avanzado','Plan de entrenamiento para 10K en 8 semanas: 3 días de carrera (fondo, tempo e intervalos), 1 día de fuerza de piernas y 1 día de movilidad. Progresión semanal del 10%.',                    55, 'Completar carrera de 10K en menos de 55 minutos',4);
GO

/*====================================================
  14. seguimiento.Seguimientos  (20 registros)
====================================================*/
INSERT INTO seguimiento.Seguimientos (fecha, progreso, observaciones, idEntrenador, idUsuario) VALUES
('2024-01-15', '35% completado',  'El usuario mantiene constancia en los primeros días. Buena actitud.',                    1, 2),
('2024-01-22', '50% completado',  'Semana 2 sólida. Se recomienda ajustar dieta para apoyar el entrenamiento.',             4, 2),
('2024-02-01', '70% completado',  'Excelente progreso. Ya corre 5K sin parar. Considerar aumentar distancia.',              4, 2),
('2024-01-18', '20% completado',  'Inicio costoso. El usuario reporta dificultad para madrugar.',                           2, 3),
('2024-02-05', '55% completado',  'Mejora notable en la constancia. La meditación está reduciendo su ansiedad.',            2, 3),
('2024-02-15', '75% completado',  'Gran avance. La rutina ya está automatizada. Recomendar nivel avanzado.',                7, 3),
('2024-02-10', '40% completado',  'Buena adherencia al yoga. Necesita trabajar más la respiración.',                        2, 6),
('2024-03-01', '65% completado',  'Flexibilidad mejorada notablemente. Lista para agregar posturas de equilibrio.',         2, 6),
('2024-02-20', '30% completado',  'Hábito de lectura en construcción. Recomienda horario fijo nocturno.',                   7, 7),
('2024-03-10', '60% completado',  'Solidez en el hábito. Ya lee 20 páginas diarias sin recordatorio.',                     7, 7),
('2024-03-05', '45% completado',  'Progreso moderado. El entrenador sugiere reducir azúcar antes de eliminarla.',           3, 9),
('2024-03-20', '80% completado',  'Excelente disciplina. Sin azúcar desde hace 5 semanas. Energía estable.',                3, 9),
('2024-03-15', '50% completado',  'La hidratación mejora día a día. Usar app de recordatorios ayudó.',                     6, 10),
('2024-04-01', '70% completado',  '2L diarios cumplidos consistentemente. Piel y energía mejoradas.',                      6, 10),
('2024-03-20', '25% completado',  'Inicio lento con el yoga. El usuario necesita más motivación.',                         2, 11),
('2024-04-05', '55% completado',  'Mejora sostenida. Asiste a clases grupales que aumentan su compromiso.',                 2, 11),
('2024-04-10', '60% completado',  'Journaling establece patrones de pensamiento positivos. Recomendar técnica de gratitud.',7, 13),
('2024-04-20', '40% completado',  'Dificultad para dormir 8 horas entre semana. Se ajustan alarmas y rutina nocturna.',    6, 14),
('2024-05-01', '65% completado',  'Mejora del 20% en calidad de sueño según autoreporte. Mantener protocolo.',             6, 14),
('2024-05-10', '50% completado',  'Progreso sostenido con inglés. El usuario solicita material de práctica adicional.',     7, 15);
GO

/*====================================================
  FIN DEL SCRIPT
  Total registros insertados:
  - Rankings:              20
  - Roles:                  5
  - Usuarios:              20
  - Administradores:        5
  - Entrenadores:           8
  - Foros:                 10
  - Comentarios:           20
  - Artículos:              8
  - Foro_Administrador:    10
  - Admin_Articulo:         8
  - Usuario_Foro:          36
  - Usuario_Entrenador:    20
  - Hábitos:               25
  - Recordatorios:         20
  - Rutinas:               10
  - Seguimientos:          20
  TOTAL:                  245 registros
====================================================*/