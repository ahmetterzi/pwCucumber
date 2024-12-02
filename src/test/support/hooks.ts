import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

let browser: Browser;
const SCREENSHOT_DIR = path.resolve('reports/screenshots');

BeforeAll(async function () {
  try {
    logger.info('Launching browser...');
    browser = await chromium.launch({ 
      headless: true,
      // Gerekirse ek browser launch seçenekleri
      // args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (error) {
    logger.error('Browser launch error:', error);
    throw error;
  }
});

AfterAll(async function () {
  try {
    logger.info('Closing browser...');
    if (browser) {
      await browser.close();
    }
  } catch (error) {
    logger.error('Browser close error:', error);
  }
});

Before(async function (this: any) {
  try {
    logger.info('Setting up a new page for the scenario...');
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    context.setDefaultTimeout(10000);
    
    this.context = context;
    this.page = await context.newPage();
  } catch (error) {
    logger.error('Page setup error:', error);
    throw error;
  }
});

After(async function (this: any, scenario: any) {
  try {
    logger.info(`Scenario status: ${scenario.result?.status}`);
    
    // Screenshot alma
    if (scenario.result?.status === Status.FAILED) {
      logger.info('Scenario failed. Taking screenshot...');
      
      // Screenshots klasörünü oluştur
      if (!fs.existsSync(SCREENSHOT_DIR)) {
        fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
      }

      // Dosya adını güvenli hale getir
      const safeScenarioName = scenario.pickle.name
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const screenshotPath = path.join(
        SCREENSHOT_DIR, 
        `${safeScenarioName}_${timestamp}.png`
      );

      try {
        // Ekran görüntüsü al
        if (this.page) {
          await this.page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
          });

          // Rapora ekle
          if (this.attach) {
            const screenshot = fs.readFileSync(screenshotPath);
            this.attach(screenshot, 'image/png');
            logger.info(`Screenshot saved at: ${screenshotPath}`);
          } else {
            logger.info('Attach method not available');
          }
        } else {
          logger.error('Page object not available for screenshot');
        }
      } catch (screenshotError) {
        logger.error('Screenshot capture error:', screenshotError);
      }
    }
  } catch (error) {
    logger.error('After hook error:', error);
  } finally {
    // Sayfa ve contexti temizle
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
  }
});