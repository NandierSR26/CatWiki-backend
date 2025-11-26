# CatWiki Backend

API backend para CatWiki desarrollada con Node.js, TypeScript y Clean Architecture.

## 🚀 Características

- **Clean Architecture** con separación de capas (Domain, Application, Infrastructure, Presentation)
- **TypeScript** para tipado estático
- **Express.js** como framework web
- **MongoDB** con Mongoose para persistencia
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **Vitest** para testing unitario
- **ESM** (ES Modules) con soporte completo

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene con Node.js)
- **MongoDB** (local o MongoDB Atlas) - [Descargar aquí](https://www.mongodb.com/)
- **Git** - [Descargar aquí](https://git-scm.com/)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/NandierSR26/CatWiki-backend.git
cd CatWiki-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/catwiki
# O si usas MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/catwiki

# JWT Secret (genera una clave secreta segura)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# The Cat API (para obtener información de gatos)
CAT_API_URL=https://api.thecatapi.com/v1
CAT_API_KEY=tu_api_key_de_thecatapi

# Entorno
NODE_ENV=development
```

### 4. Obtener API Key de The Cat API (Opcional)

1. Ve a [The Cat API](https://thecatapi.com/)
2. Regístrate y obtén tu API key gratuita
3. Agrega la key al archivo `.env`

## 🚦 Ejecutar el proyecto

### Desarrollo (con recarga automática)

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

### Producción

```bash
# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start
```

### Ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 📁 Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── domain/             # Entidades, Value Objects, Repositorios
│   ├── application/        # Casos de uso
│   ├── infrastructure/     # Implementaciones concretas
│   └── presentation/       # Controladores y rutas
├── cats/                   # Módulo de razas de gatos
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
├── images/                 # Módulo de imágenes
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
├── presentation/           # Configuración general del servidor
│   ├── router.ts
│   └── server.ts
└── app.ts                  # Punto de entrada
```

## 🔌 Endpoints API

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual (requiere token)

### Gatos
- `GET /cats/breeds` - Obtener todas las razas (con paginación)
- `GET /cats/breeds/:id` - Obtener raza específica
- `GET /cats/search` - Buscar razas

### Imágenes
- `GET /images/breed/:breedId` - Obtener imágenes por raza
- `GET /images/reference/:referenceImageId` - Obtener imagen por ID de referencia

## 🧪 Testing

El proyecto incluye tests unitarios completos con **Vitest**:

- **Domain Layer**: Entidades, Value Objects, Repositorios
- **Application Layer**: Casos de uso
- **Infrastructure Layer**: Servicios externos, Repositorios
- **Presentation Layer**: Controladores, Rutas

Ejecutar tests específicos:
```bash
# Solo tests del módulo auth
npm test -- auth

# Solo tests de dominio
npm test -- domain
```

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Desarrollo con nodemon
npm run build        # Compilar TypeScript
npm start            # Ejecutar versión compilada
npm test             # Ejecutar tests
npm run test:coverage # Tests con cobertura
npm run test:watch   # Tests en modo watch
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que MongoDB esté ejecutándose
- Confirma la URL de conexión en `.env`
- Para MongoDB local: asegúrate de que el servicio esté iniciado

### Error de compilación TypeScript
- Ejecuta `npm run build` para ver errores detallados
- Verifica que todas las dependencias estén instaladas

### Tests fallando
- Asegúrate de que las variables de entorno estén configuradas
- Ejecuta `npm run test:watch` para debugging

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autor

**NandierSR26** - [GitHub](https://github.com/NandierSR26)

---

¿Tienes problemas o sugerencias? ¡Abre un [issue](https://github.com/NandierSR26/CatWiki-backend/issues)!