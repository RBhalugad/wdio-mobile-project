import { config as baseConfig } from './wdio.base.conf';

// ─── BrowserStack Base Config ────────────────────────────────────────────────

const config = { ...baseConfig };

// Use BrowserStack service instead of local Appium
config.services = ['browserstack'];

// Set BrowserStack credentials from environment variables
config.user = process.env.BROWSERSTACK_USERNAME || '';
config.key = process.env.BROWSERSTACK_ACCESS_KEY || '';

export { config };
