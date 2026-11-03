import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const tops = await page.evaluate(() => {
  const o = {};
  ["archive","honors","contact"].forEach((id) => { const el = document.getElementById(id); o[id] = el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null; });
  o.h = document.body.scrollHeight;
  return o;
});
console.log(JSON.stringify(tops));
for (const [name, y] of [["ar1", tops.archive - 200], ["ar2", tops.archive + 500], ["ar3", tops.archive + 1100], ["hn", tops.honors - 100], ["ct", tops.contact - 100]]) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: ".screens/q-" + name + ".png" });
}
await browser.close();
