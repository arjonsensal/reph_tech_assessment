import { expect, test } from '../../fixtures/bookingFixtures';
import { bookingPayload } from '../../test-data/booking';

test.describe('Create Booking api validation', { tag: '@api1' }, () => {
  test.beforeEach(async ({ bookingApi }) => {
    await bookingApi.bookingInit();
  });

  for (const depositpaid of [true, false]) {
    test(`Validate Create full booking with depositpaid=${depositpaid}`, async ({ bookingApi }) => {
      const payload = { ...bookingPayload(), depositpaid };
      const creation = await bookingApi.createBooking(payload);
      const body = await creation.json();

      expect(creation.status()).toBe(200);
      expect(body).toMatchObject({ booking: payload });
      expect(typeof (body.bookingid)).toBe('number');
      expect(body.bookingid).toBeGreaterThan(0);
      
      const id = body.bookingid;
      const response = await bookingApi.getBooking(id);
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual(payload);
    });
  }

  for (const field of ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'] as const) {
    test(`Validate create booking with missing ${field} field`, async ({ bookingApi }) => {
      const payload = bookingPayload();
      delete payload[field];
      const response = await bookingApi.createBooking(payload);
      expect(response.status()).toBe(500);
      expect(response.headers()['content-type']).toContain('text/plain');
      expect(await response.text()).toBe('Internal Server Error');
    });
  }
});
