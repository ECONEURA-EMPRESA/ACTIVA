$ErrorActionPreference = "Stop"

Write-Host "--- TITANIUM AUTO-REPAIR ---"

# 1. AUTH
Write-Host "[1/4] AUTH GOOGLE CLOUD..."
cmd /c "gcloud auth login"
cmd /c "gcloud config set project webycrm-activa"

# 2. KEY GENERATION
Write-Host "[2/4] GENERATING NEW API KEY..."
try {
    $keyName = cmd /c "gcloud services api-keys create --display-name='Titanium_Auto_Fix_v4' --format='value(name)'"
    if (-not $keyName) { throw "API Key Name not found" }
    
    $keyString = cmd /c "gcloud services api-keys get-key-string $keyName --format='value(keyString)'"
    if (-not $keyString) { throw "API Key String not found" }
    
    Write-Host "   -> NEW KEY: $keyString"
}
catch {
    Write-Warning "Failed to create key. Do you have permissions?"
    exit 1
}

# 3. INJECTION
Write-Host "[3/4] INJECTING CODE..."
$targetFile = "apps/crm-client/src/lib/firebase.ts"
$content = Get-Content $targetFile
$newString = 'apiKey: "' + $keyString + '"'
$newContent = $content -replace 'apiKey: ".*"', $newString
$newContent = $newContent -replace 'VERSION: .*', "VERSION: AUTO_REPAIR_SUCCESS"
Set-Content $targetFile $newContent
Write-Host "   -> Code updated."

# 4. DEPLOY
Write-Host "[4/4] DEPLOYING..."
Set-Location "apps/crm-client"
cmd /c "npm run build"
cmd /c "firebase deploy --only hosting"

Write-Host "--- DONE. CHECK: https://app-activamusicoterapia.web.app ---"
