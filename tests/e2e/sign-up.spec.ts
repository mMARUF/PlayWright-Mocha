import { test } from '@playwright/test';
import { CreateAccount } from '../PageObjects/CreateAccount';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from urls.env
dotenv.config({ path: './urls.env' });

// Load test data from data.json
const testData = JSON.parse(fs.readFileSync('./tests/data/testData.json', 'utf-8'));

test.describe('Account Management - Sign Up', () => {
  test('Create new account with valid username&pass', async ({ browser }) => {
    const timestamp = new Date().getTime(); // Declare and initialize the timestamp variable

    // Create a new browser context and page
    const context = await browser.newContext();
    const page = await context.newPage();
    const createAccountPage = new CreateAccount(page); // Initialize the page object with the new page

    try {
      // Navigate to the Create Account page
      await createAccountPage.navigate();

      // Create a new account
      await createAccountPage.createAccount({
        firstName: testData.newAccount.firstName,
        lastName: testData.newAccount.lastName,
        email: `${testData.newAccount.emailPrefix}+${timestamp}@example.com`, // Use the timestamp variable
        password: testData.newAccount.password,
      });

      // Verify successful user Account creation into the website
      await createAccountPage.verifySuccessfulRegistration({
        firstName: testData.newAccount.firstName,
        lastName: testData.newAccount.lastName,
        email: `${testData.newAccount.emailPrefix}+${timestamp}@example.com`,
        password: testData.newAccount.password,
      });
    } finally {
      // Close the context after the test
      await context.close();
    }
  });
});