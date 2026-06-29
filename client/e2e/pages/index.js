// ─── LoginPage POM ────────────────────────────────────────────────────────────
export class LoginPage {
  constructor(page) {
    this.page         = page;
    this.emailInput   = page.getByPlaceholder(/email/i);
    this.passwordInput = page.getByPlaceholder(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in/i });
  }

  async goto()                      { await this.page.goto('/login'); }
  async fillEmail(email)            { await this.emailInput.fill(email); }
  async fillPassword(password)      { await this.passwordInput.fill(password); }
  async submit()                    { await this.submitButton.click(); }

  async loginAs(email, password) {
    await this.goto();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}

// ─── DashboardPage POM ───────────────────────────────────────────────────────
export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /welcome/i });
  }

  async waitForLoad() {
    await this.page.waitForURL('**/dashboard**');
    await this.heading.waitFor({ timeout: 10000 });
  }

  async navigateTo(section) {
    await this.page.getByRole('link', { name: new RegExp(section, 'i') }).click();
  }
}

// ─── ClientsPage POM ─────────────────────────────────────────────────────────
export class ClientsPage {
  constructor(page) {
    this.page           = page;
    this.newClientBtn   = page.getByRole('button', { name: /new client/i });
    this.nameInput      = page.getByPlaceholder(/Rihad Gali/i);
    this.emailInput     = page.getByPlaceholder(/riho@company\.com/i);
    this.companyInput   = page.getByPlaceholder(/company name/i);
    this.submitBtn      = page.getByRole('button', { name: /create client/i });
  }

  async goto()                    { await this.page.goto('/dashboard/clients'); }
  async openCreateModal()         { await this.newClientBtn.click(); }
  async fillName(name)            { await this.nameInput.fill(name); }
  async fillEmail(email)          { await this.emailInput.fill(email); }
  async fillCompany(company)      { await this.companyInput.fill(company); }
  async submit()                  { await this.submitBtn.click(); }

  async createClient({ name, email, company }) {
    await this.openCreateModal();
    await this.fillName(name);
    await this.fillEmail(email);
    if (company) await this.fillCompany(company);
    await this.submit();
  }

  clientRowLocator(name) {
    return this.page.getByRole('row').filter({ hasText: name });
  }
}