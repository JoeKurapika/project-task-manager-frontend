# Project & Task Management App

Una aplicación web moderna para la gestión eficiente de proyectos y tareas en tiempo real, construida sobre una arquitectura desacoplada (Full-Stack Decoupled) orientada a microservicios/REST APIs.

---

## 🚀 Características Principales

- **🔐 Autenticación & Autorización:**
  - Registro de usuarios e inicio de sesión.
  - Gestión de sesión mediante tokens JWT con persistencia en `LocalStorage`.
  - Rutas públicas y rutas protegidas (`ProtectedRoute`).
  - Cierre de sesión seguro con limpieza de estado global.

- **📋 Gestión Completa de Proyectos y Tareas (CRUD):**
  - Creación rápida de proyectos con título y descripción en modal interactivo.
  - Creación rápida de tareas con título y descripción en modal interactivo para cada proyecto.
  - Edición en caliente de tareas existentes.
  - Alternancia ágil de estado: pendiente ↔ completada.
  - Eliminación permanente de tareas.

- **📊 Métricas & Feedback Visual en Tiempo Real:**
  - Tarjetas de resumen en vivo: *Total de tareas*, *Completadas* y *Pendientes*.
  - Notificaciones enriquecidas (*toasts*) con Sonner para cada acción del usuario.
  - Indicadores de carga mediante esqueletos animados (*Skeletons*).
  - Manejo integral de estados vacíos (*Empty state*) y estados de error con opción de reintento.

- **🎨 Diseño & Experiencia de Usuario (UX/UI):**
  - Interfaz oscura premium (*Dark Theme*) optimizada para desarrolladores.
  - Tipografía variable moderna (Geist).
  - Efectos visuales de desenfoque (*backdrop-blur*), bordes suaves y transiciones fluidas.
  - Totalmente adaptable a dispositivos móviles, tablets y escritorios.

---

## 🛠️ Stack Tecnológico

| Tecnología | Rol / Descripción |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Biblioteca principal de componentes de interfaz. |
| **[TypeScript](https://www.typescriptlang.org/)** | Tipado estático robusto y autocompletado en toda la aplicación. |
| **[Vite 8](https://vite.dev/)** | Entorno de desarrollo ultrarrápido y empaquetador para producción. |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Motor de estilos moderno y diseño basado en utilidades de última generación. |
| **[React Router DOM v7](https://reactrouter.com/)** | Enrutamiento declarativo del lado del cliente (SPA). |
| **[Lucide React](https://lucide.dev/)** | Iconografía vectorizada clara y consistente. |
| **[Sonner](https://sonner.emilkowal.ski/)** | Sistema ligero y estilizado de alertas y notificaciones Toast. |
| **[@base-ui/react](https://base-ui.com/) / Shadcn** | Primitivas y componentes UI accesibles y sin estilos restrictivos. |

---

# Requisitos Previos
Asegúrate de contar con los siguientes componentes instalados en tu sistema:
- Node.js: v18.x o superior
- npm: v9.x o superior (o pnpm / yarn)
- Base de Datos: Instancia de PostgreSQL activa

---

### INSTRUCCIONES PARA EJECUTAR EL PROYECTO

1. Clonar los repositorios
# BACKEND
```bash
git clone https://github.com/JoeKurapika/project-task-manager-backend.git
```

# FRONTEND
```bash
git clone https://github.com/JoeKurapika/project-task-manager-frontend.git
```

2. Configurar Variables de Entorno
- **BACKEND:**
Crea un archivo .env en la raíz del proyecto BACKEND (/) y otro en el Backend (/server o repositorio correspondiente):
`PORT=3000
DATABASE_URL="postgresql://usuario:password@localhost:5432/taskdb?schema=public"
JWT_SECRET=tu_clave_secreta_jwt_aqui`


- **FRONTEND:**
Crea un archivo .env en la raíz del proyecto FRONTEND (/) y otro en el Backend (/server o repositorio correspondiente):
`VITE_API_BASE_URL=http://localhost:3000/api`


3. Instalar dependencias
- **BACKEND:**
```bash
cd project-task-manager-backend
npm install
```
- **FRONTEND:**
```bash
cd project-task-manager-frontend
npm install
```

4. Ejecución del Proyecto 
- **BACKEND:**
```bash
npm run dev
```
- **FRONTEND:**
```bash
npm run dev
```
