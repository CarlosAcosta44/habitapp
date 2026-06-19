import { test, expect } from '@playwright/test';

test.describe('Perfil de Usuario', () => {
  // Estos tests asumen estado de sesión activo (auth.setup.ts)
  
  test('Debe cargar el dashboard de perfil mostrando las estadísticas básicas', async ({ page }) => {
    await page.goto('/perfil');
    
    // Verificar que existen los elementos clave de la página de perfil
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Validar visualmente la existencia de la tarjeta de nivel/puntos
    await expect(page.locator('text=Nivel').first()).toBeVisible();
  });

  test('Debe poder navegar al formulario de edición de perfil', async ({ page }) => {
    await page.goto('/perfil');
    
    // En AjustesClient se cambió recientemente para apuntar a /perfil/editar
    // Pero si estamos en /perfil directo, puede haber un botón "Editar Perfil"
    // Buscamos un enlace hacia ajustes o editar
    const editLink = page.locator('a[href*="/editar"], a[href="/ajustes"]').first();
    await editLink.click();

    // Si navegó a ajustes, debería haber otra navegación a /perfil/editar
    if (page.url().includes('/ajustes')) {
      await page.click('text=Editar Perfil');
    }

    await expect(page).toHaveURL(/.*\/perfil\/editar/);
  });

  test('Debe poder editar el nombre y apellido en el perfil', async ({ page }) => {
    await page.goto('/perfil/editar');
    
    const timestamp = Date.now().toString().slice(-4);
    const newName = `TestName${timestamp}`;

    await page.fill('input[name="nombre"]', newName);
    
    // Hacer clic en Guardar Cambios
    await page.click('button[type="submit"]');

    // Esperar mensaje de éxito
    await expect(page.locator('text=actualizado')).toBeVisible({ timeout: 8000 });
  });
});
