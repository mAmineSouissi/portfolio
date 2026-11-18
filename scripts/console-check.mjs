import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const logs = [];
page.on("console", (m) => logs.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.mouse.move(640, 400); // wake the 3D hero / cursor
await page.waitForTimeout(2500); // let R3F render frames (Clock would warn here)

const noisy = logs.filter((l) =>
  /Clock|hydrat|deprecated|warning|error/i.test(l)
);

console.log("=== relevant console output ===");
console.log(noisy.length ? noisy.join("\n") : "(none — clean)");
console.log("\ntotal messages:", logs.length);

await browser.close();
