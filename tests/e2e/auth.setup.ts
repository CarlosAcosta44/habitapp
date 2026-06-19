import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL || 'test@habitapp.com';
  const password = process.env.E2E_TEST_PASSWORD || 'password123';

  console.log(`[Setup] Autenticando con usuario: ${email}`);

  await page.goto('/iniciar-sesion');
  
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  
  await page.click('button[type="submit"]');

  // Esperar a que la navegación ocurra hacia el dashboard y el estado se consolide
  await page.waitForURL('/');
  
  // Validar que realmente estamos en el dashboard
  await expect(page.locator('h1').first()).toBeVisible();

  // Guardar el estado de la sesión (cookies, localStorage de Supabase, etc.)
  await page.context().storageState({ path: authFile });
});
