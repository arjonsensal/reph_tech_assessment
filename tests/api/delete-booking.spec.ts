import { expect, test } from '../../fixtures/bookingFixtures';
import { bookingPayload, type Booking } from '../../test-data/booking';

test.describe('Delete Booking api validation', { tag: '@api4' }, () => {
  let booking: { id: number; payload: Booking };

  test.beforeEach(async ({ bookingApi }) => {
    await bookingApi.bookingInit();
    const payload = bookingPayload();
    const response = await bookingApi.createBooking(payload);
    expect(response.status(), 'Booking setup should succeed').toBe(200);
    const body = await response.json();
    expect(body).toEqual({ bookingid: expect.any(Number), booking: payload });
    booking = { id: body.bookingid, payload };
  });

  test('Validate Delete booking and verify it no longer exists', async ({ bookingApi }) => {
    const response = await bookingApi.deleteBooking(booking.id);
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('Created');
    const lookup = await bookingApi.getBooking(booking.id);
    expect(lookup.status()).toBe(404);
    expect(await lookup.text()).toBe('Not Found');
  });

  test('Validate deletion of an already deleted booking', async ({ bookingApi }) => {
    const deletion = await bookingApi.deleteBooking(booking.id);
    expect(deletion.status()).toBe(201);
    const response = await bookingApi.deleteBooking(booking.id);
    expect(response.status()).toBe(405);
    expect(await response.text()).toBe('Method Not Allowed');
  });
});
