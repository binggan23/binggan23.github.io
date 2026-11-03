import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const h = await page.evaluate(() => document.body.scrollHeight);
const steps = 9;
for (let i = 0; i < steps; i++) {
  const y = Math.round((h - 900) * (i / (steps - 1)));
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await page.waitForTimeout(950);
  await page.screenshot({ path: `.screens/sc-${i}.png` });
}
console.log("h", h);
await browser.close();
