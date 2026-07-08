import loginPage from '../../pageobjects/login.page';
import homePage from '../../pageobjects/home.page';
import users from '../../data/users';

describe('Login', () => {
    // ─── Reset app state before every test ──────────────────────────────────
    beforeEach(async () => {
        await driver.reloadSession();
        await loginPage.isDisplayed();
    });

    // ─── Happy paths ─────────────────────────────────────────────────────────

    it('should log in with valid credentials', async () => {
        await loginPage.login(users.valid.email, users.valid.password);
        const homeShown = await homePage.isDisplayed();
        expect(homeShown).toBe(true);
    });

    it('should persist session after backgrounding the app', async () => {
        await loginPage.login(users.valid.email, users.valid.password);
        await homePage.isDisplayed();

        await driver.background(3); // background for 3 seconds

        const stillHome = await homePage.isDisplayed();
        expect(stillHome).toBe(true);
    });

    // ─── Error states ─────────────────────────────────────────────────────────

    it('should show error for invalid credentials', async () => {
        await loginPage.login(users.invalid.email, users.invalid.password);
        const error = await loginPage.getErrorText();
        expect(error).toContain('Invalid email or password');
    });

    it('should remain on login screen after failed login', async () => {
        await loginPage.login(users.invalid.email, users.invalid.password);
        const onLogin = await loginPage.isDisplayed();
        expect(onLogin).toBe(true);
    });

    // ─── Field validation (data-driven) ──────────────────────────────────────

    users.edgeCases.forEach(({ email, password, expectedError }) => {
        it(`should show "${expectedError}" when email="${email || '(empty)'}" password="${password || '(empty)'}"`, async () => {
            await loginPage.login(email, password);
            const error = await loginPage.getErrorText();
            expect(error).toContain(expectedError);
        });
    });

    // ─── Navigation ───────────────────────────────────────────────────────────

    it('should navigate to forgot password screen', async () => {
        await loginPage.tapForgotPassword();
        const header = await $('~forgot_password_header');
        await header.waitForDisplayed({ timeout: 6000 });
        expect(await header.isDisplayed()).toBe(true);
    });

    it('should navigate to sign up screen', async () => {
        await loginPage.tapSignUp();
        const header = await $('~sign_up_header');
        await header.waitForDisplayed({ timeout: 6000 });
        expect(await header.isDisplayed()).toBe(true);
    });

    // ─── Smoke tag (subset used by smoke suite) ───────────────────────────────

    it('[smoke] should complete login successfully', async () => {
        await loginPage.login(users.valid.email, users.valid.password);
        expect(await homePage.isDisplayed()).toBe(true);
    });
});
