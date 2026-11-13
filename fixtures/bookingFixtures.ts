import { test as base, expect } from '@playwright/test';
import { BookingApi } from '../api/bookingApi';

type BookingFixtures = {
  bookingApi: BookingApi;
};

export const test = base.extend<BookingFixtures>({
  bookingApi: async ({ playwright }, use) => {
    const bookingApi = new BookingApi(playwright.request);
    try {
      await use(bookingApi);
    } catch(e) {
      console.log(e)
    }
  },
});

export { expect };
