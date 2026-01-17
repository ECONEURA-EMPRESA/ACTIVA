import { test, expect } from '@playwright/test';

test.describe('Patient Lifecycle Check', () => {

    // Monitor Console
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => {
            if (msg.type() === 'error') console.error(`[Console Error]: ${msg.text()}`);
        });

        // 1. Authorize via Demo Mode
        await page.goto('/auth/login');
        await page.getByRole('button', { name: /Acceso Demo/i }).click();
        await expect(page).not.toHaveURL(/\/auth\/login/);
    });

    test('should navigates to Patients and handle New Patient action (Create or Paywall)', async ({ page }) => {
        // 2. Navigate via UI to preserve State (Demo Mode is RAM-only)
        // We look for the Sidebar button corresponding to Patients.
        // Strategy: Look for the 'Users' icon which represents Patients/Groups.
        // We click the first one or try to find text if possible.
        // 'aside' targets the Sidebar.
        await page.locator('aside button:has(svg.lucide-users)').first().click();

        // 3. Wait for Patients View
        // URL verification
        await expect(page).toHaveURL(/patients/);
        // Header verification
        await expect(page.getByRole('heading', { name: /Gestión Clínica/i })).toBeVisible();

        // 4. Verify Seed Data
        const seedPatient = page.getByText('Maria García');
        await expect(seedPatient).toBeVisible({ timeout: 10000 });

        // 5. Click "Nuevo Paciente"
        const newBtn = page.getByRole('button', { name: /Nuevo Paciente/i });
        await expect(newBtn).toBeVisible();
        await newBtn.click();

        // 6. Check Logic
        const paywallHeader = page.getByRole('heading', { name: /Desbloquea tu Potencial/i });
        const createHeader = page.getByRole('heading', { name: /Nueva Admisión/i });

        // Wait for backdrop
        await expect(page.locator('.fixed.inset-0').first()).toBeVisible();

        if (await paywallHeader.isVisible()) {
            console.log('✅ Outcome: Paywall Triggered');
            await expect(paywallHeader).toBeVisible();
            await page.locator('.fixed button').first().click(); // Close
        } else if (await createHeader.isVisible()) {
            console.log('✅ Outcome: Create Modal Triggered');
            await expect(createHeader).toBeVisible();
            await page.getByRole('button', { name: /Cancelar/i }).first().click(); // Close
        } else {
            throw new Error('❌ Critical: Modal backdrop appeared but neither Paywall nor Create Header was found.');
        }
    });

});
