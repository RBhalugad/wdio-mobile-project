import { config as baseConfig } from './wdio.base.conf';

// ─── Android-Specific Overrides ───────────────────────────────────────────────

const config = { ...baseConfig };

config.specs = ['./test/specs/android/**/*.spec.ts', './test/specs/shared/**/*.spec.ts'];

config.capabilities = [
    {
        platformName: 'Android',

        // ── Device ──────────────────────────────────────────────
        'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'emulator-5554',
        'appium:platformVersion': process.env.ANDROID_VERSION || '14.0',
        'appium:udid': process.env.ANDROID_UDID || '', // blank for emulator

        // ── Automation ──────────────────────────────────────────
        'appium:automationName': 'UiAutomator2',
        'appium:newCommandTimeout': 300,
        'appium:uiautomator2ServerInstallTimeout': 60000,

        // ── App ─────────────────────────────────────────────────
        // Option A: local .apk file
        'appium:app': process.env.ANDROID_APP_PATH || './apps/android.apk',
        // Option B: pre-installed app (comment out 'app' above)
        // 'appium:appPackage': 'com.example.app',
        // 'appium:appActivity': '.ui.MainActivity',

        // ── Session ─────────────────────────────────────────────
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:autoGrantPermissions': true,

        // ── Performance ─────────────────────────────────────────
        'appium:disableWindowAnimation': true,
        'appium:ignoreHiddenApiPolicyError': true,
    },
];

export { config };
