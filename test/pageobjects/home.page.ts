import BasePage from './base.page';

class HomePage extends BasePage {
    // ─── Selectors ────────────────────────────────────────────────────────────

    get welcomeHeader(): ReturnType<typeof $> {
        return $('~welcome_header');
    }
    get profileButton(): ReturnType<typeof $> {
        return $('~profile_button');
    }
    get settingsButton(): ReturnType<typeof $> {
        return $('~settings_button');
    }
    get logoutButton(): ReturnType<typeof $> {
        return $('~logout_button');
    }
    get searchBar(): ReturnType<typeof $> {
        return $('~search_bar');
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async logout(): Promise<void> {
        await (await this.profileButton).click();
        await (await this.logoutButton).waitForDisplayed({ timeout: 5000 });
        await (await this.logoutButton).click();
    }

    async search(query: string): Promise<void> {
        await (await this.searchBar).click();
        await (await this.searchBar).setValue(query);
        await driver.hideKeyboard();
    }

    // ─── Assertions / State ───────────────────────────────────────────────────

    async isDisplayed(timeout = 12000): Promise<boolean> {
        await (await this.welcomeHeader).waitForDisplayed({ timeout });
        return (await this.welcomeHeader).isDisplayed();
    }

    async getWelcomeText(): Promise<string> {
        return (await this.welcomeHeader).getText();
    }
}

export default new HomePage();
