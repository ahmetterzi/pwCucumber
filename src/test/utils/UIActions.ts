import { Page } from 'playwright';

export class UIActions {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickByText(buttonText: string): Promise<void> {
    // Using XPath to locate the button by its text
    const locator = this.page.locator(`//button[text()='${buttonText}']`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }
}