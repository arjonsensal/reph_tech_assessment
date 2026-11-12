import { test } from '../../fixtures/pageFixtures';

test.describe('Validation of logo and login button is displayed', {tag: "@test1"}, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Validate Cheapflights brand logo display and positioning', async ({ homePage }) => {
    await homePage.verifyLogoVisibility();
  });

  test('Validate Sign In / Login button visibility and positioning', async ({ homePage }) => {
    await homePage.verifyLoginButton();
  });
});
