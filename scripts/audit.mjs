import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
const results = [];
for (const width of [1440, 1024, 768, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  const geometry = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, overflow: [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); const css = getComputedStyle(el); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && css.position !== 'fixed' && !el.closest('svg, .hero-stage, .house-experience, .impact-sticky, .final-cta, .projects-solar-art'); }).map(el => ({ tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right, left: el.getBoundingClientRect().left })).slice(0, 20) }));
  if(width===390) { await page.getByRole('button',{name:'Abrir menu'}).click(); await page.getByRole('navigation').getByRole('link',{name:'Simule',exact:true}).click(); await page.waitForTimeout(100); }
  const accessibility = width===390 || width===1440 ? await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze() : null;
  results.push({width,geometry,errors,accessibility:accessibility?.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await page.close();
}
await fs.mkdir('artifacts',{recursive:true});
await fs.writeFile('artifacts/audit.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
await browser.close();
