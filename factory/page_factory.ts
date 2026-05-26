import { Page } from '@playwright/test';

import { LoginPage } from '../pages/login_page';
import { HomePage } from '../pages/home_page';

export class PageFactory {
  static loginPage(page: Page) {
    return new LoginPage(page);
  }
  
  static homePage(page: Page) {
    return new HomePage(page);
  }
}