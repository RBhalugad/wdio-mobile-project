type SwipeDirection = 'up' | 'down' | 'left' | 'right';

interface ElementBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

// ─── W3C Action helpers — keep action objects correctly typed ─────────────────

const touch = (id: string, actions: object[]) => ({
    type: 'pointer' as const,
    id,
    parameters: { pointerType: 'touch' as const },
    actions,
});

const move = (x: number, y: number, duration = 0) => ({
    type: 'pointerMove' as const,
    duration,
    x,
    y,
});
const down = () => ({ type: 'pointerDown' as const, button: 0 });
const up = () => ({ type: 'pointerUp' as const, button: 0 });
const pause = (duration: number) => ({ type: 'pause' as const, duration });

/**
 * Gesture helpers — multi-touch, scroll-to-find, pinch/zoom, drag & drop.
 * Uses the W3C WebDriver Actions API (Appium 2.x compatible).
 */
class Gestures {
    // ─── Tap & Long Press ─────────────────────────────────────────────────────

    async tapByCoordinates(x: number, y: number): Promise<void> {
        await driver.performActions([touch('finger1', [move(x, y), down(), pause(80), up()])]);
        await driver.releaseActions();
    }

    async longPress(element: WebdriverIO.Element, durationMs = 2000): Promise<void> {
        const { x, y } = await this._elementCenter(element);
        await driver.performActions([
            touch('finger1', [move(x, y), down(), pause(durationMs), up()]),
        ]);
        await driver.releaseActions();
    }

    // ─── Swipe ────────────────────────────────────────────────────────────────

    async swipeUp(scrollPercent = 0.5): Promise<void> {
        await this._swipe('up', scrollPercent);
    }

    async swipeDown(scrollPercent = 0.5): Promise<void> {
        await this._swipe('down', scrollPercent);
    }

    async swipeLeft(scrollPercent = 0.6): Promise<void> {
        await this._swipe('left', scrollPercent);
    }

    async swipeRight(scrollPercent = 0.6): Promise<void> {
        await this._swipe('right', scrollPercent);
    }

    /**
     * Swipe left on a specific element (e.g. a carousel card).
     */
    async swipeElementLeft(element: WebdriverIO.Element): Promise<void> {
        const { x, y, width, height } = await this._elementBounds(element);
        await driver.performActions([
            touch('finger1', [
                move(Math.round(x + width * 0.8), Math.round(y + height / 2)),
                down(),
                pause(300),
                {
                    type: 'pointerMove' as const,
                    duration: 600,
                    x: Math.round(x + width * 0.1),
                    y: Math.round(y + height / 2),
                },
                up(),
            ]),
        ]);
        await driver.releaseActions();
    }

    // ─── Scroll to Element ────────────────────────────────────────────────────

    /**
     * Swipe up repeatedly until the selector is visible.
     */
    async scrollUntilVisible(
        selector: string,
        maxAttempts = 8,
        direction: SwipeDirection = 'up',
    ): Promise<WebdriverIO.Element> {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const el = await $(selector);
                if (await el.isDisplayed()) return el;
            } catch (_) {
                /* not found yet */
            }
            await this._swipe(direction, 0.35);
            await driver.pause(400);
        }
        throw new Error(`Element "${selector}" not found after ${maxAttempts} scrolls`);
    }

    // ─── Pinch & Zoom ─────────────────────────────────────────────────────────

    async pinchToZoomIn(element: WebdriverIO.Element): Promise<void> {
        const { x, y } = await this._elementCenter(element);
        await this._pinch(x, y, true);
    }

    async pinchToZoomOut(element: WebdriverIO.Element): Promise<void> {
        const { x, y } = await this._elementCenter(element);
        await this._pinch(x, y, false);
    }

    // ─── Drag & Drop ──────────────────────────────────────────────────────────

    async dragAndDrop(sourceSelector: string, targetSelector: string): Promise<void> {
        const src = await $(sourceSelector);
        const tgt = await $(targetSelector);
        const { x: sx, y: sy } = await this._elementCenter(src);
        const { x: tx, y: ty } = await this._elementCenter(tgt);

        await driver.performActions([
            touch('finger1', [
                move(sx, sy),
                down(),
                pause(600),
                { type: 'pointerMove' as const, duration: 1000, x: tx, y: ty },
                pause(300),
                up(),
            ]),
        ]);
        await driver.releaseActions();
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private async _swipe(direction: SwipeDirection, scrollPercent: number): Promise<void> {
        const { width, height } = await driver.getWindowSize();
        const cx = Math.round(width / 2);
        const cy = Math.round(height / 2);

        let fromX = cx,
            toX = cx,
            fromY = cy,
            toY = cy;
        switch (direction) {
            case 'up':
                fromY = Math.round(height * 0.75);
                toY = Math.round(height * (0.75 - scrollPercent));
                break;
            case 'down':
                fromY = Math.round(height * 0.25);
                toY = Math.round(height * (0.25 + scrollPercent));
                break;
            case 'left':
                fromX = Math.round(width * 0.85);
                toX = Math.round(width * (0.85 - scrollPercent));
                break;
            case 'right':
                fromX = Math.round(width * 0.15);
                toX = Math.round(width * (0.15 + scrollPercent));
                break;
        }

        await driver.performActions([
            touch('finger1', [
                move(fromX, fromY),
                down(),
                pause(200),
                { type: 'pointerMove' as const, duration: 800, x: toX, y: toY },
                up(),
            ]),
        ]);
        await driver.releaseActions();
    }

    private async _pinch(centerX: number, centerY: number, spread = true): Promise<void> {
        const offset = spread ? 120 : -80;
        await driver.performActions([
            touch('finger1', [
                move(centerX - 60, centerY),
                down(),
                {
                    type: 'pointerMove' as const,
                    duration: 600,
                    x: centerX - 60 - offset,
                    y: centerY,
                },
                up(),
            ]),
            touch('finger2', [
                move(centerX + 60, centerY),
                down(),
                {
                    type: 'pointerMove' as const,
                    duration: 600,
                    x: centerX + 60 + offset,
                    y: centerY,
                },
                up(),
            ]),
        ]);
        await driver.releaseActions();
    }

    private async _elementCenter(element: WebdriverIO.Element): Promise<ElementBounds> {
        const loc = await element.getLocation();
        const size = await element.getSize();
        return {
            x: Math.round(loc.x + size.width / 2),
            y: Math.round(loc.y + size.height / 2),
            width: size.width,
            height: size.height,
        };
    }

    private async _elementBounds(element: WebdriverIO.Element): Promise<ElementBounds> {
        const loc = await element.getLocation();
        const size = await element.getSize();
        return { x: loc.x, y: loc.y, width: size.width, height: size.height };
    }
}

export default new Gestures();
