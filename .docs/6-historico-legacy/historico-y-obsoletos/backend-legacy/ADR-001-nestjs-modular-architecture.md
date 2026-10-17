# ADR-001: Arquitectura Modular de NestJS

**Estado:** Aprobado  
**Fecha:** Junio 2026  
**Autores:** Equipo de Desarrollo (Carlos)

## Contexto y Problema

HabitApp está evolucionando de un frontend exclusivo en Next.js con integración directa a Supabase hacia una arquitectura híbrida donde operaciones complejas o que requieren privilegios (como el panel de administración, lógica de entrenadores, reportes y notificaciones) serán procesadas por un backend propio. 

El framework elegido para el backend fue **NestJS**. El problema principal fue decidir qué patrón arquitectónico seguir internamente. Se debatió si implementar una *Clean Architecture* estricta (con capas separadas de Dominio, Casos de Uso, Infraestructura y Presentación repetidas por cada módulo) o adoptar el enfoque nativo modular de NestJS.

## Decisión

Se ha decidido **no utilizar una Clean Architecture estricta** de múltiples capas anidadas por módulo. En su lugar, se ha optado por una **Arquitectura Modular basada en NestJS, fuertemente inspirada en principios pragmáticos de separación de responsabilidades**.

La estructura interna de cada módulo de negocio seguirá una separación funcional simple:
- `controllers/`: Manejo de rutas HTTP, validación de DTOs, Guards y documentación (Swagger).
- `services/`: Lógica de negocio y orquestación.
- `repositories/`: Interacción exclusiva con la base de datos (Supabase/PostgreSQL).
- `dto/`: Objetos de transferencia de datos con decoradores de `class-validator`.
- `entities/`: Modelos y tipos de datos del dominio.

Las preocupaciones transversales (Autenticación, Guards globales, Interceptores, Variables de Entorno) se centralizan en carpetas específicas como `common/`, `config/` y `auth/`.

## Consecuencias y Beneficios

### Beneficios (Pros)
1. **Curva de aprendizaje y Productividad:** Es el enfoque estándar y más difundido dentro de la comunidad de NestJS.
2. **Mantenibilidad:** El flujo de datos es predecible y fácil de rastrear. Modificar el comportamiento de un endpoint involucra típicamente modificar un único `Controller` y un `Service`.
3. **Escalabilidad Adecuada:** La separación estricta entre `Service` (lógica) y `Repository` (datos) asegura el desacoplamiento, suficiente para cubrir las necesidades actuales y futuras proyectadas de HabitApp.
4. **Iteración Rápida:** Reduce drásticamente la cantidad de código *boilerplate* (interfaces repetitivas, mappers entre capas) requerido en implementaciones de Clean Architecture puros, lo que fomenta el cumplimiento ágil de entregas.

### Riesgos y Mitigación (Contras)
1. **Acoplamiento al framework:** Las reglas de negocio en los `Services` utilizarán decoradores (`@Injectable()`) o clases propias de NestJS.
   * *Mitigación:* Se asume como un intercambio válido dada la madurez y soporte de NestJS a largo plazo.
2. **Riesgo de sobrecarga en Repositories:** Los desarrolladores podrían sentirse tentados a colocar lógica de negocio en la capa de datos.
   * *Mitigación:* Requiere disciplina y revisiones estrictas en los *Pull Requests* para asegurar que los repositorios sean exclusivamente para las consultas a Supabase.

## Frontera de Responsabilidades

Esta decisión consolida la distribución del sistema en tres pilares:
- **Supabase:** GoTrue para Autenticación, Row Level Security (`RLS`) y Storage.
- **Frontend (Next.js):** UI/UX, Server Components para el usuario final, delegando lógica de alto nivel al backend.
- **Backend (NestJS):** Lógica y procesos privilegiados (Orquestación, Administración, Coach, Notificaciones), operando mediante JWT validados y el `service_role` de Supabase para lectura/escritura controlada de la base de datos.
