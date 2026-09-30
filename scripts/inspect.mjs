import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

await fs.mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
await page.goto('http://127.0.0.1:3001', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
await page.screenshot({ path: 'artifacts/desktop-hero.png' });
console.log(JSON.stringify({ title: await page.title(), canvases: await page.locator('canvas').count(), pageWidth: await page.evaluate(() => document.documentElement.scrollWidth), errors }, null, 2));
for (const id of ['economia', 'como-funciona', 'solucoes', 'simule', 'projetos', 'faq']) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `artifacts/desktop-${id}.png` });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3001', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'artifacts/mobile-hero.png' });
console.log(JSON.stringify({ mobileWidth: await page.evaluate(() => document.documentElement.scrollWidth), viewport:390, errors }, null, 2));
await browser.close();
