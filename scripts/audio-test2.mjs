import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(4200);
console.log("idle audio:", await page.evaluate(() => Boolean(document.querySelector("audio"))));
// first gesture somewhere neutral
await page.mouse.click(700, 500);
await page.waitForTimeout(1600);
const s1 = await page.evaluate(() => {
  const a = document.querySelector("audio");
  const btn = document.querySelector(".sound");
  return { paused: a?.paused, vol: Number((a?.volume ?? 0).toFixed(2)), t: Number((a?.currentTime ?? 0).toFixed(2)), label: btn?.textContent?.trim(), pressed: btn?.getAttribute("aria-pressed") };
});
console.log("after gesture", JSON.stringify(s1));
await page.waitForTimeout(2000);
const s2 = await page.evaluate(() => {
  const a = document.querySelector("audio");
  return { vol: Number((a?.volume ?? 0).toFixed(2)), t: Number((a?.currentTime ?? 0).toFixed(2)) };
});
console.log("later", JSON.stringify(s2));
const btn = await page.$(".sound");
await btn.click();
await page.waitForTimeout(1000);
console.log("after mute", JSON.stringify(await page.evaluate(() => {
  const a = document.querySelector("audio");
  return { paused: a?.paused, vol: Number((a?.volume ?? 0).toFixed(2)), pressed: document.querySelector(".sound")?.getAttribute("aria-pressed"), stored: localStorage.getItem("konstruckt:sound") };
})));
console.log("errors", errs.length ? errs.slice(0, 3) : "none");
await browser.close();
