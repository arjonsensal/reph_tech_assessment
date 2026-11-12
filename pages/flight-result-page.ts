import { Page, Locator } from 'playwright';
import { expect } from '@playwright/test';
import { formatDate } from '../utils/date-helper';

/**
 * Represents the Flight Result page.
 * @extends FlightResultPage
 */
export class FlightResultPage {
  page: Page;
  flightResultSort: Locator;
  flightResultList: Locator;
  noResultsMessage: Locator;
  flightResultLoadingOverlay: Locator
  private flightCardGroup: {
    shareButton: Locator;
    timeLabel: Locator;
    locationLabel: Locator;
    flightTypeLabel: Locator;
    durationLabel: Locator;
    priceLabel: Locator;
    airlineLogo: Locator;
    selectButton: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.flightResultSort = page.locator('div#flight-results-list-wrapper > div').nth(1);
    this.flightResultList = page.locator('div#flight-results-list-wrapper > div').nth(2);
    this.noResultsMessage = page.locator('div.IVAL');
    this.flightResultLoadingOverlay = page.locator('div[class*="loading-overlay"]');
    this.flightCardGroup = {
      shareButton: page.getByRole('button', { name: /Share/i }),
      timeLabel: page.locator(' > div div.VY2U > div.vmXl'),
      locationLabel: page.locator(' > div div.EFvI'),
      flightTypeLabel: page.locator(' > div div.JWEO'),
      durationLabel: page.locator(' > div div.xdW8'),
      priceLabel: page.locator('div.oVHK').nth(0),
      airlineLogo: page.locator(' > div div img'),
      selectButton: page.locator(' > div div.dOAU'),
    };
  }

  /**
   * Verifies that the flight results filters and list are visible
   */
  async verifyFlightResultsVisible() {
    await expect(this.flightResultSort, 'Flight results sort controls should be visible').toBeVisible();
    await expect(this.flightResultList, 'Flight results list should be visible').toBeVisible();
    await expect(this.flightResultList.getByRole('group').first(), 'Flight results should contain at least one flight card').toBeVisible();
  }

  /**
   * Wait for results to load
   */
  async waitForResultLoad() {
    await expect(this.flightResultLoadingOverlay).not.toBeAttached()
  }

  /**
   * Verifies that the first flight card in the results list contains expected details/format
   * @param bookingType (eg. Return, One-Way, Multi-City)
   * @param departureLocation (eg. SYD, MEL, BNE)
   * @param destinationLocation (eg. SYD, MEL, BNE)
   */
  async verifyFlightCardDetails(departureLocation: string, destinationLocation: string) {
    const firstFlightCard = this.flightResultList.getByRole('group').first();
    const locationLabel = firstFlightCard.locator(this.flightCardGroup.locationLabel);
    const timeLabel = firstFlightCard.locator(this.flightCardGroup.timeLabel);
    const flightTypeLabel = firstFlightCard.locator(this.flightCardGroup.flightTypeLabel);
    const durationLabel = firstFlightCard.locator(this.flightCardGroup.durationLabel);
    const airlineLogo = firstFlightCard.locator(this.flightCardGroup.airlineLogo);
    await expect(firstFlightCard, 'First flight card should be visible').toBeVisible();
    await expect(firstFlightCard.locator(this.flightCardGroup.shareButton), 'First flight card should show a share button').toBeVisible();
    await expect(firstFlightCard.locator(this.flightCardGroup.priceLabel), 'First flight card should show a price in dollars').toHaveText(/\$\d{1,3}(,\d{3})*/);
    // await expect(firstFlightCard.locator(this.flightCardGroup.airlineLogo), 'First flight card should show an airline logo').toBeVisible();
    await expect(firstFlightCard.locator(this.flightCardGroup.selectButton), 'First flight card should show a select button').toBeVisible();
    // await expect(locationLabel.first(), `Outbound route should include departure airport ${departureLocation}`).toHaveText("\\b(" + departureLocation +")\\b");
    // await expect(locationLabel.first(), `Outbound route should include destination airport ${destinationLocation}`).toHaveText("\\b(" + destinationLocation +")\\b");
    // await expect(timeLabel.first(), 'Outbound flight times should use 24-hour departure and arrival times').toHaveText(/\b([01]?\d|2[0-3]):[0-5]\d\s*[–-]\s*([01]?\d|2[0-3]):[0-5]\d\b/);
    // await expect(flightTypeLabel.first(), 'Outbound flight should show a direct or supported stop count').toHaveText(/(direct|1 stop|2 stops)/i);
    // await expect(durationLabel.first(), 'Outbound flight duration should show hours and minutes').toHaveText(/\b\d+h\s[0-5]\d m\b/);
    // if (bookingType === 'Return') {
    //   await expect(locationLabel.nth(1), `Return route should include airport ${departureLocation}`).toHaveText("\\b(" + departureLocation +")\\b");
    //   await expect(locationLabel.nth(1), `Return route should include airport ${destinationLocation}`).toHaveText("\\b(" + destinationLocation +")\\b");
    //   await expect(timeLabel.nth(1), 'Return flight times should use 24-hour departure and arrival times').toHaveText(/\b([01]?\d|2[0-3]):[0-5]\d\s*[–-]\s*([01]?\d|2[0-3]):[0-5]\d\b/);
    //   await expect(flightTypeLabel.nth(1), 'Return flight should show a direct or supported stop count').toHaveText(/(direct|1 stop|2 stops)/i);
    //   await expect(durationLabel.nth(1), 'Return flight duration should show hours and minutes').toHaveText(/\b\d+h\s[0-5]\d m\b/);
    // }
    for (let i = 0; i < await locationLabel.count(); i++) {
      await expect(locationLabel.nth(i), `Flight segment ${i + 1} should show airport codes and location names`).toHaveText(/^([A-Z]{3})\s*(.+?)\s*-\s*([A-Z]{3})\s*(.+)$/);
      // await expect(locationLabel.nth(i), `Flight segment ${i + 1} should include departure airport ${departureLocation}`).toHaveText("\\b(" + departureLocation +")\\b");
      // await expect(locationLabel.nth(i), `Flight segment ${i + 1} should include destination airport ${destinationLocation}`).toHaveText("\\b(" + destinationLocation +")\\b");
      await expect(timeLabel.nth(i), `Flight segment ${i + 1} should show 24-hour departure and arrival times`).toHaveText(/\b([01]?\d|2[0-3]):[0-5]\d\s*[–-]\s*([01]?\d|2[0-3]):[0-5]\d\b/);
      await expect(flightTypeLabel.nth(i), `Flight segment ${i + 1} should show a direct or supported stop count`).toHaveText(/(direct|1 stop|2 stops)/i);
      await expect(durationLabel.nth(i), `Flight segment ${i + 1} duration should show hours and minutes`).toHaveText(/^\d+h\s+[0-5]?\dm$/);
      await expect(airlineLogo.nth(i), `Flight segment ${i + 1} should show an airline logo`).toBeVisible();
    }
  }

  /**
   * Selects a price sort option from the flight results sort bar
   * @param option eg. Cheapest, Best, Quickest, Other sort
   */
  async selectPriceFilterOption(option: string) {
    const filterOptionButton = this.flightResultSort.getByRole('button', { name: option });
    await filterOptionButton.click();
  }

  /**
   * Verifies that prices across all flight cards are sorted from cheapest to most expensive.
   */
  async verifyFlightPricesSortedByCheapest() {
    await this.waitForResultLoad();
    const flightCards = this.flightResultList.getByRole('group');
    const priceLabels = flightCards.locator(this.flightCardGroup.priceLabel);
    await expect(priceLabels.first(), 'At least one flight card should show a price').toBeVisible();

    const priceTexts = await priceLabels.allInnerTexts();
    const prices = priceTexts.map(price => Number(price.replace(/[^\d.]/g, '')));
    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices, 'Flight prices should be sorted from cheapest to most expensive').toEqual(sortedPrices);
  }

  /**
   * Verifies the empty state after a search returns no flights.
   */
  async verifyNoFlightResults() {
    await expect(this.noResultsMessage, 'No flights found should be visible').toBeVisible({ timeout: 15000 });
    await expect(this.noResultsMessage, 'A message should explain that no matching flights were found').toContainText('No flights found')
    await expect(this.flightResultList.getByRole('group'), 'No flight cards should appear').toHaveCount(0);
  }
}
