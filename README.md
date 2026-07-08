# WebdriverIO Mobile Test Framework

A production-ready mobile test automation project using **WebdriverIO v8** + **Appium 2**, covering Android (UiAutomator2) and iOS (XCUITest) with the Page Object Model pattern.

---

## Project Structure

```
wdio-mobile/
├── config/
│   ├── wdio.base.conf.js       # Shared settings (timeouts, reporters, hooks)
│   ├── wdio.android.conf.js    # Android capabilities
│   └── wdio.ios.conf.js        # iOS capabilities
├── test/
│   ├── specs/
│   │   ├── shared/             # Platform-agnostic specs (run on both)
│   │   ├── android/            # Android-only specs
│   │   └── ios/                # iOS-only specs
│   ├── pageobjects/
│   │   ├── base.page.js        # Core helpers (wait, tap, scroll, alerts)
│   │   ├── login.page.js
│   │   └── home.page.js
│   ├── helpers/
│   │   └── gestures.js         # W3C multi-touch: swipe, pinch, drag & drop
│   └── data/
│       └── users.js            # Test data (driven by .env)
├── apps/                       # Place your .apk / .app / .ipa here
├── screenshots/                # Auto-captured on test failure
├── allure-results/             # Raw Allure data
├── .env.example                # Copy to .env and fill in values
└── .github/workflows/
    └── android.yml             # GitHub Actions CI
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| Java | ≥ 17 (Android) |
| Android SDK / `adb` | latest |
| Xcode | ≥ 15 (iOS, macOS only) |
| Appium | 2.x (installed globally) |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Install Appium and drivers
```bash
npm install -g appium
appium driver install uiautomator2   # Android
appium driver install xcuitest       # iOS (macOS only)
```

### 3. Configure your environment
```bash
cp .env.example .env
# Edit .env with your device details, app path, and test credentials
```

### 4. Add your app binary
Place your `.apk` (Android) or `.app` / `.ipa` (iOS) in the `apps/` directory and update `ANDROID_APP_PATH` / `IOS_APP_PATH` in `.env`.

---

## Running Tests

```bash
# Android — full suite
npm run test:android

# iOS — full suite
npm run test:ios

# Smoke suite only (Android)
npm run test:android:smoke

# Smoke suite only (iOS)
npm run test:ios:smoke
```

---

## Allure Report

```bash
npm run allure:report
```

---

## Writing Tests

### Adding a page object

```js
// test/pageobjects/settings.page.js
const BasePage = require('./base.page');

class SettingsPage extends BasePage {
  get darkModeToggle() { return $('~dark_mode_toggle'); }

  async enableDarkMode() {
    const toggle = await this.darkModeToggle;
    if ((await toggle.getAttribute('value')) === '0') {
      await toggle.click();
    }
  }
}

module.exports = new SettingsPage();
```

### Adding a spec

```js
// test/specs/shared/settings.spec.js
const settingsPage = require('../../pageobjects/settings.page');

describe('Settings', () => {
  it('should toggle dark mode', async () => {
    await settingsPage.enableDarkMode();
    // assert ...
  });
});
```

### Using gesture helpers

```js
const gestures = require('../../helpers/gestures');

it('should swipe carousel', async () => {
  const carousel = await $('~featured_carousel');
  await gestures.swipeElementLeft(carousel);
});

it('should long-press for context menu', async () => {
  const item = await $('~list_item_1');
  await gestures.longPress(item, 1500);
});
```

---

## Selector Strategy

| Platform | Recommended | Example |
|----------|------------|---------|
| Both     | Accessibility ID | `$('~login_button')` |
| Android  | UIAutomator2 | `$('android=new UiSelector().resourceId("com.app:id/btn")')` |
| iOS      | Predicate String | `$('-ios predicate string:type == "XCUIElementTypeButton"')` |
| iOS      | Class Chain | `$('-ios class chain:**/XCUIElementTypeButton[\`label == "Login"\`]')` |

Use accessibility IDs (`~`) as your default — they work across both platforms when the dev team sets `accessibilityLabel` (iOS) / `contentDescription` (Android).

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANDROID_DEVICE_NAME` | AVD name or connected device ID |
| `ANDROID_VERSION` | Platform version (e.g. `14.0`) |
| `ANDROID_APP_PATH` | Path to `.apk` |
| `IOS_DEVICE_NAME` | Simulator name or real device name |
| `IOS_VERSION` | iOS version (e.g. `18.0`) |
| `IOS_APP_PATH` | Path to `.app` or `.ipa` |
| `IOS_UDID` | Device UDID (real devices only) |
| `TEST_USER_EMAIL` | Valid test account email |
| `TEST_USER_PASSWORD` | Valid test account password |
| `LOG_LEVEL` | Appium/WebdriverIO log level (`info`, `debug`) |

---

## Tips

- **Reset state** — call `await driver.reset()` in `beforeEach` for test isolation.
- **Avoid `driver.pause()`** — prefer explicit waits (`waitForDisplayed`, `waitForExist`).
- **Cross-platform selectors** — use `~accessibilityId` when possible; branch per platform only when needed.
- **Slow CI emulator?** — add `'appium:disableWindowAnimation': true` to Android caps.
- **Real iOS device** — set `XCODE_ORG_ID`, `IOS_UDID`, and uncomment signing caps in `wdio.ios.conf.js`.
