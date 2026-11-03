import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
for (const css of ["html{overflow-x:clip!important;overflow-y:visible!important}", "html{overflow-x:clip!important}", "html{overflow:clip!important}"]) {
  await page.addStyleTag({ content: css });
  await page.waitForTimeout(250);
  const res = await page.evaluate(() => { window.scrollTo(300, 0); return { sx: window.scrollX, sw: document.documentElement.scrollWidth }; });
  console.log(css, JSON.stringify(res));
  await page.evaluate(() => window.scrollTo(0, 0));
}
await page.addStyleTag({ content: "html{overflow-x:clip!important}" });
await page.evaluate(() => window.scrollTo(0, 4200));
await page.waitForTimeout(400);
console.log("pin top", await page.evaluate(() => Math.round(document.querySelector(".film__pin").getBoundingClientRect().top)));
await browser.close();
