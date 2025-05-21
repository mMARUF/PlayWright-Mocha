import { test, expect, BrowserContext, Page } from '@playwright/test';
import { SignInPage } from '../PageObjects/signInPage';
import { UserJourney } from '../PageObjects/userJourney';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from urls.env
dotenv.config({ path: './urls.env' });

// Load test data from testData.json
const testData = JSON.parse(fs.readFileSync('./tests/data/testData.json', 'utf-8'));

// Define reusable username and password
const username = testData.users[0].username;
const password = testData.users[0].password;

let context: BrowserContext;
let page: Page;
let signInPage: SignInPage;
let userJourney: UserJourney;

test.describe('Various User Journeys', () => {
  test.beforeEach(async ({ browser }) => {
    // Create a shared browser context and page
    context = await browser.newContext();
    // Create a new page in the context
    page = await context.newPage();
    // Initialize the page objects
    signInPage = new SignInPage(page);
    userJourney = new UserJourney(page);

    // Navigate to the login page
    await signInPage.navigate();
  });

  test.afterEach(async () => {
    // Close the shared browser context
    await context.close();
  });

  test('Search for specific product', async () => {
    // Search for and verify the product
    await userJourney.searchAndVerifyProduct('Beaumont Summit Kit');
  });

  test('Adding a product to the cart', async () => {

    await signInPage.userSignIn(username, password);

    await signInPage.verifySuccessfulLogin();

    await userJourney.addProductToCart('Beaumont Summit Kit');
  });

  test('Add and remove product to comparison list', async () => {
    await userJourney.addToComparisonList('Push It Messenger Bag');
    await userJourney.removeFromComparisonList();
  });

  test('Add Product to Wish List and Remove from Wish List', async () => {
    await signInPage.userSignIn(username, password);
    await signInPage.verifySuccessfulLogin();
    await userJourney.addToWishlist('Atlas Fitness Tank');
    await userJourney.removeFromWishlist('Atlas Fitness Tank');
  });

  test('Submit a Product review', async () => {
    const timestamp = new Date().toISOString();

    await signInPage.userSignIn(username, password);
    await signInPage.verifySuccessfulLogin();
    await userJourney.submitReview(
      'Pierce Gym Short',
      4,
      `Test Review for Automation Practice - ${timestamp}`,
      `Test Review for Automation Practice - ${timestamp}`,
      `Test Review for Automation Practice - ${timestamp}`
    );
  });

  test('Clear the cart', async () => {
    // Authenticate and verify login
    await signInPage.userSignIn(username, password);
    await signInPage.verifySuccessfulLogin();

    // Clear the cart
    const isCartCleared = await userJourney.clearCart();

    // Log the result if the cart is already empty
    if (!isCartCleared) {
      console.log('The cart was already empty.');
    }
  });
});