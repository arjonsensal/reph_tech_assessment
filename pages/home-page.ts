import { Page, Locator } from 'playwright';
import { expect } from '@playwright/test';
import { formatDate } from '../utils/date-helper';

/**
 * Represents the home page.
 * @extends HomePage
 */
export class HomePage {
  page: Page;
  logo: Locator;
  loginButton: Locator;
  signInCreateDialog: Locator;
  tripTypeCmbbox: Locator;
  tripTypeOptionList: Locator;
  originCmbbox: Locator;
  destinationCmbbox: Locator;
  searchButton: Locator;
  departureReturnDateButton: Locator;
  travelTypeAmountButton: Locator;
  calendarModal: Locator;
  prevMonthBtn: Locator;
  nextMonthBtn: Locator;
  compareCheapFlightsChkbox: Locator;
  originDivSection: Locator;
  destinationDivSection: Locator;
  returnDatePicker: Locator;
  identicalAirportsError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole('link', { name: /cheapflights homepage/i });
    this.originDivSection = page.locator('div[aria-label="Flight origin input"]');
    this.destinationDivSection = page.locator('div[aria-label="Flight destination input"]');
    this.returnDatePicker = page.locator('div[aria-label="Return date"]');
    this.identicalAirportsError = page.getByText(`Please enter unique 'From' and 'To' airports for flight ''.`);
    this.loginButton = page.getByRole('button', { name: /Sign in/i });
    this.signInCreateDialog = page.getByRole('heading', { name: /Welcome to Cheapflights./i });
    this.tripTypeOptionList = page.getByRole('listbox', { name: 'Trip type Return'});
    this.tripTypeCmbbox = page.getByRole('combobox', { name: 'Trip type Return' });
    this.originCmbbox = page.getByRole('combobox', { name: /Origin location/i });
    this.destinationCmbbox = page.getByRole('combobox', { name: /Ask anything/i });
    this.searchButton = this.destinationDivSection.getByRole('button', { name: 'Search' });
    this.departureReturnDateButton = page.locator('div.BdbJ div:not([aria-label="Trip type"])').first();
    this.travelTypeAmountButton = page.locator('div.BdbJ').filter({ hasText: /Trip type/i });
    this.calendarModal = page.locator('div.sGVi');
    this.prevMonthBtn = this.calendarModal.getByRole('button', { name: 'Previous month' });
    this.nextMonthBtn = this.calendarModal.getByRole('button', { name: 'Next month' });
    this.compareCheapFlightsChkbox = page.locator('input[id*="pres-default-"]');
  }
  
  /**
   * Verifies that the brand logo is visible and positioned in top-left
   */
  async verifyLogoVisibility() {
    await expect(this.logo, 'Cheapflights logo should be visible').toBeVisible();
    await expect(this.logo, 'Cheapflights logo should match the reference screenshot').toHaveScreenshot('logo.png');
    const viewportSize = this.page.viewportSize();
    const boundingBox = await this.logo.boundingBox();
    expect(boundingBox, 'Cheapflights logo should have a bounding box').not.toBeNull();
    if (boundingBox && viewportSize) {
      expect(boundingBox.x, 'Cheapflights logo should be in the left half of the viewport').toBeLessThan(viewportSize.width / 2);
      expect(boundingBox.y, 'Cheapflights logo should be within the top 100 pixels').toBeLessThan(100);
    }
  }

  /**
   * Verifies that the login button's position, visibility and clickability
   */
  async verifyLoginButton() {
    await expect(this.loginButton, 'Sign in button should be visible').toBeVisible();
    await expect(this.loginButton, 'Sign in button should be enabled').toBeEnabled();
    const viewportSize = this.page.viewportSize();
    const boundingBox = await this.loginButton.boundingBox();
    expect(boundingBox, 'Sign in button should have a bounding box').not.toBeNull();
    if (boundingBox && viewportSize) {
      expect(boundingBox.x, 'Sign in button should be in the right half of the viewport').toBeGreaterThan(viewportSize.width / 2);
      expect(boundingBox.y, 'Sign in button should be within the top 100 pixels').toBeLessThan(100);
    }
    await this.loginButton.click();
    await expect(this.signInCreateDialog, 'Sign in dialog should appear after clicking Sign in').toBeVisible();

  }

  /**
   * Selects the trip type from the dropdown
   * @param tripType trip type (e.g. Return, One-way, Multi-city)
   */  
  async selectTripType(tripType: string) {
    await this.tripTypeCmbbox.click();
    await this.tripTypeOptionList.getByRole('option', { name: tripType }).click();
  }

  /**
   * Selects the origin location from the dropdown
   * @param origin location abbreviation (e.g. LAX, JFK, SFO)
   */
  async selectOriginLocation(origin: string) {
    await this.originCmbbox.click();
    await this.originCmbbox.fill(origin);
    await expect(this.page.locator('#flight-origin-smarty-input-list')).toBeVisible();
    await this.page.keyboard.press('Enter');
  }

  /**
   * Selects the destination location from the dropdown
   * @param destination location abbreviation (e.g. LAX, JFK, SFO)
   */
  async selectDestinationLocation(destination: string) {
    await this.destinationCmbbox.click();
    await this.destinationCmbbox.fill(destination);
    await expect(this.page.locator('ul[aria-label="Destination airports"]')).toBeVisible();
    await this.page.keyboard.press('Enter');
  }

  /**
   * Clicks the search button to initiate the flight search
   */
  async clickSearchButton() {
    await this.searchButton.click();
  }

  /**
   * Uncheck compare cheapflights vs checkbox
   */
  async uncheckCompareCheapFlightsCheckbox() {
    await this.compareCheapFlightsChkbox.uncheck();
  }

  /**
   * Clicks the "Compare Cheap Flights" checkbox to enable/disable the option
   */
  async clickCompareCheapFlightsCheckbox() {
    await this.compareCheapFlightsChkbox.click();
  }

  /**
   * Selects the departure and return dates from the calendar
   * @param departureDate format - "12/11/2026"
   * @param returnDate format - "12/18/2026"
   */
  async selectDepartureReturnDate(departureDate: string, returnDate: string) {
    await this.departureReturnDateButton.click();
    await this.selectCalendarDate(departureDate);
    await this.selectCalendarDate(returnDate);
  }

  /**
   * Selects a departure date for a one-way search (MM/DD/YYYY).
   */
  async selectDepartureDate(departureDate: string) {
    await this.departureReturnDateButton.click();
    await this.selectCalendarDate(departureDate);
  }
  
  /**
   * Selects the calendar date
   * @param date 
   */
  private async selectCalendarDate(date: string) {
    const dayButton = this.page.getByRole('button', { name: formatDate(date) });
    await expect(this.calendarModal, 'Departure calendar should be visible').toBeVisible();
    while (!(await dayButton.isVisible())) {
      await this.nextMonthBtn.click();
    }
    await dayButton.click();
  }

  /**
   * Clears all selected departure locations from the origin combobox
   */
  async clearDepartureLocations() {
    if (await this.originDivSection.getByRole('list').isVisible()) {
      const originList = await this.originDivSection.getByRole('listitem').all();
      for (const origin of originList) {
        await origin.getByRole('button', { name: /Remove/i }).click();
      }
    }
  }

  /**
   * Clears all selected destination locations from the destination combobox
   */
  async clearDestinationLocations() {
    if (await this.destinationDivSection.getByRole('list').isVisible()) {
      const destinationList = await this.destinationDivSection.getByRole('listitem').all();
      for (const destination of destinationList) {
        await destination.getByRole('button', { name: /Remove/i }).click();
      }
    }
  }

  /**
   * Verifies that past dates are disabled in the calendar modal
   * @param pastDate format ("11/01/2026")
   */
  async verifyPastDateSelectionDisabled(pastDate: string) {
    await this.departureReturnDateButton.click();
    try {
      await expect(await this.page.getByRole('button', { name: formatDate(pastDate) }), `Past departure date ${pastDate} should be disabled`).toBeDisabled();
    } catch (e) {
      await expect(this.prevMonthBtn, 'Previous month button should be disabled when past dates are unavailable').toBeDisabled();
    }
  }

  /**
   * Verifies the identical Error airport message
   */
  async verifyErrorMessageForIdenticalAirportInputs() {
    await this.clickSearchButton();
    await this.destinationCmbbox.click();
    await this.destinationCmbbox.pressSequentially('ABC');
    await expect(this.identicalAirportsError, 'Search should show an error for identical origin and destination airports').toBeVisible();
  }
}
