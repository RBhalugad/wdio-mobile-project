import gestures from '../../helpers/gestures';
import loginPage from '../../pageobjects/login.page';
import homePage from '../../pageobjects/home.page';
import users from '../../data/users';

describe('Android Gestures', () => {
    before(async () => {
        // Log in once before the suite
        await loginPage.login(users.valid.email, users.valid.password);
        await homePage.isDisplayed();
    });

    it('should scroll down to reveal more content', async () => {
        await gestures.swipeUp(0.5);
        await driver.pause(500);
        const moreContent = await $('~more_content_section');
        expect(await moreContent.isDisplayed()).toBe(true);
    });

    it('should scroll back up to the top', async () => {
        await gestures.swipeDown(0.5);
        await homePage.isDisplayed();
    });

    it('should swipe carousel left', async () => {
        const carousel = await $('~featured_carousel');
        await gestures.swipeElementLeft(carousel);
        const secondCard = await $('~carousel_card_2');
        expect(await secondCard.isDisplayed()).toBe(true);
    });

    it('should long-press an item to reveal context menu', async () => {
        const item = await $('~list_item_1');
        await gestures.longPress(item, 1500);
        const contextMenu = await $('~context_menu');
        expect(await contextMenu.isDisplayed()).toBe(true);
        await driver.back();
    });

    it('should scroll to a deep element using scrollUntilVisible', async () => {
        const deepEl = await gestures.scrollUntilVisible('~deep_list_item', 10, 'up');
        expect(await deepEl.isDisplayed()).toBe(true);
    });
});
