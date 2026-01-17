$ErrorActionPreference = "Stop"

Write-Host "🚀 INICIANDO DESPLIEGUE FINAL (TITANIUM GOLDEN RELEASE)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 0. Check Prerequisites
Write-Host "[1/4] Verificando entorno..." -ForegroundColor Green
$CurrentProject = (firebase projects:list).Split("`n") | Select-String "current"
Write-Host "Proyecto Activo: $CurrentProject"

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
Write-Host "Next Steps:"
Write-Host "1. Verify SSL certificates in Console."
Write-Host "2. Enable BigQuery Extension manually if not done."
Write-Host "3. Monitor Performance in Firebase Console."
