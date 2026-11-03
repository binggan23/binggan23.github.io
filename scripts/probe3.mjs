import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const info = await page.evaluate(() => {
  const out = {};
  ["hero","dossier","manifesto","interlude","film","arsenal","terminal","archive","honors","path","contact"].forEach((id) => {
    const el = document.getElementById(id);
    out[id] = el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  });
  return { out, h: document.body.scrollHeight };
});
console.log(JSON.stringify(info));
await page.evaluate(() => window.scrollTo(0, 2400));
await page.waitForTimeout(1500);
console.log("after scroll y=", await page.evaluate(() => window.scrollY));
await page.screenshot({ path: ".screens/mf.png" });
await browser.close();
