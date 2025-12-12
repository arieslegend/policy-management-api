# Script para despliegue en Azure Container Apps
# Ejecutar: PowerShell -ExecutionPolicy Bypass -File deploy-azure-container-apps.ps1

Write-Host "=== Despliegue Azure Container Apps ===" -ForegroundColor Green

# Variables
$RESOURCE_GROUP = "policy-management-rg"
$LOCATION = "eastus"
$CONTAINER_APP_NAME = "policy-management-app"
$CONTAINER_ENVIRONMENT = "policy-management-env"
$ACR_NAME = "policymgmtacr"
$IMAGE_NAME = "policy-management-app"

# Login en Azure
Write-Host "1. Login en Azure..." -ForegroundColor Yellow
az login

# Crear Resource Group
Write-Host "2. Creando Resource Group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

# Crear Azure Container Registry
Write-Host "3. Creando Azure Container Registry..." -ForegroundColor Yellow
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# Build y push Docker image
Write-Host "4. Build y push Docker image..." -ForegroundColor Yellow
az acr build --registry $ACR_NAME --image $IMAGE_NAME:latest .

# Crear Container Environment
Write-Host "5. Creando Container Environment..." -ForegroundColor Yellow
az containerapp env create --name $CONTAINER_ENVIRONMENT --resource-group $RESOURCE_GROUP --location $LOCATION

# Obtener ACR credentials
Write-Host "6. Obteniendo ACR credentials..." -ForegroundColor Yellow
$ACR_USERNAME = az acr credential show --name $ACR_NAME --query username --output tsv
$ACR_PASSWORD = az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv
$ACR_LOGIN_SERVER = az acr show --name $ACR_NAME --query loginServer --output tsv

# Crear Container App
Write-Host "7. Creando Container App..." -ForegroundColor Yellow
az containerapp create `
  --name $CONTAINER_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINER_ENVIRONMENT `
  --image "$ACR_LOGIN_SERVER/$IMAGE_NAME:latest" `
  --cpu 0.5 `
  --memory 1Gi `
  --target-port 80 `
  --ingress external `
  --registry-server $ACR_LOGIN_SERVER `
  --registry-username $ACR_USERNAME `
  --registry-password $ACR_PASSWORD

# Obtener URL
Write-Host "8. Obteniendo URL de la aplicación..." -ForegroundColor Yellow
$APP_URL = az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv

Write-Host "=== Despliegue completado ===" -ForegroundColor Green
Write-Host "URL: https://$APP_URL" -ForegroundColor Cyan
Write-Host "Puedes acceder a tu aplicación en la URL mostrada" -ForegroundColor Yellow
