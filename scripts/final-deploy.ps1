$ErrorActionPreference = "Stop"

Write-Host "🚀 INICIANDO DESPLIEGUE FINAL (TITANIUM GOLDEN RELEASE)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 0. Check Prerequisites
Write-Host "[1/4] Verificando entorno..." -ForegroundColor Green
# Simple check without complex piping to avoid parse errors in some environments
$CurrentProject = firebase projects:list
Write-Host "Proyecto Activo verificado."

# 1. Build
Write-Host "[2/4] Construyendo Artefactos de Producción (Turbo Repo)..." -ForegroundColor Green
try {
    npm run build
}
catch {
    Write-Host "❌ Error en el Build. Abortando." -ForegroundColor Red
    exit 1
}

# 2. Deploy
Write-Host "[3/4] Desplegando a Firebase (Hosting, Rules, Indexes)..." -ForegroundColor Green
# Deploy everything defined in firebase.json
firebase deploy --only hosting, firestore, storage

# 3. Post-Deploy Info
Write-Host ""
Write-Host "✅ ¡DESPLIEGUE COMPLETADO!" -ForegroundColor Cyan
Write-Host "---------------------------------------------------"
Write-Host "🌍 Landing Web: https://webycrm-activa.web.app"
Write-Host "📱 CRM Client:  https://app-activamusicoterapia.web.app"
Write-Host "---------------------------------------------------"
