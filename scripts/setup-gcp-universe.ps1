# Configuración
$BILLING_ACCOUNT_ID = "017D82-3F0D3B-DC1B98"
$PROJECT_ID = "metodo-activa-saas-" + (Get-Date -UFormat %s).Split(".")[0]
$PROJECT_NAME = "Metodo Activa CRM"
$REGION = "europe-west1"

Write-Host "🚀 INICIANDO DESPLIEGUE AUTOMÁTICO (PowerShell Edition)" -ForegroundColor Cyan
Write-Host "Proyecto: $PROJECT_ID"
Write-Host "Facturación: $BILLING_ACCOUNT_ID"
Write-Host "Región: $REGION"
Write-Host ""

# 1. Crear el Proyecto
Write-Host "[1/7] Creando proyecto nuevo..." -ForegroundColor Green
cmd /c "gcloud projects create $PROJECT_ID --name=`"$PROJECT_NAME`" --quiet"

# 2. Configurar entorno
Write-Host "[2/7] Configurando entorno local..." -ForegroundColor Green
cmd /c "gcloud config set project $PROJECT_ID"

# 3. Vincular Facturación
Write-Host "[3/7] Vinculando facturación..." -ForegroundColor Green
cmd /c "gcloud beta billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al vincular facturación." -ForegroundColor Red
    exit 1
}

# 4. Habilitar APIs
Write-Host "[4/7] Habilitando servicios (esto tarda unos minutos)..." -ForegroundColor Green
$services = "run.googleapis.com", "firestore.googleapis.com", "storage.googleapis.com", "cloudbuild.googleapis.com", "artifactregistry.googleapis.com", "secretmanager.googleapis.com", "identitytoolkit.googleapis.com", "firebase.googleapis.com"
cmd /c "gcloud services enable $services"

# 5. Crear Firestore
Write-Host "[5/7] Creando Firestore ($REGION)..." -ForegroundColor Green
cmd /c "gcloud firestore databases create --location=$REGION --type=firestore-native --quiet"

# 6. Crear Bucket
Write-Host "[6/7] Creando Bucket Seguro..." -ForegroundColor Green
cmd /c "gsutil mb -l $REGION -p $PROJECT_ID gs://$PROJECT_ID-secure-docs"
cmd /c "gcloud storage buckets update gs://$PROJECT_ID-secure-docs --public-access-prevention"

# 7. Crear Artifact Registry
Write-Host "[7/7] Creando repositorio Docker..." -ForegroundColor Green
cmd /c "gcloud artifacts repositories create crm-repo --repository-format=docker --location=$REGION --description=`"Repositorio API`""

# 8. Generar tfvars
Write-Host "[8/9] Generando configuración Terraform..." -ForegroundColor Green
$tfvarsContent = "project_id = `"$PROJECT_ID`"`nregion = `"$REGION`""
Set-Content -Path "infra/terraform/terraform.tfvars" -Value $tfvarsContent

# 9. Generar dummy env
Write-Host "[9/9] Generando plantilla .env.local..." -ForegroundColor Green
$envContent = @"
VITE_FIREBASE_API_KEY="REEMPLAZAR_CON_API_KEY_DE_CONSOLA"
VITE_FIREBASE_AUTH_DOMAIN="$PROJECT_ID.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="$PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="$PROJECT_ID-secure-docs"
VITE_FIREBASE_MESSAGING_SENDER_ID="REEMPLAZAR"
VITE_FIREBASE_APP_ID="REEMPLAZAR"
"@
Set-Content -Path "apps/crm-client/.env.local" -Value $envContent

Write-Host ""
Write-Host "✅ ¡INFRAESTRUCTURA LISTA!" -ForegroundColor Cyan
Write-Host "Tu Project ID: $PROJECT_ID"
