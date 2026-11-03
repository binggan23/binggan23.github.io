import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
// boot frames
for (const [i, t] of [2600, 3100, 3600, 5200].entries()) {
  await page.waitForTimeout(i === 0 ? t : t - [2600, 3100, 3600, 5200][i - 1]);
  await page.screenshot({ path: `.screens/boot-${i}.png` });
}
// hero exit frames
for (const [i, frac] of [0.35, 0.62, 0.85].entries()) {
  await page.evaluate((f) => window.scrollTo({ top: window.innerHeight * f, behavior: "instant" }), frac);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `.screens/exit-${i}.png` });
}
console.log("errors:", errs.length ? errs : "none");
await browser.close();
