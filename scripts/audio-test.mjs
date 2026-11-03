import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text()); });
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(4200);
const before = await page.evaluate(() => {
  const a = document.querySelector("audio");
  return { audioEl: Boolean(a), src: a?.getAttribute("src") ?? null };
});
console.log("before click", JSON.stringify(before));
await page.click(".sound");
await page.waitForTimeout(1200);
const mid = await page.evaluate(() => {
  const a = document.querySelector("audio");
  return { paused: a?.paused, volume: Number((a?.volume ?? 0).toFixed(3)), currentTime: Number((a?.currentTime ?? 0).toFixed(2)), duration: Number((a?.duration ?? 0).toFixed(1)), loop: a?.loop, readyState: a?.readyState, netState: a?.networkState };
});
console.log("after 1.2s", JSON.stringify(mid));
await page.waitForTimeout(2600);
const later = await page.evaluate(() => {
  const a = document.querySelector("audio");
  return { volume: Number((a?.volume ?? 0).toFixed(3)), t: Number((a?.currentTime ?? 0).toFixed(2)) };
});
console.log("after 3.8s", JSON.stringify(later));
// toggle off
await page.click(".sound");
await page.waitForTimeout(1100);
const off = await page.evaluate(() => {
  const a = document.querySelector("audio");
  return { paused: a?.paused, volume: Number((a?.volume ?? 0).toFixed(3)) };
});
console.log("after off", JSON.stringify(off));
console.log("errors:", errs.length ? errs.slice(0, 4) : "none");
await browser.close();
