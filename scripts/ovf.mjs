import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
const c = await browser.newContext({ viewport: { width: 360, height: 800 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await p.waitForTimeout(3400);
const bad = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > window.innerWidth + 1) out.push(el.tagName + "." + String(el.className).slice(0, 26) + " R=" + Math.round(r.right) + " W=" + Math.round(r.width));
  });
  return out.slice(0, 14);
});
console.log(bad.join("\n"));
await browser.close();
