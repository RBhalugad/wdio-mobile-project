type SwipeDirection = 'up' | 'down' | 'left' | 'right';

interface ElementBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Base page object — all page objects extend this.
 * Provides common mobile helpers and element interaction wrappers.
 */
class BasePage {
    // ─── Platform ─────────────────────────────────────────────────────────────

    get isAndroid(): boolean {
        return driver.isAndroid;
    }

    get isIOS(): boolean {
        return driver.isIOS;
    }

    // ─── Wait Helpers ──────────────────────────────────────────────────────────

    /**
     * Wait for an element to be visible, then return it.
     */
    async waitForVisible(selector: string, timeout = 15000): Promise<WebdriverIO.Element> {
        const el = await $(selector);
        await el.waitForDisplayed({
            timeout,
            timeoutMsg: `Element "${selector}" not visible after ${timeout}ms`,
        });
        return el;
    }

    /**
     * Wait for an element to exist in the DOM (may not be visible).
     */
    async waitForExist(selector: string, timeout = 15000): Promise<WebdriverIO.Element> {
        const el = await $(selector);
        await el.waitForExist({
            timeout,
            timeoutMsg: `Element "${selector}" not found after ${timeout}ms`,
        });
        return el;
    }

    /**
     * Wait for an element to disappear.
     */
    async waitForHidden(selector: string, timeout = 15000): Promise<void> {
        const el = await $(selector);
        await el.waitForDisplayed({
            timeout,
            reverse: true,
            timeoutMsg: `Element "${selector}" still visible after ${timeout}ms`,
        });
    }

    // ─── Element Interactions ──────────────────────────────────────────────────

    async tap(selector: string): Promise<void> {
        const el = await this.waitForVisible(selector);
        await el.click();
    }

    async clearAndType(element: WebdriverIO.Element, value: string): Promise<void> {
        await element.waitForDisplayed({ timeout: 15000 });
        await element.clearValue();
        await element.setValue(value);
        // Dismiss keyboard if it appeared
        try {
            if (this.isAndroid) {
                await driver.hideKeyboard();
            }
        } catch (_) {
            /* keyboard might not be open */
        }
    }

    async getText(selector: string): Promise<string> {
        const el = await this.waitForVisible(selector);
        return el.getText();
    }

    async getAttribute(selector: string, attr: string): Promise<string> {
        const el = await this.waitForVisible(selector);
        return el.getAttribute(attr);
    }

    async isElementDisplayed(selector: string, timeout = 3000): Promise<boolean> {
        try {
            const el = await $(selector);
            await el.waitForDisplayed({ timeout });
            return el.isDisplayed();
        } catch (_) {
            return false;
        }
    }

    async isEnabled(selector: string): Promise<boolean> {
        const el = await $(selector);
        return el.isEnabled();
    }

    // ─── Scroll / Swipe ───────────────────────────────────────────────────────

    /**
     * Scroll down until an element becomes visible (Android: UiScrollable).
     */
    async scrollToElement(selector: string, maxScrolls = 10): Promise<WebdriverIO.Element> {
        if (this.isAndroid) {
            const scrollable = await $(
                `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${selector}"))`,
            );
            if (await scrollable.isDisplayed()) return scrollable;
        }

        // Fallback: manual swipes
        for (let i = 0; i < maxScrolls; i++) {
            if (await this.isElementDisplayed(selector, 500)) break;
            await this.swipeScreen('up', 0.35);
        }
        return $(selector);
    }

    /**
     * Swipe the entire screen in a given direction.
     * @param direction - 'up' | 'down' | 'left' | 'right'
     * @param scrollPercent - 0–1 fraction of screen to cover
     */
    async swipeScreen(direction: SwipeDirection, scrollPercent = 0.5): Promise<void> {
        const { width, height } = await driver.getWindowSize();
        const cx = Math.round(width / 2);
        const cy = Math.round(height / 2);

        const vectors: Record<
            SwipeDirection,
            Partial<{ fromY: number; toY: number; fromX: number; toX: number }>
        > = {
            up: {
                fromY: Math.round(height * 0.75),
                toY: Math.round(height * (0.75 - scrollPercent)),
            },
            down: {
                fromY: Math.round(height * 0.25),
                toY: Math.round(height * (0.25 + scrollPercent)),
            },
            left: {
                fromX: Math.round(width * 0.8),
                toX: Math.round(width * (0.8 - scrollPercent)),
            },
            right: {
                fromX: Math.round(width * 0.2),
                toX: Math.round(width * (0.2 + scrollPercent)),
            },
        };

        const { fromY = cy, toY = cy, fromX = cx, toX = cx } = vectors[direction];

        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: fromX, y: fromY },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 300 },
                    { type: 'pointerMove', duration: 800, x: toX, y: toY },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        await driver.releaseActions();
    }

    // ─── Alerts ───────────────────────────────────────────────────────────────

    async acceptAlert(): Promise<void> {
        try {
            await driver.acceptAlert();
        } catch (_) {
            /* no alert present */
        }
    }

    async dismissAlert(): Promise<void> {
        try {
            await driver.dismissAlert();
        } catch (_) {
            /* no alert present */
        }
    }

    // ─── App State ────────────────────────────────────────────────────────────

    async backgroundApp(seconds = 3): Promise<void> {
        await driver.background(seconds);
    }

    async pause(ms = 1000): Promise<void> {
        await driver.pause(ms);
    }
}

export default BasePage;
