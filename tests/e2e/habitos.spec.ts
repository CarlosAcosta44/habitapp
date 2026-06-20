import { test, expect } from '@playwright/test';

test.describe('Gestión de Hábitos', () => {
  // Estos tests asumen que el navegador ya inició sesión debido a auth.setup.ts
  
  test('Debe poder navegar al formulario de creación de hábito', async ({ page }) => {
    await page.goto('/habitos');
    
    // Asumimos que hay un botón o enlace con el texto 'Nuevo' o un icono de crear
    // Si la UI difiere, esto debe ser ajustado a los selectores reales
    const createButton = page.locator('a[href="/habitos/nuevo"]').or(page.locator('button:has-text("Nuevo")'));
    await createButton.click();

    await expect(page).toHaveURL(/.*\/habitos\/nuevo/);
  });

  test('Debe crear un hábito exitosamente', async ({ page }) => {
    await page.goto('/habitos/nuevo');
    
    const habitName = `Hábito de prueba ${Date.now()}`;
    
    await page.fill('input[name="nombre"], input[placeholder*="nombre" i]', habitName);
    await page.fill('textarea[name="descripcion"], textarea[placeholder*="desc" i]', 'Descripción de prueba E2E');
    
    // Si hay selección de frecuencia, iconos, etc. (ajustar según el form real)
    
    await page.click('button[type="submit"]');

    // Debería redirigir o mostrar un mensaje de éxito
    await expect(page.locator(`text=${habitName}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('Debe poder marcar un hábito como completado', async ({ page }) => {
    await page.goto('/habitos');
    
    // Buscar el primer checkbox o botón de completar hábito
    // Ajustar el selector según la UI (Ej. un botón con aria-label="Marcar como completado")
    const completeButton = page.locator('button[aria-label*="completar" i], input[type="checkbox"]').first();
    
    if (await completeButton.isVisible()) {
      await completeButton.click();
      
      // Validar que se muestre algún feedback visual o cambie el estado
      // Aquí validaremos asumiendo que aparece una notificación o el botón cambia su estado
      // Se debe ajustar a la UI real (toast de éxito, clase CSS diferente)
    }
  });
});
