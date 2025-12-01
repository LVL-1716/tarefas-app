import { test, expect } from '@playwright/test';

test.describe('Tarefas App - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
  });

  test('deve adicionar tarefa com sucesso', async ({ page }) => {
    // Preencher e submeter formulário
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Minha primeira tarefa');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Verificar se tarefa foi adicionada
    await expect(page.locator('text=Minha primeira tarefa')).toBeVisible();
    
    // Verificar toast de sucesso
    await expect(page.locator('[role="alert"]')).toContainText('adicionada com sucesso');

    // Verificar contador
    await expect(page.locator('[data-testid="total-tarefas"]')).toContainText('1');
  });

  test('deve marcar tarefa como completa', async ({ page }) => {
    // Adicionar tarefa
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa para completar');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Clicar no checkbox
    const checkbox = page.locator('button:has-text("Marcar como completa")').first();
    await checkbox.click();

    // Verificar visual
    await expect(page.locator('text=Tarefa para completar')).toHaveClass(/line-through/);
    await expect(page.locator('text=Completa')).toBeVisible();

    // Verificar contador
    await expect(page.locator('[data-testid="tarefas-completas"]')).toContainText('1');
  });

  test('deve editar título de tarefa', async ({ page }) => {
    // Adicionar tarefa
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa original');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Clicar em editar
    await page.click('button:has-text("✎")');

    // Editar título
    const input = page.locator('input[type="text"]').first();
    await input.clear();
    await input.fill('Tarefa editada');

    // Confirmar
    await page.click('button:has-text("✓")');

    // Verificar
    await expect(page.locator('text=Tarefa editada')).toBeVisible();
  });

  test('deve deletar tarefa', async ({ page }) => {
    // Adicionar tarefa
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa a deletar');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Deletar
    await page.click('button:has-text("🗑")');

    // Verificar
    await expect(page.locator('text=Nenhuma tarefa encontrada')).toBeVisible();
    await expect(page.locator('[data-testid="total-tarefas"]')).toContainText('0');
  });

  test('deve filtrar tarefas por status', async ({ page }) => {
    // Adicionar 2 tarefas
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa 1');
    await page.click('button:has-text("Adicionar Tarefa")');

    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa 2');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Marcar primeira como completa
    await page.locator('button:has-text("Marcar como completa")').first().click();

    // Filtrar por completas
    await page.click('[data-testid="filtro-completas"]');
    
    // Verificar apenas completa aparece
    await expect(page.locator('text=Tarefa 2')).not.toBeVisible();

    // Filtrar por pendentes
    await page.click('[data-testid="filtro-pendentes"]');
    await expect(page.locator('text=Tarefa 1')).not.toBeVisible();

    // Filtrar por todas
    await page.click('[data-testid="filtro-todas"]');
    await expect(page.locator('text=Tarefa 1')).toBeVisible();
    await expect(page.locator('text=Tarefa 2')).toBeVisible();
  });

  test('deve persistir tarefas no localStorage', async ({ page }) => {
    // Adicionar tarefa
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa persistida');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Recarregar página
    await page.reload();

    // Verificar se tarefa persiste
    await expect(page.locator('text=Tarefa persistida')).toBeVisible();
    await expect(page.locator('[data-testid="total-tarefas"]')).toContainText('1');
  });

  test('deve alternar entre light e dark mode', async ({ page }) => {
    const body = page.locator('body');

    // Inicialmente sem dark class
    await expect(body).not.toHaveClass(/dark/);

    // Clicar em dark mode
    await page.click('button[title="Modo Escuro"]');
    
    // Verificar se dark class foi adicionada
    await expect(page.locator('html')).toHaveClass('dark');

    // Voltar para light
    await page.click('button[title="Modo Claro"]');
    await expect(page.locator('html')).not.toHaveClass('dark');
  });

  test('deve reordenar tarefas por drag and drop', async ({ page }) => {
    // Adicionar 2 tarefas
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Primeira');
    await page.click('button:has-text("Adicionar Tarefa")');

    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Segunda');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Drag and drop
    const firstItem = page.locator('li').first();
    const secondItem = page.locator('li').nth(1);

    await firstItem.dragTo(secondItem);

    // Verificar ordem
    await expect(page.locator('li').first()).toContainText('Segunda');
    await expect(page.locator('li').nth(1)).toContainText('Primeira');
  });

  test('deve exibir múltiplas notificações toast', async ({ page }) => {
    // Adicionar tarefa (1º toast)
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa 1');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Adicionar outra (2º toast)
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'Tarefa 2');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Verificar notificações
    const toasts = page.locator('[role="alert"]');
    await expect(toasts).toHaveCount(2);
  });

  test('deve validar entrada de título mínima', async ({ page }) => {
    // Tentar adicionar com título muito curto
    await page.fill('input[placeholder="Digite o título da tarefa..."]', 'ab');
    await page.click('button:has-text("Adicionar Tarefa")');

    // Verificar mensagem de erro
    await expect(page.locator('text=pelo menos 3 caracteres')).toBeVisible();
  });
});
