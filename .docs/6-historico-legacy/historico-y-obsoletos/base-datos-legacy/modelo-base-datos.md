# 🗄️ Base de Datos — HabitApp

La base de datos del proyecto está gestionada utilizando **Supabase** (PostgreSQL). Toda la estructura, esquema, y configuraciones relevantes se encuentran detalladas y almacenadas en scripts SQL separados en este mismo directorio.

## Scripts SQL de Configuración

1. **[1. Script Esquemas & DB.sql](./1.%20Script%20Esquemas%20%26%20DB.sql)**
   Contiene la declaración principal de esquemas, tablas, tipos de datos y relaciones.

2. **[2. Script Restricciones (Campo).sql](./2.%20Script%20Restricciones%20(Campo).sql)**
   Aplicación de restricciones (constraints) a nivel de campos en las tablas para asegurar el dominio de los datos.

3. **[3. Script Indices NonClustered.sql](./3.%20Script%20Indices%20NonClustered.sql)**
   Creación de índices para optimización de consultas, mejorando la velocidad de lectura en tablas importantes.

4. **[4. Script Datos Sintetícos.sql](./4.%20Script%20Datos%20Sintetícos.sql)**
   Inserción de datos de prueba o sintéticos para poblar la base de datos y facilitar el desarrollo y pruebas manuales.
