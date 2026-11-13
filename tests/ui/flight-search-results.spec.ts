import { test } from '../../fixtures/pageFixtures';

const departureLocation = 'CEB';
const destinationLocation = 'MNL';
const departureDate = '12/01/2026';
const returnDate = '12/05/2026';

test.describe('Flight Search Result Validation', { tag: "@test2" }, () => {
  test.beforeEach('Go to url, and clear searches', async ({ page, homePage}) => {
    await page.goto('/');
    await homePage.clearDepartureLocations();
    await homePage.clearDestinationLocations();
  })
  test.describe('Positive Tests', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.selectOriginLocation(departureLocation);
      await homePage.selectDestinationLocation(destinationLocation);
      await homePage.selectTripType('Return');
      await homePage.selectDepartureReturnDate(departureDate, returnDate);
      await homePage.uncheckCompareCheapFlightsCheckbox();
      await homePage.clickSearchButton();
    });
    test('Validate Result grid visible', async ({ flightResultPage }) => {
      await flightResultPage.verifyFlightResultsVisible();
    });

    test('Validate Individual flight card fields', async ({ flightResultPage }) => {
      await flightResultPage.verifyFlightResultsVisible();
      await flightResultPage.verifyFlightCardDetails();
    });

    test('Validate Chepest price sorting', async ({ flightResultPage }) => {
      await flightResultPage.verifyFlightResultsVisible();
      await flightResultPage.selectPriceFilterOption('Cheapest');

      await flightResultPage.verifyFlightPricesSortedByCheapest();
    });
  });

  test.describe('Negative Tests', () => {
    test('Validate zero search result', async ({ homePage, flightResultPage, page }) => {
      const futureDeparture = new Date();
      futureDeparture.setUTCFullYear(futureDeparture.getUTCFullYear() + 1);
      futureDeparture.setUTCDate(futureDeparture.getUTCDate() - 2);
      const negativeDepartureDate = futureDeparture.toLocaleDateString('en-US', { timeZone: 'UTC' });

      await homePage.selectOriginLocation(destinationLocation);
      await homePage.selectDestinationLocation(departureLocation);
      await homePage.selectTripType('One-way');
      await homePage.selectDepartureDate(negativeDepartureDate);
      await homePage.uncheckCompareCheapFlightsCheckbox();
      await homePage.clickSearchButton();
      await flightResultPage.verifyNoFlightResults();
    });
  })
});
