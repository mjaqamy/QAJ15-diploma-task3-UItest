import { Locator, Page } from '@playwright/test';
import { BasePage } from './base_page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly emailRequiredMessage: Locator;
  readonly passwordRequiredMessage: Locator;
  readonly regLink: Locator;
  readonly eyeButton: Locator;
  readonly chatButton: Locator;
  readonly chatWindow: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('input[value="Login"]');
    this.errorMessage = page.locator('.alert-danger');
    this.emailRequiredMessage = page.locator('[data-test="email-error"]');
    this.passwordRequiredMessage = page.locator('[data-test="password-error"]');
    this.regLink = page.locator('[data-test="register-link"]');
    this.eyeButton = page.locator('.input-group-append');
    this.chatButton = page.locator('[data-test="chat-toggle"]');
    this.chatWindow = page.locator('[data-test="chat-window"]');
  }

  async openLoginPage() {
    await this.open('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
