import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Homepage
 */
export class HomePage extends BasePage {
  /**
   * Selectors for elements on the page
   */
  private readonly TITLE_SELECTOR = 'body';
  private readonly NAV_LINKS = 'a';

  /**
   * @param page Playwright page
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the page title from document
   * @returns Promise with the page title
   */
  async getTitle(): Promise<string> {
    await this.page.waitForLoadState('domcontentloaded');
    return this.page.title();
  }

  /**
   * Check if any navigation links exist on the page
   * @returns Promise with boolean indicating if links exist
   */
  async hasNavigationLinks(): Promise<boolean> {
    const links = this.getLocator(this.NAV_LINKS);
    const count = await links.count();
    return count > 0;
  }

  /**
   * Click on a navigation link by index
   * @param index Index of the navigation link to click
   */
  async clickNavigationLink(index: number): Promise<void> {
    const navLinks = this.getLocator(this.NAV_LINKS);
    const count = await navLinks.count();
    
    if (index >= count) {
      throw new Error(`Navigation link at index ${index} does not exist. Only ${count} links are available.`);
    }
    
    await navLinks.nth(index).click();
  }
} 