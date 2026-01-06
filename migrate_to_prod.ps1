# migrate_to_prod.ps1
# Master Automation Script for Activa Migration
# Target: coral-sonar-483306-h0 (activamusicoterapia.com)

$ErrorActionPreference = "Stop"
$PROD_PROJECT_ID = "coral-sonar-483306-h0"
$DOMAIN = "activamusicoterapia.com"

function Print-Header {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "   🚀 ACTIVA MIGRATION PROTOCOL v1.0" -ForegroundColor Cyan
    Write-Host "   Target: $PROD_PROJECT_ID ($DOMAIN)" -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Check-Command ($cmd, $name) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Error "❌ Missing requirement: $name ($cmd). Please install it and retry."
        exit 1
    }
    Write-Host "✅ Found $name" -ForegroundColor Green
}

Print-Header

# ----------------------------------------------------------------------
# 1. VALIDATION
# ----------------------------------------------------------------------
Write-Host "`n[1/6] 🔍 Validating Environment..." -ForegroundColor Magenta
Check-Command "pnpm" "PNPM"
Check-Command "firebase" "Firebase CLI"
Check-Command "gcloud" "Google Cloud SDK"
Check-Command "node" "Node.js"

# ----------------------------------------------------------------------
# 2. AUTHENTICATION & CONTEXT
# ----------------------------------------------------------------------
Write-Host "`n[2/6] 🔐 Setting User Context..." -ForegroundColor Magenta

# GCloud Project
Write-Host "   Setting GCloud project to $PROD_PROJECT_ID..."
gcloud config set project $PROD_PROJECT_ID | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Warning "Failed to set gcloud project. You might need to login: 'gcloud auth login'" }

# Firebase Alias
Write-Host "   Configuring Firebase Alias 'prod'..."
firebase use prod 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Creating 'prod' alias..."
    firebase use --add $PROD_PROJECT_ID --alias prod
}

# ----------------------------------------------------------------------
# 3. DEPENDENCIES
# ----------------------------------------------------------------------
Write-Host "`n[3/6] 📦 Installing Dependencies (pnpm)..." -ForegroundColor Magenta
# Run install at root
pnpm install
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to install dependencies."; exit 1 }

# ----------------------------------------------------------------------
# 4. CONFIGURATION & ENV
# ----------------------------------------------------------------------
Write-Host "`n[4/6] ⚙️  Configuring Environment..." -ForegroundColor Magenta

# Fetch Firebase Config
Write-Host "   Fetching Firebase Web App Config..."
$configStr = ""
try {
    # Attempt to fetch config for the first web app found
    # We parse the output of sdkconfig
    $sdkConfig = firebase apps:sdkconfig
    # Simple regex extraction (naive but effective for standard output)
    if ($sdkConfig -match "appId") {
        $configStr = $sdkConfig
        Write-Host "   ✅ Config retrieved from Firebase." -ForegroundColor Green
    }
    else {
        throw "No config found in output"
    }
}
catch {
    Write-Warning "   ⚠️  Could not fetch Firebase config automatically (Login might be required)."
    Write-Host "   Please enter the Firebase Web App Config manually (or press Enter to use placeholders knowing Auth won't work):"
    $inputConfig = Read-Host "   Paste 'apiKey', 'appId', etc? (Leave empty for PLACEHOLDERS)"
    
    if (-not [string]::IsNullOrWhiteSpace($inputConfig)) {
        $configStr = $inputConfig
    }
}

# Extract values or use placeholders
$apiKey = if ($configStr -match 'apiKey": "(.*?)"') { $Matches[1] } else { "REPLACE_WITH_REAL_API_KEY" }
$authDomain = if ($configStr -match 'authDomain": "(.*?)"') { $Matches[1] } else { "$PROD_PROJECT_ID.firebaseapp.com" }
$projectId = if ($configStr -match 'projectId": "(.*?)"') { $Matches[1] } else { $PROD_PROJECT_ID }
$storageBucket = if ($configStr -match 'storageBucket": "(.*?)"') { $Matches[1] } else { "$PROD_PROJECT_ID.appspot.com" }
$messagingSenderId = if ($configStr -match 'messagingSenderId": "(.*?)"') { $Matches[1] } else { "REPLACE_SENDER_ID" }
$appId = if ($configStr -match 'appId": "(.*?)"') { $Matches[1] } else { "REPLACE_APP_ID" }

$envContent = @"
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
VITE_FIREBASE_APP_ID=$appId
VITE_API_ORIGIN=https://$DOMAIN
"@

Write-Host "   Writing .env.production files..."
$envContent | Set-Content "apps/crm-client/.env.production" -Force
$envContent | Set-Content "apps/landing-web/.env.production" -Force

# ----------------------------------------------------------------------
# 5. BUILD & MERGE
# ----------------------------------------------------------------------
Write-Host "`n[5/6] 🏗️  Building & Merging..." -ForegroundColor Magenta

Write-Host "   Running Turbo Build..."
pnpm turbo run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed."; exit 1 }

Write-Host "   Creating Unified Dist..."
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
New-Item -ItemType Directory -Path "dist" | Out-Null
New-Item -ItemType Directory -Path "dist/app" | Out-Null

# Copy Landing (Root)
Write-Host "   Copying Landing Page -> root"
Copy-Item "apps/landing-web/dist/*" "dist/" -Recurse -Force

# Copy CRM (/app)
Write-Host "   Copying CRM -> /app"
Copy-Item "apps/crm-client/dist/*" "dist/app/" -Recurse -Force

# ----------------------------------------------------------------------
# 6. DEPLOY
# ----------------------------------------------------------------------
Write-Host "`n[6/6] 🚀 Deploying to Production..." -ForegroundColor Magenta

firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) { Write-Error "Deploy failed."; exit 1 }

Print-Header
Write-Host "`n✅  SUCCESS! Application is live at: https://$DOMAIN" -ForegroundColor Green
Write-Host "   - Landing Page: https://$DOMAIN/"
Write-Host "   - CRM App:      https://$DOMAIN/app/"
Write-Host "`n   (DNS propagation might take up to 24h if domain is new)"
