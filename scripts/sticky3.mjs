import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
for (const css of ["html{overflow:visible!important}", "html,body{overflow:visible!important}"]) {
  await page.addStyleTag({ content: css });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 4200));
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => Math.round(document.querySelector(".film__pin").getBoundingClientRect().top));
  console.log(css, "pin top at 4200 =", r);
}
await browser.close();
