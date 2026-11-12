# Playwright Framework using TypeScript

This repository provides a framework for automating Cheapflights E2E workflows and Restful Booker API validation using Playwright and TypeScript. Built using the Page Object Model (POM) pattern, reusable fixtures, and Playwright's integrated test runner, it supports multiple browsers, environment-based configuration, and positive and negative test scenarios.

## 📌 Project Description
**Cheapflights UI automation**
* Validate the brand logo's visibility, screenshot, and position in the upper left.
* Validate the sign-in button's visibility, position in the upper right, and dialog behavior.
* Search for round-trip and one-way flights.
* Validate identical airport inputs, blank required fields, and disabled past dates.
* Verify flight results, flight card details, cheapest-price sorting, and the no-results state.

**Restful Booker API automation**
* Authenticate using environment-provided credentials.
* Create bookings and verify their generated IDs and persisted values.
* Retrieve individual bookings and check the booking ID list.
* Update bookings using full (`PUT`) and partial (`PATCH`) requests.
* Delete bookings and verify that they can no longer be retrieved.
* Validate missing required fields, invalid booking IDs, and repeated deletion.

## 🛠️ Framework and Dependencies
* `@playwright/test` — browser automation, API requests, assertions, and HTML reporting.
* TypeScript — typed page objects, API helpers, fixtures, and test data.

## 📦 Clone and Install Packages
Clone this repository using its Git URL:

```bash
git clone <repository-url> reph_tech_assessment
cd reph_tech_assessment
npm ci
```

Install Playwright browsers for UI testing:

```bash
npx playwright install
```

For Chromium-only UI testing, use `npx playwright install chromium`. API-only tests do not require browser installation.

## 🔐 Environment Configuration
Create a `.env` file in the root directory using `.env.example` as a sample.

```env
UI_LINK=https://www.cheapflights.com.ph
API_BASE_URL=https://restful-booker.herokuapp.com
BOOKER_USERNAME=<your-username>
BOOKER_PASSWORD=<your-password>
```

## ⚙️ Running
Run UI tests

```bash
npm run test:ui
```

Run UI tests across Chromium, Firefox, and WebKit:

```bash
npm run test:ui-all-browser
```

Run the API suite once using one configured project:

```bash
npm run test:api
```

## 🙋‍♂️ Author
[Jose Arjon Sensal](https://www.linkedin.com/in/arjon-sensal-3b9507168)
