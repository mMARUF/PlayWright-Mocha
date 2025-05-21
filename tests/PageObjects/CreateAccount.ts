import { Page, Locator } from '@playwright/test';
import { basePage } from './basePage';

export class CreateAccount extends basePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly signUpButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = this.page.getByTitle('First Name');
    this.lastNameInput = this.page.getByTitle('Last Name');
    this.emailInput = this.page.getByTitle('Email');
    this.passwordInput = this.page.locator('input#password');
    this.confirmPasswordInput = this.page.locator('input#password-confirmation'); 
    this.signUpButton = this.page.getByTitle('Create an Account');
    this.successMessage = this.page.locator('.message-success');
  }

  async navigate(): Promise<void> {
    const baseURL = process.env.BASE_URL;
    if (!baseURL) {
      throw new Error('BASE_URL is not defined in the environment variables');
    }
    await this.page.goto(`${baseURL}/customer/account/create`);
    await this.page.waitForLoadState('load');
  }

  async createAccount(accountDetails: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    await this.firstNameInput.fill(accountDetails.firstName);
    await this.lastNameInput.fill(accountDetails.lastName);
    await this.emailInput.fill(accountDetails.email);
    await this.passwordInput.fill(accountDetails.password);
    await this.confirmPasswordInput.fill(accountDetails.password);
    await this.signUpButton.click();
  }

  async verifySuccessfulRegistration(accountDetails: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    try {
      // Wait for the success message to appear
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      const message = await this.successMessage.textContent();
      if (!message?.includes('Thank you for registering')) {
        throw new Error(
          `Expected success message to include "Thank you for registering", but got "${message?.trim()}"`
        );
      }
    } catch (error) {
      console.error('Success message not found. Checking for error message...');
  
      // Check if the error message is displayed
      const errorMessage = this.page.locator('div.message-error.error.message');
      const isErrorVisible = await errorMessage.isVisible();
  
      if (isErrorVisible) {
        const errorText = await errorMessage.textContent();
        if (errorText?.includes('Invalid Form Key. Please refresh the page.')) {
          console.error(`Error encountered: ${errorText.trim()}`);
          console.log('Reloading the page and retrying account creation...');
  
          // Reload the page
          await this.page.reload();
          await this.page.waitForLoadState('load');
  
          // Retry account creation
          await this.createAccount(accountDetails);
          return; // Exit the method after retrying
        }
      }
  
      // If no error message is found, rethrow the original error
      throw error;
    }
  }

  // Implement the abstract method from basePage
  protected getPageUrl(): RegExp {
    return /customer\/account\/create/; // Matches the URL for the Create Account page
  }
}