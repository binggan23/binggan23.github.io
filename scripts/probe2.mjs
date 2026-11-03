import { chromium } from "playwright-core";
const EXEC = "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
const info = await page.evaluate(() => {
  const stack = document.elementsFromPoint(300, 25).map((el) => {
    const cs = getComputedStyle(el);
    return `${el.tagName}.${el.className.toString().slice(0, 40)} bg=${cs.backgroundColor} img=${cs.backgroundImage.slice(0, 60)}`;
  });
  return stack;
});
console.log(info.join("\n"));
await page.screenshot({ path: ".screens/top-strip.png", clip: { x: 0, y: 0, width: 1600, height: 120 } });
await browser.close();
