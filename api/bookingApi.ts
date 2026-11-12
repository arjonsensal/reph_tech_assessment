import { expect, type APIRequest, type APIRequestContext } from '@playwright/test';
import { bookingPayload, type Booking } from '../test-data/booking';

type Headers = Record<string, string>;

export class BookingApi {
  private context?: APIRequestContext;
  private authHeaders: Headers = {};
  private readonly bookingIds = new Set<number>();

  constructor(private readonly request: APIRequest) {}

  async bookingInit(): Promise<this> {
    if (this.context) return this;

    const username = process.env.BOOKER_USERNAME;
    const password = process.env.BOOKER_PASSWORD;
    if (!username || !password) {
      throw new Error('missing BOOKER_USERNAME and/or BOOKER_PASSWORD');
    }

    const context = await this.request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    try {
      const response = await context.post('/auth', { data: { username, password } });
      expect(response.status(), 'Authentication should succeed').toBe(200);
      const body = await response.json();
      expect(body).toEqual({ token: expect.any(String) });
      expect(body.token.length).toBeGreaterThan(0);
      this.authHeaders = { Cookie: `token=${body.token}` };
      this.context = context;
      return this;
    } catch (error) {
      await context.dispose();
      throw error;
    }
  }

  private get initializedContext(): APIRequestContext {
    if (!this.context) {
      throw new Error('Call await bookingApi.bookingInit() before using booking functions.');
    }
    return this.context;
  }

  async createBooking(payload: Partial<Booking> = bookingPayload()) {
    const response = await this.initializedContext.post('/booking', { data: payload });
    if (response.status() === 200) {
      const body = await response.json();
      if (Number.isInteger(body.bookingid) && body.bookingid > 0) {
        this.bookingIds.add(body.bookingid);
      }
    }
    return response;
  }

  async getBooking(id: number | string) {
    return this.initializedContext.get(`/booking/${id}`);
  }

  async getBookingIds() {
    return this.initializedContext.get(`/booking`);
  }

  async updateBooking(id: number | string, payload: Partial<Booking>, headers: Headers = this.authHeaders) {
    return this.initializedContext.put(`/booking/${id}`, { headers, data: payload });
  }

  async partialUpdateBooking(id: number | string, payload: Partial<Booking>, headers: Headers = this.authHeaders) {
    return this.initializedContext.patch(`/booking/${id}`, { headers, data: payload });
  }

  async deleteBooking(id: number | string, headers: Headers = this.authHeaders) {
    return this.initializedContext.delete(`/booking/${id}`, { headers });
  }

  async dispose() {
    if (!this.context) return;
    try {
      for (const id of this.bookingIds) {
        const response = await this.deleteBooking(id);
        expect([201, 405], `Cleanup of booking ${id}`).toContain(response.status());
      }
    } finally {
      await this.context.dispose();
      this.context = undefined;
      this.authHeaders = {};
      this.bookingIds.clear();
    }
  }
}
