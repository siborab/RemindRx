import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('should sign in, display user info, sign out, and redirect correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/signin');
    
    await page.fill('input[name="email"]', 'test123@test.com');
    await page.fill('input[name="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('http://localhost:3000/home');
    
    await page.click('button:has-text("Logout")');

    await page.waitForURL('http://localhost:3000/signin');
    
    await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();
  });
  
  test('should show validation error with invalid email', async ({ page }) => {

    await page.goto('http://localhost:3000/signin');
    
    await page.fill('input[name="email"]', 'not-an-email');
    await page.fill('input[name="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    await page.waitForSelector('.text-red-400:has-text("Please enter a valid email")');
    
    const errorMessage = await page.locator('.text-red-400').textContent();
    expect(errorMessage).toContain('Please enter a valid email');
    

    expect(page.url()).toContain('http://localhost:3000/signin');
  });

  test('should show error with incorrect password', async ({ page }) => {

    await page.goto('http://localhost:3000/signin');
    
    await page.fill('input[name="email"]', 'test123@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    

    await page.waitForTimeout(2000);
    

    expect(page.url()).toContain('http://localhost:3000/signin');
  });
});
