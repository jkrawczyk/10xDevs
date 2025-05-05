import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object for all pages in the application
 */
export class BasePage {
  readonly page: Page;
  
  /**
   * @param page Playwright page
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url The URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get a locator for an element
   * @param selector The selector to use
   * @returns Locator for the element
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot and compare it with the baseline
   * @param name Name of the screenshot
   */
  async verifyScreenshot(name: string): Promise<void> {
    await expect(this.page).toHaveScreenshot(`${name}.png`);
  }

  /**
   * Wait for an element to be visible
   * @param selector The selector to wait for
   */
  async waitForElement(selector: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible' });
  }
} 