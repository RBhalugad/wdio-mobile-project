import { config as bsBaseConfig } from './wdio.browserstack.base.conf';

// ─── BrowserStack iOS Config ──────────────────────────────────────────────────

const config = { ...bsBaseConfig };

config.specs = ['./test/specs/ios/**/*.spec.ts', './test/specs/shared/**/*.spec.ts'];

config.capabilities = [
    {
        platformName: 'iOS',
        'bstack:options': {
            deviceName: 'iPhone 14',
            osVersion: '16',
            projectName: 'WDIO Mobile Project',
            buildName: 'iOS Tests',
            sessionName: 'iOS BrowserStack Run',
            // Enable debugging and logs
            debug: true,
            networkLogs: true,
        },
        // The bs:// app id from uploading your .ipa to BrowserStack
        'appium:app': process.env.BROWSERSTACK_IOS_APP_ID || 'bs://<hashed-app-id>',
        'appium:autoAcceptAlerts': true,
    },
];

export { config };
