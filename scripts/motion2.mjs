import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 800 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(6000);
const shots = [];
for (let i = 0; i < 3; i++) {
  await page.screenshot({ path: ` .screens/mv-${i}.png`.trim() });
  shots.push(createHash("sha1").update(readFileSync(`.screens/mv-${i}.png`)).digest("hex").slice(0, 10));
  await page.waitForTimeout(900);
}
// scroll-spin test: does the reactor turn when the wheel moves?
await page.evaluate(() => window.scrollTo({ top: 260, behavior: "instant" }));
await page.waitForTimeout(700);
await page.screenshot({ path: ".screens/mv-scroll.png" });
shots.push(createHash("sha1").update(readFileSync(".screens/mv-scroll.png")).digest("hex").slice(0, 10));
console.log("hashes", shots.join(" "), new Set(shots).size === shots.length ? "ALL DIFFER (animating)" : "SOME IDENTICAL");
await ctx.close();
await browser.close();
