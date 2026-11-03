import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const out = await page.evaluate(() => {
  const film = document.querySelector(".film");
  const pin = document.querySelector(".film__pin");
  const f = getComputedStyle(film), p = getComputedStyle(pin);
  return {
    film: { display: f.display, height: f.height, transform: f.transform, contain: f.contain, overflow: f.overflow, willChange: f.willChange, position: f.position },
    pin: { display: p.display, position: p.position, top: p.top, height: p.height, insetBlockStart: p.insetBlockStart, alignSelf: p.alignSelf, transform: p.transform },
    htmlClass: document.documentElement.className,
    lenisStyle: Array.from(document.styleSheets).flatMap(s => { try { return Array.from(s.cssRules).map(r => r.cssText) } catch { return [] } }).filter(t => t.includes("lenis")).slice(0, 6),
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
