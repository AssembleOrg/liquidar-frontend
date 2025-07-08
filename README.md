# Liquidar Frontend

Una aplicación React moderna construida con Clean Architecture, MUI, Zustand y React Router.

## 🚀 Características

- **Clean Architecture**: Separación clara de responsabilidades entre capas
- **Material-UI (MUI)**: Componentes modernos y responsivos
- **Zustand**: Gestión de estado simple y eficiente
- **React Router**: Navegación entre páginas
- **JWT Authentication**: Autenticación con tokens Bearer
- **Modo Oscuro/Claro**: Soporte para temas personalizables
- **TypeScript**: Tipado estático para mayor seguridad

## 📁 Estructura del Proyecto

```
src/
├── application/          # Lógica de aplicación
│   └── stores/          # Stores de Zustand
├── domain/              # Entidades y reglas de negocio
├── infrastructure/      # Servicios externos y APIs
│   └── services/        # Servicios de API
├── presentation/        # Componentes de UI
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── hooks/          # Hooks personalizados
│   └── utils/          # Utilidades de presentación
└── shared/             # Código compartido
    ├── types/          # Tipos TypeScript
    └── constants/      # Constantes de la aplicación
```

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de UI
- **Zustand** - Gestión de estado
- **React Router** - Navegación
- **pnpm** - Gestor de paquetes

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd liquidar-frontend
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=Liquidar
   VITE_APP_VERSION=1.0.0
   ```

4. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```

## 📦 Scripts Disponibles

- `pnpm dev` - Ejecutar en modo desarrollo
- `pnpm build` - Construir para producción
- `pnpm preview` - Previsualizar build de producción
- `pnpm lint` - Ejecutar linter

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación:

- **Login**: `/login` - Página de inicio de sesión
- **Home**: `/home` - Página protegida (requiere autenticación)
- **Token**: Se almacena automáticamente en localStorage
- **Bearer**: Se incluye automáticamente en las cabeceras de las peticiones

### Credenciales de Prueba

Para probar la aplicación, puedes usar cualquier email y contraseña. El sistema simula la autenticación.

## 🎨 Temas

La aplicación soporta modo oscuro y claro:

- **Toggle de tema**: Botón en la esquina superior derecha
- **Persistencia**: La preferencia se guarda automáticamente
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🏗️ Clean Architecture

### Capas

1. **Presentation**: Componentes React, páginas, hooks
2. **Application**: Stores, casos de uso, lógica de aplicación
3. **Infrastructure**: Servicios de API, almacenamiento
4. **Domain**: Entidades, interfaces, reglas de negocio

### Flujo de Datos

```
UI Components → Stores → Services → API
     ↑                                    ↓
     ←─────────── Response ───────────────←
```

## 🔧 Configuración de API

El servicio de API está configurado para:

- **Base URL**: Configurable via `VITE_API_BASE_URL`
- **Headers**: Incluye automáticamente `Authorization: Bearer <token>`
- **Error Handling**: Manejo automático de errores 401 (logout)
- **Content-Type**: `application/json`

## 📱 Responsive Design

La aplicación es completamente responsive y se adapta a:

- **Desktop**: Pantallas grandes
- **Tablet**: Pantallas medianas
- **Mobile**: Pantallas pequeñas

## 🚀 Despliegue

1. **Construir para producción**
   ```bash
   pnpm build
   ```

2. **Los archivos se generan en `dist/`**

3. **Desplegar en tu servidor web preferido**

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
