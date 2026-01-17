import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
    });

    test('should display key branding elements', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /MÉTODO/i })).toBeVisible();
        await expect(page.getByText('Clinical SaaS v2.0')).toBeVisible();
    });

    test('should validate empty form submission', async ({ page }) => {
        // Click submit without typing
        await page.getByRole('button', { name: /Entrar al Sistema/i }).click();

        // HTML5 validation or Browser validation might trigger, but let's check if we remain on page
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should allow access via Demo Mode', async ({ page }) => {
        // Click Demo Button
        const demoButton = page.getByRole('button', { name: /Acceso Demo \/ Auditoría/i });
        await expect(demoButton).toBeVisible();
        await demoButton.click();

        // Verification: Should navigate away from login
        // We expect to land on the dashboard or patients list
        await expect(page).not.toHaveURL(/\/auth\/login/);

        // Check for a dashboard element (e.g., "Pacientes" or "Dashboard")
        // Note: Since we are in a monorepo, we might need to be robust about what loads first.
        // Based on App.tsx, likely '/patients' or '/'
    });

});
