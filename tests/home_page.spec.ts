import { test, expect } from '@playwright/test';
import { PageFactory } from '../factory/page_factory';
import { HomePage } from '../pages/home_page';

test.describe('Home Page Tests', () => {
  let homePage: HomePage;
  const productForSearch = 'Long Nose Pliers';
  const invalidProduct = '123456789k';

  test.beforeEach(async ({ page }) => {
    homePage = PageFactory.homePage(page);
    await homePage.openHomePage();
  });

  test('Поиск товара по полному названию', async () => {
    await expect(homePage.searchInput).toHaveAttribute('placeholder', 'Search');
    await homePage.searchInput.fill(productForSearch);
    await homePage.searchSubmitBtn.click();
    await expect(homePage.searchResultsHeader).toHaveText(`Searched for: ${productForSearch}`);
    await expect(homePage.firstProductTitle).toHaveText(productForSearch);
  });

  test('Поиск несуществующего товара', async () => {
    await homePage.searchInput.fill(invalidProduct);
    await homePage.searchSubmitBtn.click();
    await expect(homePage.searchResultsHeader).toHaveText(`Searched for: ${invalidProduct}`);
    await expect(homePage.searchNoResult).toHaveText('There are no products found.');
  });

  test('Переход на страницу товара ', async ({ page }) => {
    await homePage.openFirstProduct();
    await expect(page).toHaveURL(/product/);
  });

  test('Сортировка товаров по имени от А до Я', async () => {
    await homePage.sortSelect.selectOption('name,asc');
    await expect(homePage.sortSelect).toHaveValue('name,asc');
    await expect(homePage.firstProductTitle.first()).toHaveText('Adjustable Wrench');
  });

  test('Выбор категории фильтра Power Tools', async () => {
    const firstProductBeforeFilter = await homePage.firstProductTitle.textContent();
    await homePage.categoryPowerToolsCheckbox.check();
    await expect(homePage.categoryPowerToolsCheckbox).toBeChecked();
    await expect(homePage.firstProductTitle).toBeVisible();
    await expect(homePage.firstProductTitle).not.toHaveText(firstProductBeforeFilter || '');
  });

  test('Фильтрация товаров по Price Range', async () => {
    const firstProductBeforeFilter = await homePage.firstProductTitle.textContent();
    const startValue = await homePage.priceRangePointMin.getAttribute('aria-valuenow');
    await homePage.priceRangePointMin.click();
    await homePage.priceRangePointMin.press('PageUp');
    await expect(homePage.priceRangePointMin).not.toHaveAttribute(
      'aria-valuenow',
      startValue || '0',
    );
    await expect(homePage.firstProductTitle).toBeVisible();
    await expect(homePage.firstProductTitle).not.toHaveText(firstProductBeforeFilter || '');
  });

  test('Переход на вторую страницу по клику на цифру 2', async () => {
    const firstProductOnFirstPage = await homePage.firstProductTitle.textContent();
    await homePage.pageNumTwoBtn.click();
    await expect(homePage.firstProductTitle).toBeVisible();
    await expect(homePage.firstProductTitle).not.toHaveText(firstProductOnFirstPage || '');
  });

  test('Переключение на следующую страницу через пагинацию', async () => {
    const firstProductOnFirstPage = await homePage.firstProductTitle.textContent();
    await homePage.paginationNext.click();
    await expect(homePage.firstProductTitle).toBeVisible();
    await expect(homePage.firstProductTitle).not.toHaveText(firstProductOnFirstPage || '');
    await expect(homePage.paginationPrevious).not.toHaveAttribute('class', /disabled/);
  });

  test('Возврат на первую страницу каталога кнопкой Previous', async () => {
    await homePage.paginationNext.click();
    await expect(homePage.firstProductTitle).toBeVisible();
    const firstProductOnSecondPage = await homePage.firstProductTitle.textContent();
    await homePage.paginationPrevious.click();
    await expect(homePage.firstProductTitle).toBeVisible();
    await expect(homePage.firstProductTitle).not.toHaveText(firstProductOnSecondPage || '');
    await expect(homePage.paginationPrevious).toHaveAttribute('class', /disabled/);
  });

  test('Добавление двуx товаров в сравнение и переход к сравнению', async ({ page }) => {
    await homePage.compareBtnFirst.click();
    await expect(homePage.compareBtnFirst).toHaveAttribute('aria-pressed', 'true');
    await expect(homePage.comparisonBar).toBeVisible();
    await expect(homePage.comparisonBar).toHaveText(/1 product\(s\) selected/);
    await homePage.compareBtnSecond.click();
    await expect(homePage.compareBtnSecond).toHaveAttribute('aria-pressed', 'true');
    await expect(homePage.comparisonBar).toHaveText(/2 product\(s\) selected/);
    await homePage.compareNowBtn.click();
    await expect(page).toHaveURL(/\/comparison$/);
  });
});
