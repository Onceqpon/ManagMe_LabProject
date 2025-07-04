import { test, expect } from '@playwright/test';

// --- Konfiguracja i dane testowe ---
const APP_URL = 'http://localhost:5173';
const TEST_ID = `test-${Date.now()}`; // Unikalny identyfikator dla każdego przebiegu testu

const TEST_DATA = {
  project: {
    name: `Projekt E2E ${TEST_ID}`,
    newName: `Zmieniony Projekt E2E ${TEST_ID}`,
  },
  story: {
    name: `Historyjka E2E ${TEST_ID}`,
    description: 'Opis testowej historyjki.',
    newName: `Zmieniona Historyjka E2E ${TEST_ID}`,
  },
  task: {
    name: `Zadanie E2E ${TEST_ID}`,
    time: '8',
  },
};

// --- Główny blok testowy ---
test.describe('Pełny scenariusz E2E dla aplikacji ManagMe', () => {

  // Krok 1: Logowanie przed rozpoczęciem testów
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.getByLabel('Email').fill('admin@managme.app');
    await page.getByLabel('Hasło').fill('password123');
    await page.getByRole('button', { name: 'Zaloguj' }).click();
    await expect(page.getByText('Zalogowano jako: admin@managme.app')).toBeVisible();
  });

  // Krok 2: Pełny cykl życia (Create -> Update -> Delete)
  test('Powinien pozwolić na stworzenie, edycję i usunięcie projektu, historyjki i zadania', async ({ page }) => {
    
    // === SEKCJA TWORZENIA (CREATE) ===

    // Tworzenie projektu
    await page.getByPlaceholder('Nowy projekt...').fill(TEST_DATA.project.name);
    await page.locator('#add-project-form button[type="submit"]').click();
    await expect(page.locator('#project-list').getByText(TEST_DATA.project.name)).toBeVisible();

    // Tworzenie historyjki
    await page.locator('#project-list').getByText(TEST_DATA.project.name).click();
    await page.getByPlaceholder('Nazwa historyjki').fill(TEST_DATA.story.name);
    await page.getByPlaceholder('Opis').fill(TEST_DATA.story.description);
    await page.getByRole('button', { name: 'Dodaj Historyjkę' }).click();
    await expect(page.locator('#story-list-container').getByText(TEST_DATA.story.name)).toBeVisible();

    // Tworzenie zadania
    await page.getByRole('button', { name: 'Zobacz zadania' }).click();
    await page.getByPlaceholder('Nazwa zadania').fill(TEST_DATA.task.name);
    await page.getByPlaceholder('Czas (h)').fill(TEST_DATA.task.time);
    await page.getByRole('button', { name: 'Dodaj', exact: true }).click();
    await expect(page.locator('#tasks-todo')).toContainText(TEST_DATA.task.name);

    // === SEKCJA AKTUALIZACJI (UPDATE) ===

    // Edycja zadania (zmiana statusu)
    await page.locator('#tasks-todo').getByText(TEST_DATA.task.name).click();
    await page.getByLabel('Przypisz osobę').selectOption({ label: 'Anna Nowak' });
    await page.getByRole('button', { name: 'Zapisz' }).click();
    await expect(page.locator('#tasks-doing')).toContainText(TEST_DATA.task.name);

    // Edycja historyjki
    await page.getByRole('button', { name: 'Powrót do historyjek' }).click();
    const storyCard = page.locator('.card', { hasText: TEST_DATA.story.name });
    await storyCard.getByRole('button', { name: 'Edytuj historyjkę' }).click();
    await page.getByLabel('Nazwa').fill(TEST_DATA.story.newName);
    await page.getByRole('button', { name: 'Zapisz' }).click();
    await expect(page.locator('#story-list-container').getByText(TEST_DATA.story.newName)).toBeVisible();

    // Edycja projektu
    const projectItem = page.locator('.list-group-item', { hasText: TEST_DATA.project.name });
    await projectItem.getByRole('button', { name: 'Edytuj projekt' }).click();
    await page.getByLabel('Nazwa').fill(TEST_DATA.project.newName);
    await page.getByRole('button', { name: 'Zapisz' }).click();
    await expect(page.locator('#project-list').getByText(TEST_DATA.project.newName)).toBeVisible();

    // === SEKCJA USUWANIA (DELETE) ===

    // Usunięcie zadania
    const storyCardForDeletion = page.locator('.card', { hasText: TEST_DATA.story.newName });
    await storyCardForDeletion.getByRole('button', { name: 'Zobacz zadania' }).click();
    const taskCard = page.locator('.task-card', { hasText: TEST_DATA.task.name });
    await taskCard.getByRole('button', { name: 'Usuń zadanie' }).click();
    // ZMIANA: Uściślenie lokatora do modala
    await page.locator('#form-modal').getByRole('button', { name: 'Usuń' }).click();
    await expect(page.locator('#tasks-doing')).not.toContainText(TEST_DATA.task.name);

    // Usunięcie historyjki
    await page.getByRole('button', { name: 'Powrót do historyjek' }).click();
    const updatedStoryCard = page.locator('.card', { hasText: TEST_DATA.story.newName });
    await updatedStoryCard.getByRole('button', { name: 'Usuń historyjkę' }).click();
    // ZMIANA: Uściślenie lokatora do modala
    await page.locator('#form-modal').getByRole('button', { name: 'Usuń' }).click();
    await expect(page.locator('#story-list-container').getByText(TEST_DATA.story.newName)).not.toBeVisible();

    // Usunięcie projektu
    const updatedProjectItem = page.locator('.list-group-item', { hasText: TEST_DATA.project.newName });
    await updatedProjectItem.getByRole('button', { name: 'Usuń projekt' }).click();
    // ZMIANA: Uściślenie lokatora do modala
    await page.locator('#form-modal').getByRole('button', { name: 'Usuń' }).click();
    await expect(page.locator('#project-list').getByText(TEST_DATA.project.newName)).not.toBeVisible();
  });
});
