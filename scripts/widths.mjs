import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [w, h] of [[1024, 800], [1920, 1080]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(5600);
  await page.screenshot({ path: ".screens/w-" + w + ".png" });
  await ctx.close();
}
await browser.close();
console.log("done");
