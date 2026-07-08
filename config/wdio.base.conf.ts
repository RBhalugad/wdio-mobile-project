import 'dotenv/config';
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
    //
    // Runner
    //
    runner: 'local',
    port: 4723,

    //
    // TypeScript support via ts-node
    //
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json',
        },
    },

    //
    // Parallelism
    //
    maxInstances: 1,

    //
    // Test Files (overridden per platform)
    //
    specs: ['./test/specs/**/*.spec.ts'],
    exclude: [],

    //
    // Capabilities (overridden per platform in android/ios conf)
    //
    capabilities: [],

    //
    // Logging
    //
    logLevel: (process.env.LOG_LEVEL as Options.WebDriverLogTypes) || 'info',
    bail: 0,

    //
    // Timeouts
    //
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    //
    // Services
    //
    services: [
        [
            'appium',
            {
                args: {
                    relaxedSecurity: true,
                    address: '0.0.0.0',
                    port: 4723,
                },
                logFileName: 'appium.log',
                outputDir: './logs',
            },
        ],
    ],

    //
    // Framework
    //
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 90000,
        require: [],
    },

    //
    // Reporters
    //
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: false,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: false,
                addConsoleLogs: true,
            },
        ],
    ],

    //
    // Test Suite Definitions
    //
    suites: {
        smoke: ['./test/specs/**/smoke.*.spec.ts'],
        regression: ['./test/specs/**/*.spec.ts'],
        login: ['./test/specs/**/login.spec.ts'],
    },

    //
    // Hooks
    //
    onPrepare(): void {
        console.log('🚀 Starting mobile test run...');
    },

    async before(): Promise<void> {
        // WebdriverIO v8 provides a built-in `expect` (expect-webdriverio) globally —
        // no additional assertion library setup required.
    },

    async beforeTest(test: { fullTitle: string }): Promise<void> {
        console.log(`\n▶ Running: ${test.fullTitle}`);
    },

    async afterTest(
        test: { title: string },
        _context: unknown,
        { passed }: { error?: Error; result?: unknown; duration: number; passed: boolean },
    ): Promise<void> {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotName = `./screenshots/${test.title}-${timestamp}.png`;
            await browser.saveScreenshot(screenshotName);
            console.log(`📸 Screenshot saved: ${screenshotName}`);
        }
    },

    async afterSession(): Promise<void> {
        // Cleanup after session
    },

    onComplete(exitCode: number): void {
        const status = exitCode === 0 ? '✅ PASSED' : '❌ FAILED';
        console.log(`\n${status} - Test run complete`);
    },
};
