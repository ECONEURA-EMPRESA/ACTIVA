# Configuración TITANIUM
$PROJECT_ID = "metodo-activa-saas-1767353295"
$REGION = "europe-west1"
$BACKUP_BUCKET = "gs://$PROJECT_ID-backups"
$SA_NAME = "titanium-backup-agent"
$SA_EMAIL = "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
$JOB_NAME = "titanium-daily-backup"

Write-Host "🛡️ INICIANDO DESPLIEGUE DE GOBERNANZA DE DATOS (TITANIUM PROTOCOL)" -ForegroundColor Cyan
Write-Host "Proyecto: $PROJECT_ID"
Write-Host ""

# 1. Crear Bucket de Backups (Si no existe)
Write-Host "[1/5] Configurando Almacenamiento Seguro..." -ForegroundColor Green
cmd /c "gsutil mb -p $PROJECT_ID -l $REGION $BACKUP_BUCKET" 2>1 | Out-Null # Ignora error si ya existe
cmd /c "gsutil lifecycle set infra/gcs-lifecycle.json $BACKUP_BUCKET"

# 2. Crear Service Account (Least Privilege)
Write-Host "[2/5] Creando Agente de Seguridad (Service Account)..." -ForegroundColor Green
cmd /c "gcloud iam service-accounts create $SA_NAME --display-name='Titanium Backup Agent' --project=$PROJECT_ID --quiet"

# 3. Asignar Permisos (Roles Específicos)
Write-Host "[3/5] Asignando Roles de Blindaje..." -ForegroundColor Green
# Permiso para exportar Firestore
cmd /c "gcloud projects add-iam-policy-binding $PROJECT_ID --member='serviceAccount:$SA_EMAIL' --role='roles/datastore.importExportAdmin' --quiet"
# Permiso para escribir en el bucket
cmd /c "gsutil iam ch serviceAccount:$SA_EMAIL:objectAdmin $BACKUP_BUCKET"

# 4. Crear Cloud Scheduler Job (La Automatización)
Write-Host "[4/5] Programando Cronograma de Respaldo (Diario 03:00 AM)..." -ForegroundColor Green
$URI = "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default):exportDocuments"
$BODY = "{`"outputUriPrefix`": `"$BACKUP_BUCKET`"}"

cmd /c "gcloud scheduler jobs create http $JOB_NAME --schedule='0 3 * * *' --uri='$URI' --http-method=POST --message-body='$BODY' --oauth-service-account-email='$SA_EMAIL' --location=$REGION --project=$PROJECT_ID --quiet"

Write-Host ""
Write-Host "✅ GOBERNANZA DE DATOS ACTIVADA." -ForegroundColor Cyan
Write-Host "El sistema realizará respaldos automáticos todos los días a las 03:00 AM."
