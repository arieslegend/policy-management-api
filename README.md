# Policy Management 

Aplicación web para gestión de pólizas de seguro desplegada con Docker.

## Arquitectura del Sistema

El proyecto consiste en dos componentes principales:

### Frontend (Angular)
- Aplicación Angular 21.0.5 con TypeScript
- Estado gestionado con NGXS
- Interfaz responsiva con Angular Material
- Desplegado en Azure Container Apps usando Docker
- Pruebas unitarias y de integracion.
- Desplegado en un contenedor Docker.

### Backend (ASP.NET Core API)
- API REST construida con ASP.NET Core
- Arquitectura limpia con separación de responsabilidades
- Autenticación JWT y autorización basada en roles
- Desplegada en Azure App Service
- Pruebas unitarias y de integracion.

### Base de Datos
- Base de datos SQL Server en Azure
- Migraciones de Entity Framework Core
- Datos de pólizas, clientes 

## Modelo de Datos

### Entidades Principales


#### Clients
- **Id**: Identificador único del cliente
- **IdentificationNumber**: Numero de identificacion
- **FullName**: Nombre completo
- **Email**: Correo electrónico
- **Phone**: Teléfono
- **CreatedAt**: Fecha de creacion del registro
- **UpdatedAt**: Fecha de ultima actualizacion del registro

#### Policy
- **Id**: Identificador único de la póliza
- **Type**: Tipo de póliza (Auto/Home/Life)
- **InsuredAmount**: Monto de cobertura
- **StartDate**: Fecha de inicio
- **EndDate**: Fecha de fin
- **ClientId**: Referencia al cliente asociado
- **Status**: Estado (Active/Canceled)
- **CreatedAt**: Fecha de creacion del registro
- **UpdatedAt**: Fecha de ultima actualizacion del registro

## Pruebas Unitarias

### Framework de Pruebas
- **Karma + Jasmine**: Para pruebas unitarias de componentes
- **NGXS Testing**: Para pruebas de estados y acciones
- **Angular Testing Utilities**: Para pruebas de servicios y guards

### Módulos de Pruebas Unitarias

#### Component Tests
- **LoginComponent**: Validación de formulario, autenticación
- **ClientFormComponent**: Creación y edición de clientes
- **PolicyFormComponent**: Gestión de pólizas
- **Dashboard Components**: Renderizado y datos

#### State Tests (NGXS)
- **AuthState**: Login, logout, manejo de errores
- **PolicyState**: CRUD de pólizas, filtros, estado de carga

#### Guard Tests
- **AuthGuard**: Protección de rutas basada en autenticación
- **AdminGuard**: Acceso restringido a roles de administrador

### Ejecución de Pruebas Unitarias
\`\`\`bash
npm test
\`\`\`

## Pruebas de Integración

### Flujo de Autenticación
- Login completo con API backend
- Redirección basada en rol
- Manejo de tokens JWT

### Gestión de Pólizas
- Creación de pólizas con validación
- Listado y filtrado
- Actualización y eliminación

## Requisitos Previos

- Docker Desktop
- Node.js 20.19.0 o superior
- npm

## Construcción y Ejecución con Docker

### 1. Construir la imagen Docker
\`\`\`bash
docker build -t policy-management-app .
\`\`\`

### 2. Ejecutar la aplicación
\`\`\`bash
docker run -p 8080:80 policy-management-app
\`\`\`

La aplicación estará disponible en \`http://localhost:8080\`

## Desarrollo Local

### Instalar dependencias
\`\`\`bash
npm ci --legacy-peer-deps
\`\`\`

### Servidor de desarrollo
\`\`\`bash
npm start
\`\`\`

### Construcción para producción
\`\`\`bash
npm run build
\`\`\`

## Despliegue en Azure

La aplicación está desplegada en:
https://policy-management-app.wittysmoke-e662ca7d.westus.azurecontainerapps.io/

### API Backend
- URL: https://policy-management-api.azurewebsites.net/api
- Documentación Swagger disponible en https://policy-management-api.azurewebsites.net/swagger/index.html

### Base de Datos
- SQL Server en Azure
- Connection String configurada para producción
- Backups automáticos configurados

## Configuración

- **API Backend**: https://policy-management-api.azurewebsites.net/api
- **CORS**: Configurado para permitir solicitudes desde el frontend
- **Autenticación**: JWT tokens con expiración configurable
- **Roles**: Admin y Client con diferentes permisos
