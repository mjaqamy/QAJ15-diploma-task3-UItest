import { Page } from '@playwright/test';

import { LoginPage } from '../pages/login_page';
import { HomePage } from '../pages/home_page';
import { CartPage } from '../pages/cart_page';

export class PageFactory {
  static loginPage(page: Page) {
    return new LoginPage(page);
  }
  
  static homePage(page: Page) {
    return new HomePage(page);
  }

  static cartPage(page: Page) {
    return new CartPage(page);
  }
}