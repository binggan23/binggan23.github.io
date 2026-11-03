import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const EXEC = "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
mkdirSync(".screens/ref", { recursive: true });

const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });

async function shoot(name, url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `.screens/ref/${name}-01.png` });

  const info = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const html = getComputedStyle(document.documentElement);
    const counts = {};
    const walk = (el, depth) => {
      if (depth > 4) return;
      const cs = getComputedStyle(el);
      for (const key of ["color", "backgroundColor", "borderTopColor"]) {
        const v = cs[key];
        if (v && v !== "rgba(0, 0, 0, 0)" && v !== "transparent") counts[v] = (counts[v] || 0) + 1;
      }
      for (const child of el.children) walk(child, depth + 1);
    };
    walk(document.body, 0);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14);
    return {
      bg: body.backgroundColor, htmlBg: html.backgroundColor, color: body.color,
      fonts: body.fontFamily, height: document.body.scrollHeight, top,
      headings: [...document.querySelectorAll("h1,h2")].slice(0, 6).map((h) => h.textContent?.trim().slice(0, 80)),
    };
  });
  console.log(name, JSON.stringify(info));

  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "instant" }));
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `.screens/ref/${name}-0${i + 2}.png` });
  }
  await ctx.close();
}

await shoot("flashform", "https://www.flshfrm.com/?ref=onepagelove");
await shoot("weeksync", "https://weeksync.app/?ref=onepagelove");
await browser.close();
console.log("ref shots done");
