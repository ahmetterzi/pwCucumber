import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Page } from 'playwright';

class CustomWorld extends World {
  page!: Page;

  constructor(options: any) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

export { CustomWorld };