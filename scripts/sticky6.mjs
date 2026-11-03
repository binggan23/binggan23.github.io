import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const probe = async (label) => {
  await page.evaluate(() => window.scrollTo(0, 4200));
  await page.waitForTimeout(400);
  const t = await page.evaluate(() => Math.round(document.querySelector(".film__pin").getBoundingClientRect().top));
  console.log(label, "pin top", t);
  await page.evaluate(() => window.scrollTo(0, 0));
};
await probe("as-is");
await page.addStyleTag({ content: "html{overflow:visible!important} body{overflow:visible!important}" });
await probe("no-overflow");
await browser.close();
