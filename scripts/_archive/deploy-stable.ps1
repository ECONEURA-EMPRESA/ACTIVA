# Deploy Stable V1
$PROJECT_ID = "metodo-activa-saas-1767353295"
$REGION = "europe-west1"
$REPO_NAME = "crm-repo"
$IMAGE_NAME = "backend-api"
$SERVICE_NAME = "crm-api-prod"

Write-Host "🚀 INICIANDO DESPLIEGUE A PRODUCCIÓN (Versión Estable)" -ForegroundColor Cyan
Write-Host "------------------------------------------------------"
Write-Host "Proyecto: $PROJECT_ID"
Write-Host "Región: $REGION"

# 1. Configurar Proyecto
cmd /c "gcloud config set project $PROJECT_ID"

# 2. Backend: Build & Deploy (Usando Cloud Build para no depender de Docker local)
Write-Host "`n[1/4] 📦 Construyendo Backend en la Nube (Cloud Build)..." -ForegroundColor Yellow
$IMAGE_URI = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME`:`latest"
cmd /c "gcloud builds submit apps/backend-api --tag $IMAGE_URI"

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Error construyendo el Backend." -ForegroundColor Red
  exit 1
}

Write-Host "`n[2/4] 🚀 Desplegando Backend en Cloud Run..." -ForegroundColor Yellow
cmd /c "gcloud run deploy $SERVICE_NAME --image $IMAGE_URI --region $REGION --platform managed --allow-unauthenticated --port 3000 --set-env-vars NODE_ENV=production"

# Obtener URL del Backend
$BACKEND_URL = (cmd /c "gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'")
Write-Host "✅ Backend Online: $BACKEND_URL" -ForegroundColor Green

# 3. Frontend: Configuración Automática
Write-Host "`n[3/4] ⚙️ Configurando Frontend (Firebase)..." -ForegroundColor Yellow

# Crear Web App si no existe y obtener config
$WEB_APP_ID = (cmd /c "gcloud firebase apps list --format='value(appId)' --filter='displayName:MetodoActivaWeb'")

if (-not $WEB_APP_ID) {
  Write-Host "Creando nueva Firebase Web App..."
  cmd /c "gcloud firebase apps create WEB --display-name='MetodoActivaWeb'"
  $WEB_APP_ID = (cmd /c "gcloud firebase apps list --format='value(appId)' --filter='displayName:MetodoActivaWeb'")
}

# Configuración Manual (Proporcionada por Usuario)
$API_KEY = "AIzaSyAFCYWkWRi-i4VGzrHYl135lTD8zo30Cn4"
$AUTH_DOMAIN = "metodo-activa-saas-1767353295.firebaseapp.com"
$PROJECT_ID = "metodo-activa-saas-1767353295"
$STORAGE_BUCKET = "metodo-activa-saas-1767353295.firebasestorage.app"
$MESSAGING_SENDER_ID = "679548176188"
$APP_ID = "1:679548176188:web:7b3e5d6eee7b138dd10039"

# Escribir .env.local REAL
$envContent = @"
VITE_API_URL="$BACKEND_URL"
VITE_FIREBASE_API_KEY="$API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="$AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="$PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="$STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="$MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="$APP_ID"
"@
Set-Content -Path "apps/crm-client/.env.local" -Value $envContent
Write-Host "✅ Configuración inyectada en apps/crm-client/.env.local"

# 4. Frontend: Build & Deploy
Write-Host "`n[4/4] 🎨 Compilando y Subiendo Frontend..." -ForegroundColor Yellow
Set-Location "apps/crm-client"
cmd /c "npm install"
cmd /c "npm run build"

# Inicializar y desplegar Firebase Hosting
# Nota: Esto asume que firebase-tools está instalado. Si no, usaremos npx.
Write-Host "Inicializando Firebase..."
# Un "firebase init hosting" automatizado es difícil. Vamos a crear el firebase.json manualmente.
$firebaseJson = @"
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
"@
Set-Content -Path "firebase.json" -Value $firebaseJson
Set-Content -Path ".firebaserc" -Value "{ `"projects`": { `"default`": `"$PROJECT_ID`" } }"

Write-Host "Subiendo a Firebase Hosting..."
cmd /c "npx firebase-tools deploy --only hosting --project $PROJECT_ID"

Write-Host "`n✅ ¡DESPLIEGUE COMPLETADO!" -ForegroundColor Green
Write-Host "🌍 Tu Web: https://$PROJECT_ID.web.app"
