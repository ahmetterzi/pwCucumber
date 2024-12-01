import { Given, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';
import { CustomWorld } from '../support/world';

let loginPage: LoginPage;

Given('Kullanici {string} adresine gider.', async function (this: CustomWorld, url: string) {
  if (!this.page) {
    throw new Error('Page object is not initialized. Ensure hooks are properly set up.');
  }
  loginPage = new LoginPage(this.page); // Pass the page to LoginPage
  await loginPage.navigateTo(url);
});

Given('Kullanici adi {string} girilir.', async function (this: CustomWorld, username: string) {
  await loginPage.enterUsername(username);
});

Given('Sifre {string} girilir.', async function (this: CustomWorld, password: string) {
  await loginPage.enterPassword(password);
});

Given('{string} text degerine sahip butona tiklanir.', async function (this: CustomWorld, buttonText: string) {
  await loginPage.clickSubmitByText(buttonText);
});

Then('{string} yazisi gorundugu dogrulanir.', async function (this: CustomWorld, expectedText: string) {
  await loginPage.verifyTextVisible(expectedText);
});