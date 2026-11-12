import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { FlightResultPage } from '../pages/flight-result-page';

type PageFixtures = {
  homePage: HomePage;
  flightResultPage: FlightResultPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  flightResultPage: async ({ page }, use) => {
    await use(new FlightResultPage(page));
  },
});

export { expect };
