import { Page } from 'playwright';
import { logger } from '../utils/logger';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    if (!page) {
      throw new Error('Page object is not defined. Ensure it is initialized properly.');
    }
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  async enterUsername(username: string): Promise<void> {
    await this.page.fill('#username', username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.fill('#password', password);
  }

  async clickSubmitByText(buttonText: string): Promise<void> {
    const locator = this.page.locator(`//button[text()='${buttonText}']`);
    await locator.click();
    logger.info('Element clicked')
  }

  async verifyTextVisible(expectedText: string): Promise<void> {
    const locator = this.page.locator('.post-title');
    await locator.waitFor({ state: 'visible' });
    const actualText = await locator.textContent();
    if (!actualText?.includes(expectedText)) {
      throw new Error(`Expected text "${expectedText}" not found. Actual: "${actualText}"`);
    }
  }
}