import { config as baseConfig } from './wdio.base.conf';

// ─── iOS-Specific Overrides ────────────────────────────────────────────────────

const config = { ...baseConfig };

config.specs = ['./test/specs/ios/**/*.spec.ts', './test/specs/shared/**/*.spec.ts'];

config.capabilities = [
    {
        platformName: 'iOS',

        // ── Device ──────────────────────────────────────────────
        'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 16',
        'appium:platformVersion': process.env.IOS_VERSION || '18.0',
        'appium:udid': process.env.IOS_UDID || '', // required for real device

        // ── Automation ──────────────────────────────────────────
        'appium:automationName': 'XCUITest',
        'appium:newCommandTimeout': 300,
        'appium:wdaLocalPort': process.env.WDA_PORT ? parseInt(process.env.WDA_PORT, 10) : 8100,
        'appium:wdaStartupRetries': 4,
        'appium:wdaStartupRetryInterval': 20000,

        // ── App ─────────────────────────────────────────────────
        // Option A: local .app or .ipa file
        'appium:app': process.env.IOS_APP_PATH || './apps/ios.app',
        // Option B: pre-installed app (comment out 'app' above)
        // 'appium:bundleId': 'com.example.app',

        // ── Session ─────────────────────────────────────────────
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:autoAcceptAlerts': true, // auto-dismiss iOS permission dialogs

        // ── Real Device extras ──────────────────────────────────
        // Uncomment if testing on a real iOS device:
        // 'appium:xcodeOrgId':     process.env.XCODE_ORG_ID,
        // 'appium:xcodeSigningId': 'iPhone Developer',
    },
];

export { config };
