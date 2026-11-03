import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(4200);
const top = await page.evaluate(() => document.getElementById("film").getBoundingClientRect().top + window.scrollY);
console.log("film top", top);
for (let k = 0; k < 5; k++) {
  const y = top + k * 620;
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1400);
  const info = await page.evaluate(() => {
    const f = document.getElementById("film");
    const c = f.querySelector("canvas");
    return { y: Math.round(window.scrollY), ftop: Math.round(f.getBoundingClientRect().top), ch: c ? c.height : -1, cw: c ? c.width : -1 };
  });
  console.log(k, JSON.stringify(info));
  await page.screenshot({ path: ".screens/fm-" + k + ".png" });
}
await browser.close();
