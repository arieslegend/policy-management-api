# policy-management-api

Descripción
-----------

Este repositorio contiene una API en .NET (ASP.NET Core) y una aplicación frontend en Angular para gestionar pólizas (Policy Management).

Contenido
---------

- `PolicyManagement.API/` - Proyecto backend (ASP.NET Core Web API)
- `policy-management-frontend/` - Aplicación frontend (Angular)
- `PolicyManagement.Infrastructure/` - Persistencia (Entity Framework Core)
- `PolicyManagement.Core/` - Lógica de dominio
- `PolicyManagement.UnitTests/` y `PolicyManagement.IntegrationTests/` - Tests

Requisitos previos
------------------

- .NET SDK (versión 7+ recomendable)
- Node.js (16+ recomendada) y npm
- Angular CLI (opcional, `npm i -g @angular/cli`)
- Docker (opcional, para base de datos o contenerizar frontend)
- (Opcional) `dotnet-ef` para gestionar migraciones: `dotnet tool install --global dotnet-ef`

Construir y ejecutar localmente
-------------------------------

Nota: las instrucciones asumen que trabajas en Windows PowerShell; adapta comandos para otros shells si es necesario.

1) Preparar la base de datos

	- La aplicación usa EF Core y busca una cadena de conexión llamada `DefaultConnection`.
	- Puedes ejecutar SQL Server en Docker (ejemplo):

```powershell
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Your_password123" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest
```

	- Ejemplo de cadena de conexión (usa tu contraseña segura):

```
Server=localhost,1433;Database=PolicyDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True;
```

	- Añádela a `PolicyManagement.API/appsettings.Development.json` o exponla como variable de entorno en PowerShell:

```powershell
#$env:ConnectionStrings__DefaultConnection = "Server=localhost,1433;Database=PolicyDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True;"
```

2) Ejecutar la API (backend)

```powershell
cd PolicyManagement.API
dotnet restore
dotnet build
# En entorno Development, la aplicación intentará aplicar migraciones automáticamente (ver Program.cs).
dotnet run
```

La API en desarrollo expone Swagger en `https://localhost:{puerto}/swagger` (ver salida de `dotnet run`).

3) Ejecutar el frontend (Angular)

```powershell
cd policy-management-frontend
npm install
npm start
```

El frontend por defecto corre en `http://localhost:4200` y en desarrollo está configurado para permitir CORS con la API (ver `Program.cs`).

4) Ejecutar tests

- Backend unit/integration tests:

```powershell
dotnet test ./PolicyManagement.UnitTests
dotnet test ./PolicyManagement.IntegrationTests
```

- Frontend:

```powershell
cd policy-management-frontend
npm run test                # tests en modo desarrollo
npm run test:ci             # tests CI (headless + coverage)
```

Usar migraciones manualmente (opcional)
-------------------------------------

Si prefieres aplicar migraciones de forma manual o crear nuevas:

```powershell
dotnet ef database update --project PolicyManagement.Infrastructure --startup-project PolicyManagement.API
# o agregar una migración:
dotnet ef migrations add NombreMigracion --project PolicyManagement.Infrastructure --startup-project PolicyManagement.API
```

Construir para producción y Docker
---------------------------------

- Frontend (build):

```powershell
cd policy-management-frontend
npm run build
```

- Hay un `docker-compose.yml` y `Dockerfile` para el frontend en `policy-management-frontend/` que construye y sirve la app en producción (mapea puerto 80).

- Para publicar el backend en modo Release y empacarlo (ejemplo):

```powershell
cd PolicyManagement.API
dotnet publish -c Release -o ./publish
# luego crea un Dockerfile (si quieres contenerizar el API) y construye la imagen
```

Problemas comunes
-----------------

- Si la API falla al aplicar migraciones, revisa la cadena de conexión y que el servidor DB esté accesible.
- Si el frontend no puede comunicarse con la API, verifica CORS y las URLs base en la configuración del frontend.

Habilitar "Raptor mini (Preview)" para clientes
----------------------------------------------

No puedo cambiar la configuración de tus herramientas remotas por ti, pero aquí tienes opciones según dónde quieras habilitar "Raptor mini (Preview)":

- VS Code / Copilot: revisa la extensión (Copilot/Copilot Labs) y sus ajustes (generalmente hay una opción para elegir o habilitar modelos experimentales).
- Azure/OpenAI: en la configuración de tu recurso (Azure OpenAI) o en la llamada a la API, especifica el parámetro `model` con `raptor-mini` (o el nombre exacto del modelo proporcionado por Azure) si está disponible.

Si quieres, dime **dónde** quieres habilitarlo (VS Code, Azure OpenAI, otro cliente) y te doy pasos concretos.

Contacto y ayuda
----------------

Si necesitas ayuda con un error concreto, pega el mensaje de error y los pasos que ejecutaste y te guiaré.

---

¡Listo! Si quieres que traduzca este README al inglés o que agregue scripts de `Makefile`/PowerShell para automatizar los pasos, dímelo y lo añado.

Despliegue en Azure (API)
-------------------------

Puedes desplegar la API en Azure mediante App Service (Windows/Linux) o contenedores. A continuación hay dos opciones comunes:

1) Azure App Service (sin contenedor — publicación mediante `dotnet publish` o despliegue directo)

```powershell
# Crear resource group
az group create --name myResourceGroup --location eastus

# Crear App Service plan
az appservice plan create --name myAppPlan --resource-group myResourceGroup --sku B1 --is-linux false

# Crear Web App
az webapp create --name my-api-webapp --resource-group myResourceGroup --plan myAppPlan --runtime "DOTNETCORE|7.0"

# Establecer cadena de conexión de Azure SQL (ver sección Azure SQL abajo)
az webapp config connection-string set --resource-group myResourceGroup --name my-api-webapp --settings DefaultConnection="Server=tcp:<your-server>.database.windows.net,1433;Database=PolicyDb;User Id=<user>;Password=<password>" --connection-string-type SQLAzure

# Desplegar con ZIP deploy (desde el directorio del proyecto API)
dotnet publish -c Release -o ./publish
cd publish
az webapp deploy --name my-api-webapp --resource-group myResourceGroup --src-path . --type zip
```

2) Azure App Service o Container Apps con contenedor (si prefieres contenerizar)

```powershell
# Build image locally and push to ACR
az acr create --resource-group myResourceGroup --name myACR --sku Basic
az acr login --name myACR
docker build -t myacr.azurecr.io/policy-api:latest -f PolicyManagement.API/Dockerfile ./PolicyManagement.API
docker push myacr.azurecr.io/policy-api:latest

# Create Web App for containers (App Service) and set image
az webapp create --resource-group myResourceGroup --plan myAppPlan --name my-api-webapp --deployment-container-image-name myacr.azurecr.io/policy-api:latest

# Configure ACR access
az webapp config container set --name my-api-webapp --resource-group myResourceGroup --docker-custom-image-name myacr.azurecr.io/policy-api:latest --docker-registry-server-url https://myacr.azurecr.io --docker-registry-server-user <acr-username> --docker-registry-server-password <acr-password>
```

Despliegue en Azure (Base de datos Azure SQL)
--------------------------------------------

```powershell
# Crear servidor SQL
az sql server create --name my-sql-server --resource-group myResourceGroup --location eastus --admin-user myadmin --admin-password "MyStr0ngP@ssw0rd"

# Crear base de datos
az sql db create --resource-group myResourceGroup --server my-sql-server --name PolicyDb --service-objective S0

# Configurar regla de firewall si usas IP del dev
az sql server firewall-rule create --resource-group myResourceGroup --server my-sql-server -n AllowMyIP --start-ip-address <your-ip> --end-ip-address <your-ip>

# Cadena de conexión de ejemplo (establecer en App Service o como secret en Key Vault)
Server=tcp:my-sql-server.database.windows.net,1433;Database=PolicyDb;User Id=myadmin;Password=MyStr0ngP@ssw0rd;TrustServerCertificate=False;Encrypt=True;
```

Despliegue del frontend con Docker en Azure
------------------------------------------

Puedes desplegar el frontend Dockerizado a App Service for Containers, a Azure Container Apps, o a un Azure Static Web App (si usas build estático). Aquí mostramos ACR y App Service for Containers:

```powershell
# Crear Azure Container Registry (ACR)
az acr create --resource-group myResourceGroup --name myACR --sku Basic
az acr login --name myACR

# Construir la imagen del frontend (dentro de policy-management-frontend)
cd policy-management-frontend
docker build -t myacr.azurecr.io/policy-frontend:latest .
docker push myacr.azurecr.io/policy-frontend:latest

# Crear App Service plan (Linux) y Web App for Containers
az appservice plan create --name myFrontendPlan --resource-group myResourceGroup --sku B1 --is-linux true
az webapp create --resource-group myResourceGroup --plan myFrontendPlan --name my-frontend-webapp --deployment-container-image-name myacr.azurecr.io/policy-frontend:latest

# Configurar ACR credentials
az webapp config container set --name my-frontend-webapp --resource-group myResourceGroup --docker-custom-image-name myacr.azurecr.io/policy-frontend:latest --docker-registry-server-url https://myacr.azurecr.io --docker-registry-server-user <acr-username> --docker-registry-server-password <acr-password>
```

Alternativa: Azure Container Apps (más flexible para contenedores distribuidos)
```powershell
# Crear ambiente Container Apps y registrar ACR si usas Container Apps
az containerapp env create --name my-env --resource-group myResourceGroup --location eastus
az containerapp create --name my-frontend-app --resource-group myResourceGroup --environment my-env --image myacr.azurecr.io/policy-frontend:latest --ingress external --target-port 80
```

Notas y recomendaciones
-----------------------
- Usa Azure Key Vault para guardar cadenas de conexión y credenciales en lugar de variables planas en tus App Services.
- Revisa `Application settings` en App Service para exponer `ConnectionStrings__DefaultConnection` con la cadena de conexión de Azure SQL.
- Considera usar `az webapp deployment container config` o GitHub Actions para automatizar despliegues desde tu repositorio.
- Para entornos con despliegues más avanzados, crea pipelines CI/CD (GitHub Actions, Azure DevOps) que:
	- Generen y publiquen imágenes en ACR
	- Actualicen App Service / Container Apps al nuevo tag

¿Quieres que también añada ejemplos de GitHub Actions para CI/CD (build, push a ACR y deploy a App Service)?
