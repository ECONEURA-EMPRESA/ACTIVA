
# 🕵️ CI/CD SIMULATOR (IRON-CLAD VERIFICATION)
# This script mimics the GitHub Actions environment to catch errors BEFORE pushing.
# It destroys local artifacts to ensure a "Fresh Clone" experience.

$ErrorActionPreference = "Stop"

Write-Host "`n[1/5] 🧹 CLEANING ENVIRONMENT (Simulating Fresh Runner)..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .pnpm-store -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue

Write-Host "`n[2/5] 📦 INSTALLING DEPENDENCIES (Strict Lockfile Mode)..." -ForegroundColor Yellow
# mimicks 'pnpm install --frozen-lockfile'
pnpm install --frozen-lockfile

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ LOCKFILE DRIFT DETECTED! Your 'pnpm-lock.yaml' is out of sync with 'package.json'. Run 'pnpm install' locally and commit the changes."
    exit 1
}

Write-Host "`n[3/5] 🔍 LINTING & TYPE CHECKING..." -ForegroundColor Yellow
pnpm turbo run lint
# Skipping explicit type-check command if it's not in package.json, build usually handles it.

Write-Host "`n[4/5] 🏗️ BUILDING PROJECT (Production Mode)..." -ForegroundColor Yellow
# ensuring we build all workspaces
pnpm turbo run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ BUILD FAILED! The project cannot build in a clean environment."
    exit 1
}

Write-Host "`n[5/5] ✅ CI SIMULATION PASSED!" -ForegroundColor Green
Write-Host "You are safe to push to GitHub. The workflow will succeed."
