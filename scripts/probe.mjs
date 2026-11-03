import { chromium } from "playwright-core";
const EXEC = "/home/cookie/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
const info = await page.evaluate(() => {
  const g = (sel, prop) => {
    const el = document.querySelector(sel);
    if (!el) return sel + ": MISSING";
    const cs = getComputedStyle(el);
    return sel + " " + prop + " = " + cs[prop];
  };
  const top = document.querySelector(".topbar__inner");
  return [
    g(".topbar__inner", "backgroundImage"),
    g(".topbar__inner", "backgroundColor"),
    g("body", "backgroundColor"),
    g(".page", "backgroundColor"),
    g(".hero", "backgroundColor"),
    g(".topbar__mark-text", "color"),
    "root paper = " + getComputedStyle(document.documentElement).getPropertyValue("--paper"),
    "body rect = " + JSON.stringify(document.body.getBoundingClientRect()),
    top ? "topbar bg shorthand: " + top.style.background : "no",
  ];
});
console.log(info.join("\n"));
await browser.close();
