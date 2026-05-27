import { Locator, Page } from '@playwright/test';
import { BasePage } from './base_page';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchResultsHeader: Locator;
  readonly searchSubmitBtn: Locator;
  readonly searchNoResult: Locator;
  readonly searchResetBtn: Locator;
  readonly firstProductName: Locator;
  readonly categoriesButton: Locator;
  readonly cartButton: Locator;
  readonly sortSelect: Locator;
  readonly firstProductLink: Locator;
  readonly secondProductLink: Locator;
  readonly compareBtnFirst: Locator;
  readonly compareBtnSecond: Locator;
  readonly comparisonBar: Locator;
  readonly compareNowBtn: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrevious: Locator;
  readonly categoryPowerToolsCheckbox: Locator;
  readonly pageNumTwoBtn: Locator;
  readonly priceRangePointMin: Locator;
  readonly addToCartBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchSubmitBtn = page.locator('[data-test="search-submit"]');
    this.searchResultsHeader = page.locator('[data-test="search-caption"]');
    this.searchNoResult = page.locator('[data-test="no-results"]');
    this.firstProductName = page.locator('[data-test="product-name"]').first();
    this.categoriesButton = page.getByText('Categories');
    this.cartButton = page.locator('[data-test="nav-cart"]');
    this.searchResetBtn = page.locator('[data-test="search-reset"]');
    this.sortSelect = page.locator('[data-test="sort"]');
    this.firstProductLink = page.locator('a[href*="/product/"]').first();
    this.secondProductLink = page.locator('a[href*="/product/"]').nth(1);
    this.compareBtnFirst = page.locator('[data-test="compare-btn"]').first();
    this.compareBtnSecond = page.locator('[data-test="compare-btn"]').nth(1);
    this.comparisonBar = page.locator('[data-test="comparison-bar"]');
    this.compareNowBtn = page.locator('[data-test="compare-link"]');
    this.paginationNext = page.locator('li:has([data-test="pagination-next"])');
    this.paginationPrevious = page.locator('li:has([data-test="pagination-prev"])');
    this.pageNumTwoBtn = page.getByLabel('Page-2');
    this.categoryPowerToolsCheckbox = page.getByRole('checkbox', { name: 'Power Tools' });
    this.priceRangePointMin = page.locator('.ngx-slider-pointer-min');
    this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
  }

  async openHomePage() {
    await this.open('/');
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
  }

  async openFirstProduct() {
    await this.firstProductLink.click();
  }

  async openCart() {
    await this.cartButton.click();
  }
}
