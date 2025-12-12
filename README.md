Aplicación Angular para gestión de pólizas de seguro desplegada con Docker.

## Arquitectura del Sistema

El proyecto consiste en dos componentes principales:

### Frontend (Angular)
- Aplicación Angular 21.0.5 con TypeScript
- Estado gestionado con NGXS
- Interfaz responsiva con Angular Material
- Desplegado en Azure Container Apps usando Docker

### Backend (ASP.NET Core API)
- API REST construida con ASP.NET Core
- Arquitectura limpia con separación de responsabilidades
- Autenticación JWT y autorización basada en roles
- Desplegada en Azure App Service

### Base de Datos
- Base de datos SQL Server en Azure
- Migraciones de Entity Framework Core
- Datos de pólizas, clientes y usuarios

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

### 3. Usar Docker Compose (recomendado)
\`\`\`bash
docker-compose up
\`\`\`

## Desarrollo Local

### Instalar dependencias
\`\`\`bash
npm ci --legacy-peer-deps
\`\`\`

### Servidor de desarrollo
\`\`\`bash
ng serve
\`\`\`

### Construcción para producción
\`\`\`bash
ng build
\`\`\`

## Despliegue en Azure

La aplicación está desplegada en:
https://policy-management-app.wittysmoke-e662ca7d.westus.azurecontainerapps.io/

### API Backend
- URL: https://policy-management-api.azurewebsites.net/api
- Documentación Swagger disponible en /swagger

### Base de Datos
- SQL Server en Azure
- Connection String configurada para producción
- Backups automáticos configurados

## Configuración

- **API Backend**: https://policy-management-api.azurewebsites.net/api
- **CORS**: Configurado para permitir solicitudes desde el frontend
- **Autenticación**: JWT tokens con expiración configurable
- **Roles**: Admin y Client con diferentes permisos"
