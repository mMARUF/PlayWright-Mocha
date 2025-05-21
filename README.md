# **Project Name**: Playwright-Mocha-TypeScript Automation Framework

---

## **Project Type**:

This project is a Playwright-based automation framework written in TypeScript and built using the Mocha testing framework. It follows the Page Object Model (POM) design pattern to ensure modularity, maintainability, and reusability. Each page of the application is represented as a class, encapsulating its locators and actions, making it easy to manage and extend the test cases. The framework is designed to handle end-to-end testing scenarios efficiently while adhering to best practices.

## **Framework**:

Mocha

## **Language**:

TypeScript (TS)

---

## **How to Install and Run This Project**

1. **Clone the Repository**:

```bash
git clone <repository-url>
cd Playwright-Mocha-TypeScript

```

2. **Install Dependencies**:
   Run the following command to install all required dependencies:

```bash
npm install 
npm playwright install
```

3. **Run The Tests**:
   Execute the following command to run all tests:

```bash
npx playwright test 
```

4. **Run Specific Test Spec File:**:
   To run a specific test spec file, use:

```bash
npx playwright test <test-file-path> --project=chromium
```

5. **Run Specific Test Block:**:
   To run a specific test block inside a spec file, use:

```bash
npx playwright test <test-file-path> --project=chromium -g "<Test Block Name in the Spec File>"
```

6. **Generate and View Reports:**:
   After running the tests, generate and view the HTML report:

```bash
npx playwright show-report
```

8. **Project Structure:**:
   The project follows a clean and modular structure:

```ini
Playwright-Mocha-TypeScript/
│
├── tests/
│   ├── e2e/                     # End-to-End Test Files
│   │   ├── user-journey.spec.ts
│   │   ├── extra.spec.ts
│   │   └── ...
│   ├── PageObjects/             # Page Object Model Classes
│   │   ├── signInPage.ts
│   │   ├── userJourney.ts
│   │   └── ...
│   ├── data/                    # Test Data Files
│   │   ├── testData.json
│   │   └── ...
│   └── utils/                   # Utility Functions
│
├── .github/workflows/           # GitHub Actions Workflows
│   ├── node.js.yml
│
├── [urls.env]                   # Environment Variables
├── [playwright.config.ts]       # Playwright Configuration
├── [package.json]               # Project Dependencies
└── [README.md]                  # Project Documentation

```

9. **Page Object Model (POM):**:
   This project implements the Page Object Model (POM) design pattern to enhance code reusability and maintainability. Each page of the application is represented as a class, encapsulating its locators and actions. For example:
10. `SignInPage` handles login-related actions.
11. `UserJourney` handles user-specific workflows like adding products to the cart, wishlist, or comparison list.

12. **Test Cases Executed:**
   The following test cases have been automated and executed through this project:
      - Login of User
      - Registration of User
      - Logout of User
      - Searching Product by Logged-in User
      - Visiting Desired Product Page
      - Adding Product to the Cart
      - Removing All Products from the Cart
      - Adding Product to the Wish List
      - Removing Product from the Wish List
      - Adding Product to the Compare List
      - Removing Product from the Compare List
      - Adding Review to a Product
      - Pagination Testing of the Website

13. **Environment Management:**:
   This project uses the dotenv package to manage multiple environments. The `urls.env` file is used to store environment-specific variables such as the base URL and login credentials.

Installation: `npm install dotenv`

Example:

```bash
BASE_URL=https://magento.softwaretestingboard.com
```

Usage:
The environment variables are loaded in the test files using:

```bash
import * as dotenv from 'dotenv';
dotenv.config({ path: './urls.env' });
```

This project is designed to be modular, maintainable, and scalable, making it easy to add new test cases or extend existing functionality.

# GitHub Actions Integration

This project includes a GitHub Actions workflow to automate the execution of Playwright tests on every push or pull request to the `main` branch. The workflow is defined in the `.github/workflows/playwright-tests.yml` file and ensures that the tests are run in a CI/CD pipeline.

To trigger the workflow:

-> Push changes to the main branch.
-> Open a pull request targeting the main branch.

The workflow installs dependencies, sets up Playwright browsers, and runs the tests in a headless mode.

# Test Data Management

This project uses a separate `testData.json` file to manage test data for data-driven testing. The file is located in the `tests/data/` directory and contains user inputs and other test-related data.

Example `testData.json`:

```bash

{
  "users": [
    {
      "username": "testuser@example.com",
      "password": "securepassword123"
    }
  ],
  "products": [
    {
      "name": "Beaumont Summit Kit",
      "category": "Gear"
    }
  ]
}
```

The test data is loaded dynamically in the test files to avoid hardcoding values, making the tests more flexible and maintainable.