import { expect, test } from '../../fixtures/pageFixtures';

const departureLocation = 'CEB';
const destinationLocation = 'MNL';
const departureDate = '12/11/2026';
const returnDate = '12/18/2026';
test.describe('Validation of Flight Search fields', {tag: "@test3"}, () => {
  test.beforeEach(async ({ page, homePage }) => {
    await page.goto('/');
    await homePage.clearDepartureLocations();
    await homePage.clearDestinationLocations();
  });

  test('Validate Searching of a valid round-trip flight', async ({ page, homePage }) => {
    await homePage.selectTripType('Return');
    await homePage.selectOriginLocation(departureLocation);
    await homePage.selectDestinationLocation(destinationLocation);
    await homePage.selectDepartureReturnDate(departureDate, returnDate);
    await homePage.uncheckCompareCheapFlightsCheckbox();
    await homePage.clickSearchButton();

    await expect(page, `Round-trip search should navigate to ${departureLocation}-${destinationLocation} results`).toHaveURL(new RegExp(`/${departureLocation}-${destinationLocation}/`));
  });

  test('Validate searching of a valid one-way flight', async ({ page, homePage }) => {
    await homePage.selectTripType('One-way');
    await homePage.selectOriginLocation(destinationLocation);
    await homePage.selectDestinationLocation(departureLocation);
    await homePage.selectDepartureDate(departureDate);

    await homePage.uncheckCompareCheapFlightsCheckbox();
    await homePage.clickSearchButton();

    await expect(page, `One-way search should navigate to ${destinationLocation}-${departureLocation} results`).toHaveURL(new RegExp(`/${destinationLocation}-${departureLocation}/`));
  });

  test('Validate searching with same origin and destination', async ({ page, homePage }) => {
    await homePage.selectOriginLocation(departureLocation);
    await homePage.selectDestinationLocation(departureLocation);
    await homePage.selectDepartureReturnDate(departureDate, returnDate);
    
    await homePage.verifyErrorMessageForIdenticalAirportInputs();
  });

  test('Validate searching with blank required fields', async ({ homePage }) => {
    await homePage.clickSearchButton();

    await expect(homePage.originCmbbox, 'Search should prompt for the missing origin').toHaveAttribute('aria-expanded', 'true');
  });

  test('Validate searching with past departure date', async ({ homePage }) => {
    const pastDate = new Date();
    pastDate.setUTCDate(pastDate.getUTCDate() - 1);

    await homePage.verifyPastDateSelectionDisabled(pastDate.toLocaleDateString('en-US'));
  });
});
