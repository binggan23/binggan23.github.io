import { chromium } from "playwright-core";
const EXEC = "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
for (const [name, width, height] of [["m390", 390, 844], ["t768", 768, 1024]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  const overflow = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 2) bad.push(el.tagName + "." + String(el.className).slice(0, 30) + " right=" + Math.round(r.right));
    });
    return { scrollW: document.documentElement.scrollWidth, inner: window.innerWidth, bad: bad.slice(0, 12) };
  });
  console.log(name, JSON.stringify(overflow), errs.slice(0, 3));
  const ids = ["", "dossier", "manifesto", "interlude", "arsenal", "terminal", "archive", "honors", "path", "contact"];
  for (const id of ids) {
    if (id) {
      await page.evaluate((sel) => { const el = document.getElementById(sel); if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" }); }, id);
      await page.waitForTimeout(900);
    }
    await page.screenshot({ path: `.screens/${name}-${id || "hero"}.png` });
  }
  await ctx.close();
}
await browser.close();
console.log("done");
