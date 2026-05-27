import { test, expect } from '@playwright/test';
import { PageFactory } from '../factory/page_factory';
import { HomePage } from '../pages/home_page';
import { CartPage } from '../pages/cart_page';
import { LoginPage } from '../pages/login_page';

test.describe('Cart Page - Comprehensive Test Suite', () => {
  let homePage: HomePage;
  let cartPage: CartPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = PageFactory.homePage(page);
    cartPage = PageFactory.cartPage(page);
    loginPage = PageFactory.loginPage(page);
    await homePage.openHomePage();
  });

  test('Добавление товара в корзину из карточки, уведомление + проверка счетчика в шапке', async () => {
    await homePage.openFirstProduct();
    await homePage.addToCartBtn.click();
    await expect(cartPage.alertMessage).toBeVisible();
    await expect(cartPage.alertMessage).toHaveText('Product added to shopping cart.');
    await expect(homePage.cartButton).toHaveText('1');
  });

  test('Соответствие названия товара в карточке и внутри корзины', async ({ page }) => {
    await homePage.openFirstProduct();
    const productName = await homePage.firstProductName.textContent();
    await homePage.addToCartBtn.click();
    await homePage.openCart();
    await expect(cartPage.firstProductInCartTitle).toHaveText(productName || '');
  });

  test.describe('Тесты внутри заполненной корзины', () => {
    test.beforeEach(async () => {
      await homePage.openFirstProduct();
      await homePage.addToCartBtn.click();
      await homePage.openCart();
    });

    test('Соответствие цены товара в карточке и внутри корзины', async () => {
      const productPrice = await cartPage.priceInProduct.textContent();
      await expect(cartPage.productPriceInCart).toHaveText(productPrice || '');
    });

    test('Увеличение количества товара через инпут внутри корзины', async () => {
      const singlePriceText = await cartPage.productPriceInCart.textContent();
      const singlePrice = parseFloat(singlePriceText?.replace('$', '') || '0');

      await cartPage.changeProductQuantity(5);
      await expect(cartPage.productQuantity).toHaveValue('5');

      const expectedTotal = `$${(singlePrice * 5).toFixed(2)}`;
      await expect(cartPage.totalPrice).toHaveText(expectedTotal);
    });

    test('Расчет общей стоимости (Total) для нескольких разных товаров', async () => {
      await homePage.openHomePage();
      await homePage.secondProductLink.click();
      await homePage.addToCartBtn.click();
      await expect(cartPage.alertMessage).toBeVisible();
      await expect(cartPage.alertMessage).toHaveText('Product added to shopping cart.');
    
      await homePage.openCart();

      const firstPriceText = await cartPage.productPriceInCart.nth(0).textContent();
      const secondPriceText = await cartPage.productPriceInCart.nth(1).textContent();

      const firstPrice = parseFloat(firstPriceText?.replace('$', '') || '0');
      const secondPrice = parseFloat(secondPriceText?.replace('$', '') || '0');
      
      const expectedTotal = `$${(firstPrice + secondPrice).toFixed(2)}`;

      await expect(cartPage.totalPrice).toHaveText(expectedTotal);
      
    });

    test('Удаление товара из корзины и проверка уведомления при удалении товара из корзины', async () => {
      await cartPage.removeProductBtn.click();
      await expect(cartPage.alertMessage).toBeVisible();
      await expect(cartPage.alertMessage).toHaveText('Product deleted.');
      await expect(cartPage.firstProductInCartTitle).not.toBeVisible();
      await expect(cartPage.emptyCartMessage).toHaveText('The cart is empty. Nothing to display.');
      await expect(homePage.cartButton).not.toBeVisible();
    });

    test('Кнопка "Continue Shopping" возвращает на главную страницу без потери корзины', async ({
      page,
    }) => {
      await cartPage.continueShopping.click();
      await expect(page).toHaveURL('/');
      await expect(homePage.cartButton).toHaveText('1');
    });

    test('Оформление заказа', async ({ page }) => {
      await expect(page).toHaveURL(/checkout/);

      // 1 шаг: Корзина
      await expect(cartPage.stepCartIndicator).toHaveClass(/current/);
      await cartPage.proceedToCheckoutBtn1.click();

      // 2 шаг: Авторизация
      await expect(cartPage.stepCartIndicator).toHaveClass(/done/);
      await expect(cartPage.stepSignInIndicator).toHaveClass(/current/);
      await loginPage.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);

      await expect(cartPage.loginStatusMessage).toBeVisible();
      await expect(cartPage.loginStatusMessage).toContainText(
        'you are already logged in. You can proceed to checkout.',
      );
      await cartPage.proceedToCheckoutBtn2.click();

      // 3 шаг: Адрес
      await expect(cartPage.stepAddressIndicator).toHaveClass(/current/);
      await expect(cartPage.streetInput).not.toHaveValue('');
      await cartPage.houseNumber.fill('2');
      await expect(cartPage.houseNumber).toHaveValue('2');
      await cartPage.proceedToCheckoutBtn3.click();

      // 4 шаг: Оплата
      await expect(cartPage.stepPaymentIndicator).toHaveClass(/current/);
      await cartPage.paymentMethodSelect.selectOption('gift-card');
      await cartPage.giftCardNumber.fill('123');
      await cartPage.validationCodeGifCard.fill('123');
      await cartPage.confirmOrderBtn.click();

      // Финал
      await expect(cartPage.successOrderMessage).toBeVisible();
      await expect(cartPage.successOrderMessage).toContainText('Payment was successful');
      await cartPage.confirmOrderBtn.click();
      await expect(cartPage.successMessage).toContainText(
        'Thanks for your order! Your invoice number is',
      );
    });

    test('Кнопка "Proceed to checkout" заблокирована, если не заполнено поле с номером здания', async () => {
      await cartPage.proceedToCheckoutBtn1.click();
      await loginPage.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
      await cartPage.proceedToCheckoutBtn2.click();

      await expect(cartPage.stepAddressIndicator).toHaveClass(/current/);
      await cartPage.houseNumber.waitFor({ state: 'visible' });
      await expect(cartPage.proceedToCheckoutBtn3).toBeDisabled();
    });

    test('Ошибка авторизации на Шаге 2 при неверном пароле', async () => {
      await cartPage.proceedToCheckoutBtn1.click();
      await loginPage.login(process.env.TEST_EMAIL!, 'wrong_password_123');
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText('Invalid email or password');
      await expect(cartPage.stepAddressIndicator).not.toHaveClass(/current/);
    });
  });
});
