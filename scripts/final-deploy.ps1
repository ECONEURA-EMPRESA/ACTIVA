$ErrorActionPreference = "Stop"

# --- CONFIGURACIÓN ---
$ProjectId = "crm-activa-2512311714"
$Region = "europe-west1"
$RepoName = "crm-repo"
$ServiceName = "crm-api-prod"
$SaName = "github-deployer"

Write-Host "🚀 INICIANDO DESPLIEGUE FINAL Y GENERACIÓN DE CLAVES" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Configurar Proyecto
gcloud config set project $ProjectId

# 2. Construir Imagen en la Nube (Cloud Build)
# Usamos Cloud Build para no depender de Docker local
Write-Host "[1/4] Construyendo imagen Docker en la nube (Cloud Build)..." -ForegroundColor Green
$ImageUri = "$Region-docker.pkg.dev/$ProjectId/$RepoName/$ServiceName`:latest"
gcloud builds submit . --config=cloudbuild.yaml
 

# 3. Desplegar en Cloud Run
Write-Host "[2/4] Desplegando servicio en Cloud Run..." -ForegroundColor Green
gcloud run deploy $ServiceName `
    --image $ImageUri `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --set-env-vars GCP_PROJECT_ID=$ProjectId

# 4. Configurar Service Account para GitHub Actions
Write-Host "[3/4] Configurando Service Account para CI/CD..." -ForegroundColor Green
try {
    gcloud iam service-accounts create $SaName --display-name "GitHub Actions Deployer" --quiet
}
catch {
    Write-Warning "El Service Account ya existe."
}

$SaEmail = "$SaName@$ProjectId.iam.gserviceaccount.com"

# Asignar Roles
$Roles = "roles/editor", "roles/secretmanager.admin", "roles/resourcemanager.projectIamAdmin"
foreach ($Role in $Roles) {
    gcloud projects add-iam-policy-binding $ProjectId --member "serviceAccount:$SaEmail" --role $Role --quiet
}

# 5. Generar Clave JSON
Write-Host "[4/4] Generando llave de acceso (gcp-sa-key.json)..." -ForegroundColor Green
if (Test-Path "gcp-sa-key.json") { Remove-Item "gcp-sa-key.json" }
gcloud iam service-accounts keys create gcp-sa-key.json --iam-account $SaEmail

Write-Host ""
Write-Host "✅ ¡DESPLIEGUE COMPLETADO!" -ForegroundColor Cyan
Write-Host "---------------------------------------------------"
Write-Host "Backend URL: (Ver output de Cloud Run arriba)"
Write-Host "Llave generada: gcp-sa-key.json (¡NO COMPARTIR!)"
Write-Host "Listo para configurar GitHub Secrets."
