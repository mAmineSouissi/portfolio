import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// move mouse over the hero CTA area (interactive -> should show the hand)
await page.mouse.move(640, 400);
await page.mouse.move(300, 560); // "View my work" button-ish region
await page.waitForTimeout(600);

const cursor = page.locator(".custom-cursor");
const box = await cursor.boundingBox();
const opacity = await cursor.evaluate((el) => getComputedStyle(el).opacity);
const transform = await cursor.evaluate((el) => getComputedStyle(el).transform);
const src = await page.locator(".custom-cursor img").getAttribute("src");

console.log("cursor box:", box);
console.log("opacity:", opacity);
console.log("transform:", transform);
console.log("img src:", src);

await page.screenshot({ path: "scripts/cursor-shot.png" });
await browser.close();
