import { Page, Locator, expect } from '@playwright/test';
import { basePage } from './basePage';

export class UserJourney extends basePage {
    public readonly searchInput: Locator;
    public readonly searchButton: Locator;
    public readonly addToWishlistButton: Locator;
    public readonly productSizeSelector: Locator;
    public readonly productColorSelector: Locator;
    public readonly addToCartButton: Locator;
    public readonly comparisonPageButton: Locator;
    public readonly removeProductFromComparison: Locator;
    public readonly confirmRemoveFromComparison: Locator;
    public readonly addProductToComparison: Locator;
    public readonly reviewTabOfProduct: Locator;
    public readonly reviewSummaryField: Locator;
    public readonly reviewNickName: Locator;
    public readonly reviewDetailsField: Locator;
    public readonly reviewSubmitButton: Locator;
    public readonly wishIetemRemoveButton: Locator;
    public readonly addProductToWishButton: Locator;
    public readonly topMenuCartButton: Locator;
    public readonly cartPageVisitButton: Locator;
    public readonly cartPageTitleSection: Locator;
    public readonly productDelFromCart: Locator;
    public readonly blankCartDiv: Locator;
    public readonly wishPageProductBlock: Locator;
    public readonly pageTitleDiv: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = this.page.locator('#search');
        this.searchButton = this.page.locator('button[title="Search"]');
        this.addToWishlistButton = this.page.locator('div.product-info-main  a.action.towishlist');
        this.productSizeSelector = this.page.locator('.swatch-attribute.size [option-id="168"]');
        this.productColorSelector = this.page.locator('.swatch-attribute.color [option-id="58"]');
        this.addToCartButton = this.page.locator('#product-addtocart-button');
        this.comparisonPageButton = this.page.locator('.message-success.success.message a');
        this.removeProductFromComparison = this.page.locator('[title="Remove Product"]');
        this.confirmRemoveFromComparison = this.page.locator('button.action-primary.action-accept');
        this.addProductToComparison = this.page.locator('a.action.tocompare');
        this.reviewTabOfProduct = this.page.locator('#tab-label-reviews-title');
        this.reviewSummaryField = this.page.locator('#summary_field');
        this.reviewDetailsField = this.page.locator('#review_field');
        this.reviewSubmitButton = this.page.locator('button[class="action submit primary"]');
        this.wishIetemRemoveButton = this.page.locator('[title="Remove Item"]');
        this.addProductToWishButton = this.page.locator('.product-info-main a.action.towishlist');
        this.topMenuCartButton = this.page.locator('.action.showcart');
        this.cartPageVisitButton = this.page.locator('#minicart-content-wrapper .action.viewcart');
        this.cartPageTitleSection = this.page.locator('.base');
        this.productDelFromCart = this.page.locator('a.action.action-delete');
        this.blankCartDiv = this.page.locator('.cart-empty');
        this.wishPageProductBlock = this.page.locator('#wishlist-view-form div.product-item-info');
        this.pageTitleDiv = this.page.locator('.page-title');
        this.reviewNickName = this.page.locator('#nickname_field');

    }

    async clearSearchField(): Promise<void> {
        await this.searchInput.fill('');
    }

    async searchForItem(itemName: string): Promise<void> {
        await this.searchInput.fill(itemName);
        await this.searchButton.click();
    }

    async navigate(): Promise<void> {
        const baseURL = process.env.BASE_URL;
        await this.page.goto(`${baseURL}/`);
    }

    protected getPageUrl(): RegExp {
        return /\/$/; // Matches the homepage URL
    }

    async verifySearchResultsPage(expectedText: string): Promise<void> {
        const pageTitle = this.page.locator('[data-ui-id="page-title-wrapper"]');
        await expect(pageTitle).toContainText(`Search results for: '${expectedText}'`);
    }

    async verifyProductInSearchResults(productName: string): Promise<void> {
        const productLink = this.page.locator('.products.wrapper.grid.products-grid [class="product-item-link"]').filter({
            hasText: productName, // Use the full product name for a unique match
        });
        await expect(productLink).toHaveText(productName); // Assert the product name
    }


    async pauseAndPerform(action: () => Promise<void>, delay: number = 500): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, delay)); // Pause for the specified delay
        await action(); 
}


    async addProductToCart(productName: string): Promise<void> {

        
        await this.searchAndVerifyProduct('Beaumont Summit Kit');

        // Visit the product page
        await this.visitProductPage('Beaumont Summit Kit');
        
        // Select size and color options
        await this.pauseAndPerform(() => this.productSizeSelector.click());
        await this.pauseAndPerform(() => this.productColorSelector.click());
    
        // Click "Add to Cart" button
        await this.pauseAndPerform(() => this.addToCartButton.click());

        // Assert that the success message is displayed
        await this.verifyText('You added Beaumont Summit Kit to your shopping cart.');

    }


    async searchAndVerifyProduct(productName: string): Promise<void> {
        // Clear the search field
        await this.clearSearchField();
    
        // Fill the search input and click the search button
        await this.pauseAndPerform(() => this.searchInput.fill(productName));
        await this.pauseAndPerform(() => this.searchButton.click());
    
        // Assert that the search results page is displayed
        await this.verifySearchResultsPage(productName);
    
        // Assert that the desired product is listed
        await this.verifyProductInSearchResults(productName);
    }


    async visitProductPage(productName: string): Promise<void> {
        // Locate the product link based on the product name
        const productLink = this.page.locator('.products.wrapper.grid.products-grid [class="product-item-link"]').filter({
            hasText: productName,
        });
    
        // Assert that the product link is correct
        await expect(productLink).toHaveText(productName);
    
        // Click on the product link to visit the product page
        await productLink.click();
    
        // Assert that the product page title matches the product name
        await expect((this.pageTitleDiv)).toHaveText(productName);
    }


        async addToComparisonList(productName: string): Promise<void> {
            await this.searchAndVerifyProduct(productName);
            await this.visitProductPage(productName);
            await this.pauseAndPerform(() => (this.addProductToComparison).click());
            await this.verifyText(`You added product ${productName} to the comparison list.`);
        }

        async removeFromComparisonList(): Promise<void> {
            await this.pauseAndPerform(() => (this.comparisonPageButton).click());
            await this.pauseAndPerform(() => (this.removeProductFromComparison).click());
            await this.pauseAndPerform(() => (this.confirmRemoveFromComparison).click());
            await this.verifyText('You removed product');
        }


        async addToWishlist(productName: string): Promise<void> {
            await this.searchAndVerifyProduct(productName);
            await this.visitProductPage(productName);
            await this.pauseAndPerform(() => (this.addProductToWishButton).click());
            await this.verifyText(`${productName} has been added to your Wish List.`);
        }

        async removeFromWishlist(productName: string): Promise<void> {
            await expect(this.page.locator('.base')).toHaveText('My Wish List');
            const wishlistItem = (this.wishPageProductBlock)
            .filter({ hasText: productName });
            await wishlistItem.hover();
            // Locate the "Remove Item" button within the hovered wishlist item
            const removeButton = wishlistItem.locator('[title="Remove Item"]');
            await this.pauseAndPerform(() => (removeButton).click());
            await this.verifyText(`${productName} has been removed from your Wish List.`);
        }

        


        async submitReview(productName: string, rating: number, name: string, summary: string, review: string): Promise<void> {
            await this.searchAndVerifyProduct(productName);
            await this.visitProductPage(productName);
            await this.pauseAndPerform(() => (this.reviewTabOfProduct).click());
            const ratingElement = this.page.locator(`#Rating_${rating}_label`);
            await ratingElement.scrollIntoViewIfNeeded();
            await this.pauseAndPerform(() => ratingElement.click({ force: true }));
            await this.pauseAndPerform(() => (this.reviewNickName).fill(summary));
            await this.pauseAndPerform(() => (this.reviewSummaryField).fill(summary));
            await this.pauseAndPerform(() => (this.reviewDetailsField).fill(review));
            await this.pauseAndPerform(() => (this.reviewSubmitButton).click());
            await this.verifyText('You submitted your review for moderation.');
        }



  async clearCart(): Promise<boolean> {


        await this.pauseAndPerform(async () => {
            await this.topMenuCartButton.click();
        }, 3000); // Pause for 3 seconds before clicking the Cart Button

            // Check if the 'View and Edit Cart' button exists
            const isViewCartButtonVisible = await this.cartPageVisitButton.isVisible({ timeout: 5000 }); // Wait for up to 5 seconds
        
            if (!isViewCartButtonVisible) {
            console.log('The cart is already empty. No "View and Edit Cart" button available.');
            return false; // Exit the function early
            }
        
            // Wait for the 'View and Edit Cart' button to be visible
            await this.cartPageVisitButton.waitFor({ state: 'visible', timeout: 2000 });
        
            // Click on the 'View and Edit Cart' button
            await this.pauseAndPerform(() => this.cartPageVisitButton.click());
        
            await expect(this.cartPageTitleSection).toHaveText('Shopping Cart');
        
            // Check if there are any items in the cart
            const deleteCount = await this.productDelFromCart.count();
            if (deleteCount === 0) {
            console.log('The cart is already empty. No items to remove.');
            return false; // Indicate that the cart was already empty
            }
        
            // Iterate through all delete buttons and clear the cart
            for (let i = 0; i < deleteCount; i++) {
            // Click the first delete button
            await this.pauseAndPerform(() => this.productDelFromCart.nth(0).click());
        
            // Wait for the browser to complete the load
            await this.page.waitForLoadState('load');
            }
        
            // Verify that the cart is empty
            await expect(this.blankCartDiv).toContainText('You have no items in your shopping cart.');
            return true; // Indicate that the cart was cleared
        }






}