import { expect, test } from '../../fixtures/bookingFixtures';
import { bookingPayload, type Booking } from '../../test-data/booking';

const updatedPayload = {
  firstname: 'James', lastname: 'Smith', totalprice: 250, depositpaid: false,
  bookingdates: { checkin: '2026-12-02', checkout: '2026-12-08' },
  additionalneeds: 'Late Checkout',
};

test.describe('Update Booking api validation', { tag: '@api3' }, () => {
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

  test('Validate values persisted after update', async ({ bookingApi }) => {
    const response = await bookingApi.updateBooking(booking.id, updatedPayload);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updatedPayload);
    const persisted = await bookingApi.getBooking(booking.id);
    expect(persisted.status()).toBe(200);
    expect(await persisted.json()).toEqual(updatedPayload);
  });

  test('Validate reject when update has missing required field', async ({ bookingApi }) => {
    const { lastname, ...invalidPayload } = bookingPayload();
    const response = await bookingApi.updateBooking(booking.id, invalidPayload);
    expect(response.status()).toBe(400);
    expect(await response.text()).toBe('Bad Request');
    const persisted = await bookingApi.getBooking(booking.id);
    expect(persisted.status()).toBe(200);
    expect(await persisted.json()).toEqual(booking.payload);
  });

  test('Validate other fields unchanged when Partially updated fields', async ({ bookingApi }) => {
    const partial = { firstname: 'James', totalprice: 250 };
    const expected = { ...booking.payload, ...partial };
    const response = await bookingApi.partialUpdateBooking(booking.id, partial);
    expect(response.status(), 'Partial update should return 200').toBe(200);
    expect(await response.json(), 'Response should contain merged booking').toEqual(expected);
    const persisted = await bookingApi.getBooking(booking.id);
    expect(persisted.status(), 'Get booking should return 200').toBe(200);
    expect(await persisted.json(), 'Persisted booking should contain merged values').toEqual(expected);
  });
});
