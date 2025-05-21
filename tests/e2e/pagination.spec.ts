import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { SignInPage } from '../PageObjects/signInPage';
import { Pagination } from '../PageObjects/pagination';

// Load environment variables from urls.env
dotenv.config({ path: './urls.env' });

test.describe('Pagination Tests', () => {
  test('Verify pagination functionality fo the website', async ({ page }) => {
    // Navigate directly to the website
    const loginPage = new SignInPage(page);
    const pagination = new Pagination(page);
    await loginPage.navigate();

    // Search for "Jacket, T-shirt, pants"
    await pagination.performSearchofProducts('Jacket, T-shirt, pants');

    // Verify pagination
    await pagination.verifyPagination();
  });

});