import { Page, Locator, expect } from '@playwright/test';
import { basePage } from './basePage';

export class SignInPage extends basePage {
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly pageTitleWrapper: Locator;
    private readonly signOutButton: Locator;
    private readonly authorizationLink: Locator;    

    constructor(page: Page) {
        super(page);
        this.emailInput = this.page.getByTitle('Email');
        this.passwordInput = this.page.getByLabel('Password');
        this.signInButton = this.page.getByRole('button', { name: 'Sign In' });
        this.pageTitleWrapper = this.page.locator('[data-ui-id="page-title-wrapper"]');
        this.signOutButton = this.page.locator("div[class='panel header'] button[type='button']");
        this.authorizationLink = this.page.locator("div[aria-hidden='false'] ul[class='header links'] li.authorization-link");        
    }

    async navigate(): Promise<void> {
        const baseURL = process.env.BASE_URL;
        await this.page.goto(`${baseURL}/customer/account/login`);

        // Explicitly wait for the email input field to be visible
        await this.emailInput.waitFor({ state: 'visible' });

        // Verify the page URL
        await this.verifyPageUrl();
    }

    protected getPageUrl(): RegExp {
        return /customer\/account\/login/;
    }

    async userSignIn(email: string, password: string): Promise<void> {
        // Wait for the email input field to be visible before interacting
        await this.emailInput.waitFor({ state: 'visible' });

        // Fill in the email and password fields
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);

        // Click the sign-in button
        await this.signInButton.click();

        await this.waitForPageLoad();
    }

    async verifySuccessfulLogin(): Promise<void> {
        // URL wil contain loggedin path
        await this.verifyUrlContains('/customer/account');

        // Wait for the page title
        await this.verifyPageTitle('My Account');
    }

    private async verifyUrlContains(expectedPath: string): Promise<void> {
        const regex = new RegExp(`${expectedPath}(\\/index)?\\/?$`);
        console.log('Waiting for URL to match:', regex);
        await this.page.waitForURL(regex);
    }

    private async verifyPageTitle(expectedTitle: string): Promise<void> {
        // Wait for the page title wrapper to be visible
        await this.pageTitleWrapper.waitFor({ state: 'visible' });

        // Verify the text content of the page title
        const textContent = await this.pageTitleWrapper.textContent();
        if (textContent?.trim() !== expectedTitle) {
            throw new Error(`Expected page title to be "${expectedTitle}", but got "${textContent?.trim()}"`);
        }
    }
    async signOut() {
        // Perform sign-out actions
        await this.signOutButton.click();
        await this.authorizationLink.click();
      }

      async verifySuccessfulLogout(): Promise<void> {
        // Verify the URL after logout
        await this.page.waitForURL(/customer\/account\/logoutSuccess/);
    
        // Verify the logout success message
        const logoutSuccessMessage = this.page.locator('.base');
        await expect(logoutSuccessMessage).toHaveText('You are signed out');
    }  
}