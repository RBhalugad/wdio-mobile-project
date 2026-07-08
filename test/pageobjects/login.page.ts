import BasePage from './base.page';

/**
 * LoginPage
 *
 * Selectors use accessibility IDs (~label) so they work on both platforms.
 * Override per-platform if needed with get() + this.isAndroid checks.
 */
class LoginPage extends BasePage {
  // ─── Selectors ────────────────────────────────────────────────────────────

  get emailField(): ReturnType<typeof $> {
    return this.isAndroid
      ? $('android=new UiSelector().resourceId("com.example.app:id/et_email")')
      : $('~email_field');
  }

  get passwordField(): ReturnType<typeof $> {
    return this.isAndroid
      ? $('android=new UiSelector().resourceId("com.example.app:id/et_password")')
      : $('~password_field');
  }

  get loginButton(): ReturnType<typeof $> {
    return $('~login_button');
  }

  get forgotPasswordLink(): ReturnType<typeof $> {
    return $('~forgot_password_link');
  }

  get errorBanner(): ReturnType<typeof $> {
    return $('~error_banner');
  }

  get signUpLink(): ReturnType<typeof $> {
    return $('~sign_up_link');
  }

  get biometricButton(): ReturnType<typeof $> {
    return $('~biometric_login_button');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<void> {
    await this.clearAndType(await this.emailField, email);
    await this.clearAndType(await this.passwordField, password);
    await (await this.loginButton).click();
  }

  async tapForgotPassword(): Promise<void> {
    await (await this.forgotPasswordLink).click();
  }

  async tapSignUp(): Promise<void> {
    await (await this.signUpLink).click();
  }

  // ─── Assertions / State ───────────────────────────────────────────────────

  async isDisplayed(timeout = 10000): Promise<boolean> {
    await (await this.loginButton).waitForDisplayed({ timeout });
    return (await this.loginButton).isDisplayed();
  }

  async getErrorText(): Promise<string> {
    await (await this.errorBanner).waitForDisplayed({ timeout: 6000 });
    return (await this.errorBanner).getText();
  }

  async hasError(): Promise<boolean> {
    try {
      await (await this.errorBanner).waitForDisplayed({ timeout: 3000 });
      return (await this.errorBanner).isDisplayed();
    } catch (_) {
      return false;
    }
  }
}

export default new LoginPage();
