import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const out = await page.evaluate(() => {
  const pin = document.querySelector(".film__pin");
  const film = document.querySelector(".film");
  const chain = [];
  let el = pin.parentElement;
  while (el) {
    const cs = getComputedStyle(el);
    if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible" || cs.transform !== "none")
      chain.push(el.tagName + "." + String(el.className).slice(0, 20) + " ov=" + cs.overflow + " ovx=" + cs.overflowX + " tf=" + cs.transform.slice(0, 18) + " h=" + cs.height);
    el = el.parentElement;
  }
  const cs = getComputedStyle(pin);
  return { pos: cs.position, top: cs.top, height: cs.height, ancestors: chain, htmlOv: getComputedStyle(document.documentElement).overflowX, bodyOv: getComputedStyle(document.body).overflowX };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
