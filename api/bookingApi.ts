import { expect, type APIRequest, type APIRequestContext } from '@playwright/test';
import { bookingPayload, type Booking } from '../test-data/booking';

export class BookingApi {
  private context?: APIRequestContext;
  private token = '';
  private createdIds: number[] = [];

  constructor(private request: APIRequest) {}

  // logs in once and reuses the same context for all calls
  async bookingInit() {
    if (this.context) return this;

    const username = process.env.BOOKER_USERNAME;
    const password = process.env.BOOKER_PASSWORD;
    if (!username || !password) {
      throw new Error('Set BOOKER_USERNAME and BOOKER_PASSWORD in .env');
    }

    this.context = await this.request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });

    const response = await this.context.post('/auth', { data: { username, password } });
    expect(response.status(), 'Authentication should succeed').toBe(200);
    const body = await response.json();
    expect(body.token, 'Auth should return a token').toBeTruthy();
    this.token = body.token;
    return this;
  }

  private get api() {
    if (!this.context) {
      throw new Error('Call bookingInit() first');
    }
    return this.context;
  }

  private authHeaders() {
    return { Cookie: `token=${this.token}` };
  }

  async createBooking(payload: Partial<Booking> = bookingPayload()) {
    const response = await this.api.post('/booking', { data: payload });
    if (response.status() === 200) {
      const body = await response.json();
      this.createdIds.push(body.bookingid);
    }
    return response;
  }

  async getBooking(id: number | string) {
    return this.api.get(`/booking/${id}`);
  }

  async getBookingIds() {
    return this.api.get('/booking');
  }

  // headers can be overridden so tests can try it without a token
  async updateBooking(id: number | string, payload: Partial<Booking>, headers = this.authHeaders()) {
    return this.api.put(`/booking/${id}`, { headers, data: payload });
  }

  async partialUpdateBooking(id: number | string, payload: Partial<Booking>, headers = this.authHeaders()) {
    return this.api.patch(`/booking/${id}`, { headers, data: payload });
  }

  async deleteBooking(id: number | string, headers = this.authHeaders()) {
    return this.api.delete(`/booking/${id}`, { headers });
  }
}
