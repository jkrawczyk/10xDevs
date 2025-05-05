import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Homepage
 */
export class HomePage extends BasePage {
  /**
   * Selectors for elements on the page
   */
  private readonly HEADER_SELECTOR = 'header';
  private readonly APP_TITLE_SELECTOR = 'header div.text-lg';
  private readonly USER_NAV_SELECTOR = 'header > div > :nth-child(3)';
  private readonly TEXT_INPUT_SELECTOR = 'textarea';
  private readonly CHARACTER_COUNT_SELECTOR = 'form p.text-sm';
  private readonly STYLE_SELECTOR = 'form [role="tablist"], form div:has(button[data-state])';
  private readonly FORMAL_STYLE_SELECTOR = 'button:has-text("Formal"), [data-value="formal"], [data-state="active"]:first-child';
  private readonly NATURAL_STYLE_SELECTOR = 'button:has-text("Natural"), [data-value="natural"], [data-state="active"]:last-child';
  private readonly SUBMIT_BUTTON_SELECTOR = 'form button';
  private readonly RESULTS_SECTION_SELECTOR = 'div.card, div[class*="card"]';
  private readonly CORRECTED_TEXT_CARD_SELECTOR = 'div.card:first-child, div[class*="card"]:first-child';
  private readonly EDUCATIONAL_NOTES_CARD_SELECTOR = 'div.card:nth-child(2), div[class*="card"]:nth-child(2)';
  private readonly COPY_TEXT_BUTTON_SELECTOR = 'button:has-text("Copy text"), button:has-text("Copy")';
  private readonly ACCEPT_CORRECTION_BUTTON_SELECTOR = 'button:has-text("Accept correction"), button:has-text("Accept")';
  private readonly COPY_NOTES_BUTTON_SELECTOR = 'button:has-text("Copy notes")';
  private readonly ERROR_ALERT_SELECTOR = '[role="alert"], div.alert-destructive';

  /**
   * @param page Playwright page
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the application title from header
   * @returns Promise with the app title text
   */
  async getAppTitle(): Promise<string> {
    const titleElement = this.getLocator(this.APP_TITLE_SELECTOR);
    const text = await titleElement.textContent();
    return text || '';
  }

  /**
   * Check if the user navigation is present
   * @returns Promise with boolean indicating if user nav exists
   */
  async hasUserNavigation(): Promise<boolean> {
    const userNav = this.getLocator(this.USER_NAV_SELECTOR);
    return await userNav.count() > 0;
  }

  /**
   * Enter text in the textarea
   * @param text Text to enter
   */
  async enterText(text: string): Promise<void> {
    const textarea = this.getLocator(this.TEXT_INPUT_SELECTOR);
    await textarea.fill(text);
  }

  /**
   * Get the current character count from the counter
   * @returns Promise with the character count text
   */
  async getCharacterCount(): Promise<string> {
    const counter = this.getLocator(this.CHARACTER_COUNT_SELECTOR);
    const text = await counter.textContent();
    return text || '';
  }

  /**
   * Select correction style
   * @param style The style to select ('formal' or 'natural')
   */
  async selectStyle(style: 'formal' | 'natural'): Promise<void> {
    const selector = style === 'formal' ? this.FORMAL_STYLE_SELECTOR : this.NATURAL_STYLE_SELECTOR;
    await this.getLocator(selector).click();
  }

  /**
   * Get the current selected style
   * @returns Promise with the current selected style
   */
  async getSelectedStyle(): Promise<string> {
    try {
      const formalTab = this.getLocator(this.FORMAL_STYLE_SELECTOR);
      const naturalTab = this.getLocator(this.NATURAL_STYLE_SELECTOR);
      
      const isFormalSelected = await formalTab.getAttribute('aria-selected') === 'true' || 
                             await formalTab.getAttribute('data-state') === 'active';
      const isNaturalSelected = await naturalTab.getAttribute('aria-selected') === 'true' || 
                              await naturalTab.getAttribute('data-state') === 'active';
      
      return isFormalSelected ? 'formal' : (isNaturalSelected ? 'natural' : 'formal');
    } catch (error) {
      return 'formal';
    }
  }

  /**
   * Click the submit/generate button
   */
  async clickSubmitButton(): Promise<void> {
    await this.getLocator(this.SUBMIT_BUTTON_SELECTOR).click();
  }

  /**
   * Get submit button text
   * @returns Promise with the submit button text
   */
  async getSubmitButtonText(): Promise<string> {
    const button = this.getLocator(this.SUBMIT_BUTTON_SELECTOR);
    const text = await button.textContent();
    return text || '';
  }

  /**
   * Check if results section is visible
   * @returns Promise with boolean indicating if results section is visible
   */
  async hasResultsSection(): Promise<boolean> {
    await this.page.waitForTimeout(500);
    try {
      const results = this.getLocator(this.RESULTS_SECTION_SELECTOR);
      return await results.count() > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get corrected text from results
   * @returns Promise with the corrected text
   */
  async getCorrectedText(): Promise<string> {
    try {
      const textCard = this.getLocator(`${this.CORRECTED_TEXT_CARD_SELECTOR} p`);
      const text = await textCard.textContent();
      return text || '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Get educational notes from results
   * @returns Promise with the educational notes
   */
  async getEducationalNotes(): Promise<string> {
    try {
      const notesCard = this.getLocator(`${this.EDUCATIONAL_NOTES_CARD_SELECTOR} p`);
      const text = await notesCard.textContent();
      return text || '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Click the copy text button
   */
  async clickCopyTextButton(): Promise<void> {
    await this.getLocator(this.COPY_TEXT_BUTTON_SELECTOR).click();
  }

  /**
   * Click the accept correction button
   */
  async clickAcceptCorrectionButton(): Promise<void> {
    await this.getLocator(this.ACCEPT_CORRECTION_BUTTON_SELECTOR).click();
  }

  /**
   * Check if textarea is disabled
   * @returns Promise with boolean indicating if textarea is disabled
   */
  async isTextareaDisabled(): Promise<boolean> {
    const textarea = this.getLocator(this.TEXT_INPUT_SELECTOR);
    return await textarea.isDisabled();
  }

  /**
   * Check if error message is displayed
   * @returns Promise with boolean indicating if error is displayed
   */
  async hasErrorMessage(): Promise<boolean> {
    try {
      const alert = this.getLocator(this.ERROR_ALERT_SELECTOR);
      return await alert.isVisible();
    } catch (error) {
      return false;
    }
  }
} 