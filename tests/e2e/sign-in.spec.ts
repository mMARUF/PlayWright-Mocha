import { test, expect } from '@playwright/test';
import { SignInPage } from '../PageObjects/signInPage';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from urls.env
dotenv.config({ path: './urls.env' });

// Load test data from testData.json
const testData = JSON.parse(fs.readFileSync('./tests/data/testData.json', 'utf-8'));

test.describe('Account Management - Sign In & Sign Out', () => {
    let loginPage: SignInPage;
  
    test.beforeEach(async ({ page }) => {
      loginPage = new SignInPage(page);
    });
  
    test('User can successfully log in with valid username&pass', async ({ page }) => {
// Test to verify that a user can log in with valid username and password
      const username = testData.users[0].username;
      const password = testData.users[0].password;

      await loginPage.navigate();
      await loginPage.userSignIn(username, password);
  
      await loginPage.verifySuccessfulLogin();
    });
  
    test('Sign out after signing in', async ({ page }) => {

      const username = testData.users[0].username;
      const password = testData.users[0].password;

      await loginPage.navigate();
      await loginPage.userSignIn(username, password);
  
      // Verify successful login
      await loginPage.verifySuccessfulLogin();
      
      // Perform sign-out actions using the SignInPage method
      await loginPage.signOut();
  
      // Verify successful logout
      await loginPage.verifySuccessfulLogout();
    });
  });