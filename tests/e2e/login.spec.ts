import { test, expect } from '@playwright/test';

// Utilizamos un test independiente que no use el storageState para probar la página de login per se.
test.describe('Autenticación y Redirecciones', () => {
  // Sobrescribimos el uso del storageState global para estos tests específicos
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Debe redirigir al login si el usuario no está autenticado y entra al dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Debería ser redirigido a la página de login
    await expect(page).toHaveURL(/.*\/iniciar-sesion/);
  });

  test('Debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/iniciar-sesion');
    
    await page.fill('input[name="email"]', 'usuario_inexistente@test.com');
    await page.fill('input[name="password"]', 'contrasenaIncorrecta123');
    await page.click('button[type="submit"]');

    // Esperar mensaje de error
    // Dependiendo de tu UI, busca un texto o clase específica. Aquí usamos un texto genérico de error de Supabase/App
    await expect(page.locator('text=credenciales')).toBeVisible({ timeout: 5000 }).catch(() => {
      // Fallback a buscar 'inválido' u 'incorrecto'
      return expect(page.locator('text=inválid')).toBeVisible();
    });
  });

  test('Debe permitir el inicio de sesión y navegar al Dashboard', async ({ page }) => {
    const email = process.env.E2E_TEST_EMAIL || 'test@habitapp.com';
    const password = process.env.E2E_TEST_PASSWORD || 'password123';

    await page.goto('/iniciar-sesion');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
