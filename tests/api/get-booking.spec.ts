import { expect, test } from '../../fixtures/bookingFixtures';
import { bookingPayload } from '../../test-data/booking';

test.describe('Get Booking api validation', { tag: '@api2' }, () => {
  let booking: { id: number; };

  test.beforeEach(async ({ bookingApi }) => {
    await bookingApi.bookingInit();
    const response = await bookingApi.createBooking(bookingPayload());
    const body = await response.json();
    booking = { id: body.bookingid };
  });

  test('Validate Get existing booking and assert all response fields', async ({ bookingApi }) => {
    const response = await bookingApi.getBooking(booking.id);
    expect(response.status(), 'Get booking should return 200').toBe(200);
    expect(await response.json(), 'Response body should match the created booking').toEqual(bookingPayload());
  });

  test('Validate Get booking IDs includes a newly created booking', async ({ bookingApi }) => {
    const response = await bookingApi.getBookingIds();
    expect(response.status(), 'Get booking IDs should return 200').toBe(200);
    const ids = await response.json();
    expect(Array.isArray(ids), 'Booking IDs response should be an array').toBe(true);
    expect(ids, 'Booking IDs should include the newly created booking').toContainEqual({ bookingid: booking.id });
  });

  test('Validate Get a deleted booking', async ({ bookingApi }) => {
    const deletion = await bookingApi.deleteBooking(booking.id);
    expect(deletion.status(), 'Delete booking should return 201').toBe(201);
    const response = await bookingApi.getBooking(booking.id);
    expect(response.status(), 'Get deleted booking should return 404').toBe(404);
    expect(await response.text(), 'Response body should be Not Found').toBe('Not Found');
  });

  test('Validate Get booking with a nonnumeric ID', async ({ bookingApi }) => {
    const response = await bookingApi.getBooking('random');
    expect(response.status(), 'Get booking with a nonnumeric ID should return 404').toBe(404);
    expect(await response.text(), 'Response body should be Not Found').toBe('Not Found');
  });
});
