# TITANIUM UPGRADE SCRIPT
# CLASSIFICATION: AUTOMATED INFRASTRUCTURE ENGINEERING
# TARGET: GOOGLE CLOUD PLATFORM + FIREBASE

Write-Host "🚀 INICIANDO PROTOCOLO TITANIUM (GOOGLE NATIVE)..." -ForegroundColor Cyan

# 1. VERIFICACIÓN DE ENTORNO
Write-Host "🔍 Verificando herramientas y Configurando Proyecto..."
# Set Project Alias
cmd /c "firebase use coral-sonar-483306-h0"

if (!(Get-Command "firebase" -ErrorAction SilentlyContinue)) {
    Write-Error "CRITICAL: Firebase CLI no está instalado."
    exit 1
}
if (!(Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-Error "CRITICAL: Google Cloud SDK no está instalado."
    exit 1
}

# 2. ACTIVACIÓN DE APIs (Requiere Billing)
Write-Host "🔓 Habilitando APIs de Seguridad (Requiere Plan Blaze)..." -ForegroundColor Yellow
# Compute Engine (Required for Cloud Armor Scope)
cmd /c "gcloud services enable compute.googleapis.com"
# Web Security Scanner
cmd /c "gcloud services enable websecurityscanner.googleapis.com"

# 3. CONFIGURACIÓN DE TARGETS (Multi-Site)
Write-Host "🎯 Configurando Objetivos de Despliegue..." -ForegroundColor Yellow
# Asumiendo que los sitios 'activamusicoterapia' y 'app-activamusicoterapia' existen en Firebase Console
cmd /c "firebase target:apply hosting landing-web activamusicoterapia-web"
cmd /c "firebase target:apply hosting crm-client activamusicoterapia-app"

# 4. ACTUALIZACIÓN DE FIREBASE.JSON
Write-Host "📝 Reescribiendo firebase.json para Arquitectura Multi-Site..." -ForegroundColor Yellow
$firebaseConfig = @'
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": [
    {
      "target": "landing-web",
      "public": "apps/landing-web/dist",
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
      ],
      "headers": [
        {
          "source": "**",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=3600"
            }
          ]
        }
      ]
    },
    {
      "target": "crm-client",
      "public": "apps/crm-client/dist",
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
  ]
}
'@
Set-Content -Path "firebase.json" -Value $firebaseConfig

Write-Host "✅ CONFIGURACIÓN FINALIZADA." -ForegroundColor Green
Write-Host "⚠️  IMPORTANTE: Asegúrate de haber activado el Plan Blaze antes de desplegar." -ForegroundColor Red
