import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

// intro frames
let ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
let page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);
await page.screenshot({ path: ".screens/i-intro.png" });
await page.waitForTimeout(900);
await page.screenshot({ path: ".screens/i-intro2.png" });
await ctx.close();

// overflow at several widths
for (const w of [360, 768, 1024, 1440, 1920]) {
  const c = await browser.newContext({ viewport: { width: w, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3200);
  const res = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  console.log(w, JSON.stringify(res), res.sw <= res.iw + 1 ? "ok" : "OVERFLOW");
  await c.close();
}

// reduced motion: intro must be skipped, page usable
const c2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const p2 = await c2.newPage();
const errs = [];
p2.on("pageerror", (e) => errs.push(e.message));
await p2.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await p2.waitForTimeout(1500);
const lock = await p2.evaluate(() => document.documentElement.classList.contains("is-locked"));
const intro = await p2.evaluate(() => Boolean(document.querySelector(".intro2")));
await p2.screenshot({ path: ".screens/rm-hero.png" });
console.log("reduced: locked=", lock, "intro present=", intro, "errors=", errs.length ? errs : "none");
await c2.close();
await browser.close();
