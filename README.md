HabitApp — Sistema de Hábitos Saludables

Aplicación web Full Stack desplegada en **AWS Academy** construida con React + Node.js

**URL del sitio:** `http://habitapp-frontend-carlos.s3-website-us-east-1.amazonaws.com`  
**Repositorio:** `https://github.com/CarlosAcosta44/habitapp`

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Tiers y Layers](#tiers-y-layers)
- [Patrones de Diseño](#patrones-de-diseño)
- [Principios SOLID](#principios-solid)
- [CI/CD con GitHub Actions](#cicd-con-github-actions)
- [Tipo de Despliegue](#tipo-de-despliegue)
- [Guía de Inicio](#guía-de-inicio)

---

## Descripción

HabitApp es una galería interactiva de hábitos saludables que permite a los usuarios explorar, visualizar y descargar información sobre 10 hábitos recomendados. La aplicación integra:

- **Amazon S3** para almacenar imágenes, videos y PDFs
- **Amazon RDS (PostgreSQL)** para persistir la información estructurada
- **AWS Elastic Beanstalk** para el backend Node.js
- **GitHub Actions** para automatizar el CI/CD

---

## Arquitectura

El diagrama completo se encuentra en [`/docs/arquitectura/diagrama-arquitectura.png`]

## Tiers y Layers

### Tiers (Capas de Infraestructura)

| Tier | Componente AWS | Tecnología | Responsabilidad |
|------|---------------|------------|-----------------|
| **Presentation** | Amazon S3 (Static) | React + Vite + Tailwind | Interfaz de usuario, galería, modales |
| **Application** | Elastic Beanstalk | Node.js + Express | API REST, lógica de negocio |
| **Data** | RDS + S3 | PostgreSQL + S3 Buckets | Persistencia de datos y archivos |

### Layers (Capas de la Aplicación)

| Layer | Archivos | Responsabilidad |
|-------|----------|-----------------|
| **UI Layer** | `App.jsx`, `HabitCard`, `Modal` | Renderizado de componentes React |
| **Business Logic** | `habitsService.js`, Routes | Lógica de hábitos y validaciones |
| **Data Access** | Controllers, DB config | Consultas a PostgreSQL y S3 |
| **Storage** | RDS, S3 Buckets | Almacenamiento de datos y archivos |

---

## Patrones de Diseño

### Component Pattern
React organiza la UI en componentes reutilizables e independientes.

```jsx
// HabitCard es un componente reutilizable que recibe props
function HabitCard({ habit }) {
  return (
    <div className="card">
      <img src={getImageUrl(habit.file)} alt={habit.name} />
      <h2>{habit.name}</h2>
      <p>{habit.desc}</p>
    </div>
  );
}
```

### Repository Pattern
`habitsService.js` abstrae el acceso a datos, desacoplando la UI de las fuentes de datos.

```javascript
// La UI no sabe si los datos vienen de API o S3 directamente
export function getImageUrl(file) {
  return `${STORAGE_URL}/imagenes/${file}`;
}
```

### Observer Pattern
Los hooks de React (`useState`, `useEffect`) implementan el patrón observador para la reactividad.

```jsx
// Cuando selectedHabit cambia, React actualiza automáticamente el Modal
const [selectedHabit, setSelectedHabit] = useState(null);
```

### Singleton Pattern
La instancia de las variables de entorno es única y compartida en toda la aplicación.

```javascript
// STORAGE_URL se inicializa una sola vez y se reutiliza
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
```

---

## 🔷 Principios SOLID

### S — Single Responsibility
Cada componente y módulo tiene una única responsabilidad.

```javascript
// HabitCard solo renderiza la tarjeta
// habitsService.js solo maneja URLs y datos
// deploy.yml solo maneja el despliegue
```

### O — Open/Closed
Los componentes están abiertos para extensión mediante props, sin modificar el código fuente.

```jsx
// HabitCard se puede extender con nuevas props sin cambiar su código
<HabitCard habit={habit} onSelect={setSelectedHabit} />
```

### L — Liskov Substitution
Los componentes de UI pueden ser reemplazados por variantes sin romper la aplicación.

```jsx
// Modal puede ser reemplazado por cualquier componente que acepte { habit, onClose }
{selectedHabit && <Modal habit={selectedHabit} onClose={() => setSelectedHabit(null)} />}
```

### I — Interface Segregation
Cada servicio expone solo las funciones que necesita el consumidor.

```javascript
// habitsService.js expone funciones específicas, no una interfaz genérica
export function getImageUrl(file) { ... }
export function getVideoUrl(file) { ... }
export function getPdfUrl(file) { ... }
```

### D — Dependency Inversion
La UI depende de abstracciones (funciones del servicio), no de implementaciones concretas.

```javascript
// La UI no sabe si la URL viene de S3, Azure o local
// Solo llama getImageUrl() y el servicio maneja el detalle
```

---

## CI/CD con GitHub Actions

### Flujo de Despliegue

```
Developer → git push main → GitHub Actions → Build React → Deploy S3 + Elastic Beanstalk
```

### Archivo `.github/workflows/deploy.yml`

```yaml
name: Deploy HabitApp to AWS
on:
  push:
    branches: [ main ]
jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
        env:
          VITE_STORAGE_URL: ${{ secrets.VITE_STORAGE_URL }}
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: us-east-1
      - run: aws s3 sync ./frontend/dist/ s3://${{ secrets.S3_BUCKET_NAME }}/ --delete
```

### Secrets configurados en GitHub

| Secret | Descripción |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | Credencial de AWS Academy |
| `AWS_SECRET_ACCESS_KEY` | Credencial de AWS Academy |
| `AWS_SESSION_TOKEN` | Token de sesión AWS Academy |
| `S3_BUCKET_NAME` | Nombre del bucket frontend |
| `VITE_STORAGE_URL` | URL base del S3 Media Store |

---

## Tipo de Despliegue

| Concepto | Valor |
|----------|-------|
| **Modelo de nube** | Pública (AWS) |
| **Tipo de servicio** | PaaS (Platform as a Service) |
| **Frontend** | Amazon S3 Static Website |
| **Backend** | AWS Elastic Beanstalk |
| **Base de datos** | Amazon RDS (PostgreSQL) |
| **Almacenamiento** | Amazon S3 Bucket |

---

## Guía de Inicio

### Cada sesión de AWS Academy

1. Actualiza los secrets en GitHub con las nuevas credenciales de AWS
2. Verifica que los buckets S3 y Elastic Beanstalk existan
3. Ejecuta un redeploy si es necesario:

```bash
git commit --allow-empty -m "redeploy"
git push origin main
```

### Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/CarlosAcosta44/habitapp.git
cd habitapp

# Frontend
cd frontend
npm install
npm run dev  # http://localhost:5173

# Backend
cd ../backend
npm install
npm start    # http://localhost:3000
```

### Estructura del Proyecto

```
habitapp/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── habitsService.js
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   └── controllers/
│   └── server.js
└── docs/
    ├── arquitectura/
    │   └── diagrama-arquitectura.png
    └── database/
        └── habitapp-db.sql
```

---

## Equipo

| Integrante | Rol |
|-----------|-----|
| Carlos Acosta | Backend + AWS |
| Nicolas Crispoca | Frontend React |

**SENA — Centro de Electricidad, Electrónica y Telecomunicaciones**  
**Programa ADSO — Análisis y Desarrollo de Software · 2026**