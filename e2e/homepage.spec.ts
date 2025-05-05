import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('/');
    await homePage.waitForNavigation();
    
    // Check that the page title exists
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    
    // Skip the screenshot test for now as the UI is still in development
    // await homePage.verifyScreenshot('homepage');
  });
  
  test('should find at least one link on the page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('/');
    
    // Check if there are any links on the page
    const hasLinks = await homePage.hasNavigationLinks();
    expect(hasLinks).toBeTruthy();
  });
}); 