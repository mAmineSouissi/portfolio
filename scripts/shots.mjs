import { chromium } from "playwright";

const browser = await chromium.launch();
// reduced-motion disables Lenis so native scrollTo reaches the true bottom
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce",
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

async function shot(name, selector) {
  if (selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
  }
  await page.screenshot({ path: `scripts/shot-${name}.png` });
}

// bottom of page: footer + contact, where the dock overlaps
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
await page.screenshot({ path: "scripts/shot-footer.png" });

// projects + skills mid sections
await shot("work", "#work");
await shot("skills", "#skills");

await browser.close();
console.log("done");
