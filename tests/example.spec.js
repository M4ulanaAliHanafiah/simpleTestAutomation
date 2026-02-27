const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://practicetestautomation.com/practice-test-login';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('//input[@name="username"]')).toBeVisible();
  });

  test('berhasil login dengan kredensial valid', async ({ page }) => {
    await page.locator('//input[@name="username"]').fill('student');
    await page.locator('//input[@name="password"]').fill('Password123');
    await page.locator('//button[@id="submit"]').click();

    // expected result
    await expect(page).toHaveURL(/logged-in-successfully/);
    await expect(page.locator('//h1[@class="post-title"]')).toContainText("Logged In Successfully");

    // memastikan button logout muncul
    await expect(page.locator('a', { hasText: 'Log out' })).toBeVisible();
  });

  test('gagal login dengan username salah', async ({ page }) => {
    await page.locator('//input[@name="username"]').fill('incorrectUser');
    await page.locator('//input[@name="password"]').fill('Password123');
    await page.locator('//button[@id="submit"]').click();

    // Tidak boleh redirect ke halaman Logged In Successfully
    await expect(page).not.toHaveURL(/logged-in-successfully/);

    // expected Error message dengan harus muncul teks yang tepat
    const errorMsg = page.locator('//div[@id="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Your username is invalid!');
  });

  test('gagal login dengan password salah', async ({ page }) => {
    await page.locator('//input[@name="username"]').fill('student');
    await page.locator('//input[@name="password"]').fill('incorrectPassword');
    await page.locator('//button[@id="submit"]').click();

    // Tidak boleh redirect ke halaman logged in successfully
    await expect(page).not.toHaveURL(/logged-in-successfully/);

    // expected Error message dengan harus muncul teks yang tepat
    const errorMsg = page.locator('//div[@id="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Your password is invalid!');
  });

  test('bisa logout setelah berhasil login', async ({ page }) => {
    await page.locator('//input[@name="username"]').fill('student');
    await page.locator('//input[@name="password"]').fill('Password123');
    await page.locator('//button[@id="submit"]').click();
    await expect(page).toHaveURL(/logged-in-successfully/);

    // Logout
    await page.locator('a', { hasText: 'Log out' }).click();

    // Harus direct ke page login
    await expect(page).toHaveURL(/practice-test-login/);
    await expect(page.locator('//input[@name="username"]')).toBeVisible();
  });
});