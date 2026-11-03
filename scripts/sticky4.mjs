import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
for (const w of [360, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const res = await page.evaluate(() => {
    window.scrollTo(200, 0);
    const sx = window.scrollX;
    const de = document.documentElement;
    return { sw: de.scrollWidth, cw: de.clientWidth, scrollX: sx, bodySW: document.body.scrollWidth, bodyCW: document.body.clientWidth };
  });
  console.log(w, JSON.stringify(res));
  await ctx.close();
}
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 4200));
await page.waitForTimeout(400);
console.log("pin top", await page.evaluate(() => Math.round(document.querySelector(".film__pin").getBoundingClientRect().top)));
await browser.close();
