import { config as bsBaseConfig } from './wdio.browserstack.base.conf';

// ─── BrowserStack Android Config ─────────────────────────────────────────────

const config = { ...bsBaseConfig };

config.specs = ['./test/specs/android/**/*.spec.ts', './test/specs/shared/**/*.spec.ts'];

config.capabilities = [
    {
        platformName: 'Android',
        'bstack:options': {
            deviceName: 'Samsung Galaxy S22',
            osVersion: '12.0',
            projectName: 'WDIO Mobile Project',
            buildName: 'Android Tests',
            sessionName: 'Android BrowserStack Run',
            // Enable debugging and logs
            debug: true,
            networkLogs: true,
        },
        // The bs:// app id from uploading your .apk to BrowserStack
        'appium:app': process.env.BROWSERSTACK_ANDROID_APP_ID || 'bs://<hashed-app-id>',
        'appium:autoGrantPermissions': true,
    },
];

export { config };
