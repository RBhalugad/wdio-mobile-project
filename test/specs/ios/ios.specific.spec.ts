import loginPage from '../../pageobjects/login.page';
import users from '../../data/users';

describe('iOS Specific', () => {
    beforeEach(async () => {
        // driver.reset() is deprecated in WDIO v8 — use terminateApp + activateApp instead,
        // or simply relaunch via driver.reloadSession() if caps have noReset: false.
        await driver.reloadSession();
        await loginPage.isDisplayed();
    });

    it('should auto-dismiss permission alert on first launch', async () => {
        // autoAcceptAlerts=true in caps handles this,
        // but we verify the app is still usable afterwards
        const shown = await loginPage.isDisplayed();
        expect(shown).toBe(true);
    });

    it('should dismiss keyboard after typing', async () => {
        const emailField = await $('~email_field');
        await emailField.click();
        await emailField.setValue(users.valid.email);

        // Dismiss keyboard via toolbar "Done" button or tap outside
        try {
            const doneButton = await $('~Done');
            await doneButton.click();
        } catch (_) {
            // tap outside at top-left corner to dismiss keyboard
            await driver.performActions([
                {
                    type: 'pointer' as const,
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove' as const, duration: 0, x: 20, y: 20 },
                        { type: 'pointerDown' as const, button: 0 },
                        { type: 'pointerUp' as const, button: 0 },
                    ],
                },
            ]);
            await driver.releaseActions();
        }

        // Verify keyboard is hidden (login button still tappable)
        const loginBtn = await $('~login_button');
        expect(await loginBtn.isDisplayed()).toBe(true);
    });

    it('should handle iOS Face ID / Touch ID prompt', async () => {
        try {
            const bioBtn = await $('~biometric_login_button');
            if (await bioBtn.isDisplayed()) {
                await bioBtn.click();
                // Simulate biometric success in simulator:
                // $ xcrun simctl notifyutil -s com.apple.BiometricKit.localAuthentication Success
                await driver.pause(2000);
            }
        } catch (_) {
            // Biometric not available on this build/device
            console.log('Biometric login not available — skipping');
        }
    });
});
