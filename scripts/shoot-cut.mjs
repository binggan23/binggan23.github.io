import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
// desktop: the cut divider + film->arsenal seam
let ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
let page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const cutTop = await page.evaluate(() => document.querySelector(".cut")?.getBoundingClientRect().top + window.scrollY);
await page.evaluate((y) => window.scrollTo({ top: y - 380, behavior: "instant" }), cutTop);
await page.waitForTimeout(900);
await page.screenshot({ path: ".screens/cut-1.png" });
await ctx.close();

// mobile film
ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const filmTop = await page.evaluate(() => document.getElementById("film")?.offsetTop ?? 0);
await page.evaluate((y) => window.scrollTo({ top: y + 500, behavior: "instant" }), filmTop);
await page.waitForTimeout(1200);
await page.screenshot({ path: ".screens/m390-film.png" });
await ctx.close();
await browser.close();
console.log("ok");
