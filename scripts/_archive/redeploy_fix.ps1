
Write-Host '>>> INICIANDO REPARACIÓN Y DESPLIEGUE - MÉTODO ACTIVA' -ForegroundColor Cyan

# 1. Infraestructura
Write-Host '1. Actualizando Infraestructura GCP...' -ForegroundColor Yellow
Set-Location infra/terraform
terraform init -upgrade
terraform apply -auto-approve

# 2. Build
Write-Host '2. Construyendo aplicaciones...' -ForegroundColor Yellow
Set-Location ../../
pnpm install
Remove-Item -Path "dist" -Recurse -ErrorAction SilentlyContinue
pnpm turbo run build

# 3. Deploy
Write-Host '3. Desplegando Frontend...' -ForegroundColor Yellow
npx firebase deploy --only hosting --project crm-activa-2512311714

Write-Host '>>> DESPLIEGUE FINALIZADO.' -ForegroundColor Green
Write-Host '>>> URL: https://crm-activa-2512311714.web.app' -ForegroundColor Cyan
