import { Locator, Page } from '@playwright/test';
import { BasePage } from './base_page';

export class CartPage extends BasePage {
  readonly firstProductInCartTitle: Locator;
  readonly productQuantity: Locator;
  readonly productPriceInCart: Locator;
  readonly removeProductBtn: Locator;
  readonly priceInProduct: Locator;
  readonly totalPrice: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutBtn1: Locator;
  readonly proceedToCheckoutBtn2: Locator;
  readonly proceedToCheckoutBtn3: Locator;
  readonly homeLink: Locator;
  readonly alertMessage: Locator;
  readonly continueShopping: Locator;
  readonly stepCartIndicator: Locator;
  readonly stepSignInIndicator: Locator;
  readonly stepAddressIndicator: Locator;
  readonly stepPaymentIndicator: Locator;
  readonly houseNumber: Locator;
  readonly paymentMethodSelect: Locator;
  readonly giftCardNumber: Locator;
  readonly validationCodeGifCard: Locator;
  readonly confirmOrderBtn: Locator;
  readonly successOrderMessage: Locator;
  readonly loginStatusMessage: Locator;
  readonly successMessage: Locator;
  readonly addressLoader: Locator;
  readonly streetInput: Locator;

  constructor(page: Page) {
    super(page);

    this.firstProductInCartTitle = page.locator('[data-test="product-title"]');
    this.productQuantity = page.locator('[data-test="product-quantity"]');
    this.productPriceInCart = page.locator('[data-test="product-price"]');
    this.priceInProduct = page.locator('.price-section');
    this.removeProductBtn = page.locator('.btn-danger').first();
    this.totalPrice = page.locator('[data-test="cart-total"]');
    this.emptyCartMessage = page.locator('.wizard-steps.horizontal p.ng-star-inserted');
    this.proceedToCheckoutBtn1 = page.locator('[data-test="proceed-1"]');
    this.proceedToCheckoutBtn2 = page.locator('[data-test="proceed-2"]');
    this.proceedToCheckoutBtn3 = page.locator('[data-test="proceed-3"]');
    this.homeLink = page.locator('[data-test="nav-home"]');
    this.alertMessage = page.locator('[role="alert"]').last();
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
    this.stepCartIndicator = page.locator('ul.steps-indicator > li').nth(0);
    this.stepSignInIndicator = page.locator('ul.steps-indicator > li').nth(1);
    this.stepAddressIndicator = page.locator('ul.steps-indicator > li').nth(2);
    this.stepPaymentIndicator = page.locator('ul.steps-indicator > li').nth(3);
    this.houseNumber = page.locator('[data-test="house_number"]');
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.giftCardNumber = page.locator('[data-test="gift_card_number"]');
    this.validationCodeGifCard = page.locator('[data-test="validation_code"]');
    this.confirmOrderBtn = page.locator('[data-test="finish"]');
    this.successOrderMessage = page.locator('[data-test="payment-success-message"]');
    this.loginStatusMessage = page.locator('app-login p').first();
    this.successMessage = page.locator('[id="order-confirmation"]');
    this.addressLoader = page.locator('[data-test="postcode-lookup-loading"]');
    this.streetInput = page.locator('[data-test="street"]');
  }

  /**
   * Метод для быстрого изменения количества конкретного товара
   * @param quantity Количество товара (строка или число)
   */
  async changeProductQuantity(quantity: string | number) {
    await this.productQuantity.fill(quantity.toString());
    await this.productQuantity.press('Enter');
  }
}
