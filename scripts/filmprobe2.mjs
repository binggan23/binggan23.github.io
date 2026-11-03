import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
for (const y of [3900, 4600, 5300, 6000, 6280]) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const pin = document.querySelector(".film__pin");
    const b = pin.getBoundingClientRect();
    return { top: Math.round(b.top), h: Math.round(b.height), prog: Math.round((window.scrollY) / (document.body.scrollHeight - 900) * 100) };
  });
  console.log(y, JSON.stringify(r));
  await page.screenshot({ path: ".screens/fn-" + y + ".png" });
}
await browser.close();
