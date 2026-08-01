import { expect, test } from "@playwright/test";

test("renders the private payroll and public disclosure boundaries", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("VeilPay — Private payroll");
  await expect(page.getByRole("heading", { name: "Recipients" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Disclose the total, never the salaries." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review and encrypt" })).toBeDisabled();
  await expect(page.getByText("NO BATCH LOADED")).toBeVisible();
});

test("reads and publicly decrypts the verified Sepolia batch", async ({ page }) => {
  await page.goto("/#disclosure-heading");
  await page.getByRole("button", { name: "Check disclosure" }).click();
  await expect(page.getByText("PUBLIC AGGREGATE")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("3 USDC")).toBeVisible();
});

test("does not introduce horizontal overflow", async ({ page }) => {
  await page.goto("/#disclosure-heading");
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
  await expect(page.getByRole("button", { name: "Check disclosure" })).toBeVisible();
});
