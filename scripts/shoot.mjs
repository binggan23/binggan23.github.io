import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const EXEC = "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const URL = process.env.URL ?? "http://127.0.0.1:4173/";
const OUT = process.env.OUT ?? ".screens";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(5200);
await page.screenshot({ path: `${OUT}/01-hero.png` });

const ids = ["dossier", "manifesto", "interlude", "arsenal", "terminal", "archive", "honors", "path", "contact"];
for (const id of ids) {
  await page.evaluate((sel) => {
    const el = document.getElementById(sel);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" });
  }, id);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/sec-${id}.png` });
}

const height = await page.evaluate(() => document.body.scrollHeight);
console.log("page height", height);
console.log("errors:", errors.length ? errors.slice(0, 6).join(" | ") : "none");
await browser.close();
