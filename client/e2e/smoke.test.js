import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage, ClientsPage } from './pages/index.js';

// ─── Credentials (use test account or .env.test) ──────────────────────────────
const ADMIN_EMAIL    = process.env.TEST_ADMIN_EMAIL    || 'admin@skilvatech.com';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'SuperAdmin123!';

// ─── Auth smoke tests ─────────────────────────────────────────────────────────
test.describe('Authentication', () => {

  test('public home page is accessible without login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SkilVaTech/i);
    await expect(page.getByRole('heading', { name: /build the future/i })).toBeVisible();
  });

  test('login page renders correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('shows error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs('wrong@example.com', 'WrongPassword!');
    // Error message should appear and we should stay on login
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/invalid|incorrect|unauthorized/i)).toBeVisible();
  });

  test('redirects unauthenticated user from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('admin can log in and reach the dashboard', async ({ page }) => {
    const loginPage    = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginAs(ADMIN_EMAIL, ADMIN_PASSWORD);
    await dashboardPage.waitForLoad();

    await expect(page).toHaveURL(/dashboard/);
    await expect(dashboardPage.heading).toBeVisible();
  });
});

// ─── Dashboard smoke tests ────────────────────────────────────────────────────
test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL('**/dashboard**');
  });

  test('shows stat cards on the dashboard', async ({ page }) => {
    await expect(page.getByText(/total users/i)).toBeVisible();
    await expect(page.getByText(/courses/i)).toBeVisible();
    await expect(page.getByText(/clients/i)).toBeVisible();
    await expect(page.getByText(/open tickets/i)).toBeVisible();
  });

  test('sidebar navigation links are visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /clients/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /courses/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /tickets/i })).toBeVisible();
  });

  test('notification bell is visible in topbar', async ({ page }) => {
    await expect(page.locator('header svg').first()).toBeVisible();
  });
});

// ─── Public pages smoke tests ─────────────────────────────────────────────────
test.describe('Public pages', () => {

  test('navbar links render on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /services/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /courses/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /pricing/i }).first()).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /tech leaders/i })).toBeVisible();
  });

  test('services page loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: /professional.*services/i })).toBeVisible();
  });

  test('courses page loads and shows filter buttons', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('button', { name: /all levels/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /beginner/i })).toBeVisible();
  });

  test('pricing page loads with monthly/yearly toggle', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('button', { name: /monthly/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /yearly/i })).toBeVisible();
  });

  test('contact page shows the contact form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByPlaceholder(/john doe/i)).toBeVisible();
    await expect(page.getByPlaceholder(/your@company\.com|you@company\.com/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('FAQ page loads and accordion works', async ({ page }) => {
    await page.goto('/faq');
    // First question should be visible
    const firstQuestion = page.getByRole('button', { name: /how do i get started/i });
    await expect(firstQuestion).toBeVisible();
    // Click to expand
    await firstQuestion.click();
    await expect(page.getByText(/create a free account/i)).toBeVisible();
  });
});

// ─── CRM critical path ────────────────────────────────────────────────────────
test.describe('CRM — Clients', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL('**/dashboard**');
  });

  test('can navigate to clients page', async ({ page }) => {
    await page.getByRole('link', { name: /clients/i }).click();
    await expect(page).toHaveURL(/clients/);
    await expect(page.getByRole('heading', { name: /clients/i })).toBeVisible();
  });

  test('can open the new client modal and type without losing focus', async ({ page }) => {
    const clientsPage = new ClientsPage(page);
    await clientsPage.goto();
    await clientsPage.openCreateModal();

    // This is the core typing regression test — type a full name
    await clientsPage.nameInput.fill('Test Company');
    // Value should be exactly what we typed — no focus loss
    await expect(clientsPage.nameInput).toHaveValue('Test Company');

    await clientsPage.emailInput.fill('test@company.com');
    await expect(clientsPage.emailInput).toHaveValue('test@company.com');
  });

  test('full CRUD: create, see in table, delete client', async ({ page }) => {
    const clientsPage = new ClientsPage(page);
    await clientsPage.goto();

    const testName  = `E2E Client ${Date.now()}`;
    const testEmail = `e2e-${Date.now()}@example.com`;

    // Create
    await clientsPage.createClient({ name: testName, email: testEmail, company: 'E2E Corp' });

    // Should appear in table
    await expect(clientsPage.clientRowLocator(testName)).toBeVisible({ timeout: 8000 });

    // Delete
    const row = clientsPage.clientRowLocator(testName);
    await row.getByRole('button', { name: /delete/i }).click();

    // Confirm dialog
    await page.getByRole('button', { name: /confirm/i }).click();

    // Should be gone
    await expect(clientsPage.clientRowLocator(testName)).not.toBeVisible({ timeout: 8000 });
  });
});