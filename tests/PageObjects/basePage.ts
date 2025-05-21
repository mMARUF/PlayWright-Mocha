import { expect, Locator, Page } from '@playwright/test';

export abstract class basePage {
    constructor(protected page: Page) {}

    abstract navigate(): Promise<void>;
    protected abstract getPageUrl(): RegExp;

    async verifyPageUrl() {
        await this.page.waitForURL(this.getPageUrl());
    }

    async verifyText(expectedText: string): Promise<void> {
        // Check the success message locator
        const successMessage = this.page.locator('.message-success.success.message').filter({ hasText: expectedText });

        // Check the product name locator
        const productName = this.page.locator('#wishlist-view-form div.product-item-info [class="product-item-name"]').filter({ hasText: expectedText });

        // Wait for either locator to be visible
        await Promise.race([
            successMessage.waitFor({ state: 'visible' }).catch(() => {}),
            productName.waitFor({ state: 'visible' }).catch(() => {}),
        ]);

        // Ensure at least one of the locators resolves to exactly one element
        const successMessageCount = await successMessage.count();
        const productNameCount = await productName.count();

        if (successMessageCount === 1) {
            // Verify the success message
            await expect(successMessage).toContainText(expectedText);
        } else if (productNameCount === 1) {
            // Verify the product name in the wishlist
            await expect(productName).toContainText(expectedText);
        } else {
            throw new Error(`Expected text "${expectedText}" not found in either success message or product name.`);
        }
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('load'); // Wait for the page to fully load
    }
}