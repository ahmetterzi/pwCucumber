import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

let browser: Browser;
const SCREENSHOT_DIR = path.resolve('reports/screenshots');

BeforeAll(async function () {
  try {
    console.log('Launching browser...');
    browser = await chromium.launch({ 
      headless: true,
      // Gerekirse ek browser launch seçenekleri
      // args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (error) {
    console.error('Browser launch error:', error);
    throw error;
  }
});

AfterAll(async function () {
  try {
    console.log('Closing browser...');
    if (browser) {
      await browser.close();
    }
  } catch (error) {
    console.error('Browser close error:', error);
  }
});

Before(async function (this: any) {
  try {
    console.log('Setting up a new page for the scenario...');
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    context.setDefaultTimeout(10000);
    
    this.context = context;
    this.page = await context.newPage();
  } catch (error) {
    console.error('Page setup error:', error);
    throw error;
  }
});

After(async function (this: any, scenario: any) {
  try {
    console.log(`Scenario status: ${scenario.result?.status}`);
    
    // Screenshot alma
    if (scenario.result?.status === Status.FAILED) {
      console.log('Scenario failed. Taking screenshot...');
      
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
            console.log(`Screenshot saved at: ${screenshotPath}`);
          } else {
            console.error('Attach method not available');
          }
        } else {
          console.error('Page object not available for screenshot');
        }
      } catch (screenshotError) {
        console.error('Screenshot capture error:', screenshotError);
      }
    }
  } catch (error) {
    console.error('After hook error:', error);
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