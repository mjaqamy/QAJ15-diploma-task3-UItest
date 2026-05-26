import { test, expect } from '@playwright/test';
import { PageFactory } from '../factory/page_factory';
import { LoginPage } from '../pages/login_page';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = PageFactory.loginPage(page);
    await loginPage.openLoginPage();
  });
  test('Авторизация с верными email и password', async ({ page }) => {
    await loginPage.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
    await expect(page).toHaveURL(/\/account$/);
  });

  test('Авторизация с пустыми полями', async () => {
    await loginPage.login('', '');
    await expect(loginPage.emailRequiredMessage).toBeVisible();
    await expect(loginPage.emailRequiredMessage).toHaveText('Email is required');
    await expect(loginPage.passwordRequiredMessage).toBeVisible();
    await expect(loginPage.passwordRequiredMessage).toHaveText('Password is required');
  });

  test('Авторизация с неверным email', async () => {
    await loginPage.login('wrongemail@email.com', process.env.TEST_PASSWORD!);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid email or password');
  });

  test('Авторизация с неверным password', async () => {
    await loginPage.login(process.env.TEST_EMAIL!, 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid email or password');
  });

  test('Авторизация по Enter', async ({ page }) => {
    await loginPage.emailInput.fill(process.env.TEST_EMAIL!);
    await loginPage.passwordInput.fill(process.env.TEST_PASSWORD!);

    await loginPage.passwordInput.press('Enter');

    await expect(page).toHaveURL(/\/account$/);
  });

  test('Авторизация с пробелами перед и после email ', async ({ page }) => {
    await loginPage.login(`   ${process.env.TEST_EMAIL!}   `, process.env.TEST_PASSWORD!);
    await expect(page).toHaveURL(/\/account$/);
  });

  test('Переход на страницу регистрации', async ({ page }) => {
    await loginPage.regLink.click();
    await expect(page).toHaveURL(/\/auth\/register$/);
  });

  test('Пароль скрыт по умолчанию', async () => {
    await loginPage.passwordInput.fill('1234');

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('Видимость пароля (eye)', async () => {
    const password = loginPage.passwordInput;

    await loginPage.passwordInput.fill('1234');
    await expect(password).toHaveAttribute('type', 'password');

    await loginPage.eyeButton.click();
    await expect(password).toHaveAttribute('type', 'text');

    await loginPage.eyeButton.click();
    await expect(password).toHaveAttribute('type', 'password');
  });

  test('Placeholder текста отображаются корректно', async () => {
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'Your email');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Your password');
  });
});
