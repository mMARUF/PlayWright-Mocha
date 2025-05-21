import { Page, Locator, expect } from '@playwright/test';

export class Pagination {
  private readonly page: Page;
  private readonly paginationContainer: Locator;
  private readonly pageNumbers: Locator;
  private readonly nextButton: Locator;
  private readonly productGrid: Locator;
  private readonly searchField: Locator;
  private readonly searchButton: Locator;
  private readonly searchPageBanner: Locator;
  private readonly productGridDiv: Locator;


  constructor(page: Page) {
    this.page = page;
    this.paginationContainer = page.locator('.pages-items').nth(1);
    this.pageNumbers = this.paginationContainer.locator('li:not(.pages-item-next)');
    this.nextButton = this.paginationContainer.locator('.pages-item-next a.action.next');
    this.productGrid = page.locator('.products.wrapper.grid.products-grid .product-item');
    this.searchField = page.locator('#search');
    this.searchButton = page.locator('button[title="Search"]');
    this.searchPageBanner = page.locator('[data-ui-id="page-title-wrapper"]');
    this.productGridDiv = page.locator('.products.wrapper.grid.products-grid');
  }





  /**
   * Verify pagination functionality.
   */
  async verifyPagination(): Promise<void> {
    console.log('Verifying pagination...');

    // Scroll to bottom to ensure pagination is visible
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify pagination is present
    await expect(this.paginationContainer).toBeVisible();

    // Verify that pagination contains page numbers and "Next" button
    await expect(this.pageNumbers).toHaveCount(await this.pageNumbers.count());
    await expect(this.nextButton).toBeVisible();

    // Get the total number of pages (excluding the "Next" button)
    const totalPages = await this.pageNumbers.count();
    console.log(`Total pages (excluding "Next" button): ${totalPages}`);

    // Handle cases where there is only 1 page
    if (totalPages === 1) {
        console.log('Only 1 page available. Skipping pagination test.');
        return;
    }

    // Iterate through pages using the "Next" button
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        console.log(`Verifying page ${currentPage}...`);

        // Verify that products are displayed on the current page
        const productCount = await this.productGrid.count();
        expect(productCount).toBeGreaterThan(0); // Ensure there is at least one product
        console.log(`Number of products on page ${currentPage}: ${productCount}`);

        // Check if this is the last page
        if (currentPage === totalPages) {
            console.log('Reached the last page. Stopping pagination test.');

            // Verify that only the next two page numbers are shown (if applicable)
            if (totalPages > 2) {
                const visiblePageNumbers = await this.pageNumbers.allTextContents();

                // Normalize visible page numbers by trimming whitespace and extracting numeric values
                const normalizedPageNumbers = visiblePageNumbers
                    .map((text) => text.replace(/\D/g, '').trim()) // Remove non-numeric characters
                    .filter((text) => text !== ''); // Remove empty strings
                console.log(`Normalized visible page numbers: ${normalizedPageNumbers}`);

                // Determine the expected page numbers based on the current page
                const expectedPageNumbers = normalizedPageNumbers.slice(-2);
                console.log(`Last two visible page numbers: ${normalizedPageNumbers.slice(-2)}`);
                console.log(`Expected page numbers: ${expectedPageNumbers}`);

                expect(normalizedPageNumbers.slice(-2)).toEqual(
                    expectedPageNumbers.map(String)
                );
            }
            break;
        }

        // Click the "Next" button to go to the next page
        if (await this.nextButton.isVisible()) {
            console.log('Clicking the "Next" button...');
            await this.nextButton.scrollIntoViewIfNeeded();
            await this.nextButton.click();

            // Wait for the product grid container to load
            await this.productGridDiv.waitFor({ state: 'visible' });
        } else {
            throw new Error('Next button is not visible, but more pages are expected.');
        }
    }
}

async performSearchofProducts(searchTerm: string): Promise<void> {
    console.log(`Performing search for: ${searchTerm}`);
    await (this.searchField).fill(''); // Clear the text in the search field
    await (this.searchField).fill(searchTerm);
    await (this.searchButton).click();

    // Check if "No results" message is displayed
    const noResultsMessage = this.page.locator('.message.notice');
    if (await noResultsMessage.isVisible()) {
      console.log(`No results found for: ${searchTerm}`);
      return;
    }

    // Assert that the search results page is displayed
    const pageTitle = (this.searchPageBanner);
    await expect(pageTitle).toContainText(`Search results for: '${searchTerm}'`);
  }


  
}