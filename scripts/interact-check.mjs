// Interaction + measurement check for the JOHNKEANS demo homepage.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] ?? 'http://localhost:4321/';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await page.goto(URL, { waitUntil: 'networkidle0' });

const digest = await page.evaluate(() => {
  const box = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return `${Math.round(r.width)}x${Math.round(r.height)}`;
  };
  const artBoxes = [...document.querySelectorAll('svg[aria-label]')].map((s) => {
    const r = s.getBoundingClientRect();
    return `${s.getAttribute('aria-label')}:${Math.round(r.width)}x${Math.round(r.height)}`;
  });
  const firstCard = document.querySelector('article');
  return {
    hero: box('section h1') && box('h1'),
    benefitsCols: getComputedStyle(document.querySelector('ul.grid.grid-cols-2')).gridTemplateColumns,
    catCols: getComputedStyle(document.querySelectorAll('section ul.grid.grid-cols-2')[1])
      .gridTemplateColumns,
    railCols: getComputedStyle(document.querySelector('#best-sellers ul')).gridTemplateColumns,
    card: box('article'),
    artBoxes,
    cardText: firstCard
      ? firstCard.innerText.replace(/\n+/g, ' | ').slice(0, 200)
      : null,
  };
});
console.log('- measurements (1440px) -');
console.log(JSON.stringify(digest, null, 2));

// Add to cart interaction
const before = await page.$eval('[data-cart-count]', (e) => e.textContent);
await page.click('#best-sellers [data-add-to-cart]');
await new Promise((r) => setTimeout(r, 250));
const after = await page.$eval('[data-cart-count]', (e) => e.textContent);
console.log(`\ncart badge: ${before} -> ${after}  ${after === '3' ? 'ok' : 'FAIL'}`);
await new Promise((r) => setTimeout(r, 1200));
const restored = await page.$eval('#best-sellers [data-add-to-cart]', (e) => e.innerText.trim());
console.log(`button resets to: "${restored}"`);

// Shop mega menu opens on hover
await page.hover('header [data-dropdown] button');
await new Promise((r) => setTimeout(r, 350));
const mega = await page.evaluate(() => {
  const el = document.querySelector('header [data-dropdown] > div:last-child');
  const cs = getComputedStyle(el);
  return { opacity: cs.opacity, visibility: cs.visibility };
});
console.log(`mega menu on hover: ${JSON.stringify(mega)}`);

// Mobile drawer
await page.setViewport({ width: 375, height: 812 });
await new Promise((r) => setTimeout(r, 250));
await page.click('[data-menu-toggle]');
await new Promise((r) => setTimeout(r, 250));
const drawer = await page.evaluate(() => {
  const p = document.querySelector('[data-mobile-nav]');
  return { hidden: p.classList.contains('hidden'), expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'), links: p.querySelectorAll('a').length };
});
console.log(`mobile drawer: ${JSON.stringify(drawer)}  ${!drawer.hidden && drawer.expanded === 'true' ? 'ok' : 'FAIL'}`);
await page.screenshot({ path: 'shots/mobile-menu.png' });
await page.click('[data-menu-toggle]');
await new Promise((r) => setTimeout(r, 200));
const closed = await page.evaluate(() => document.querySelector('[data-mobile-nav]').classList.contains('hidden'));
console.log(`drawer closes: ${closed ? 'ok' : 'FAIL'}`);

console.log(`\njs errors: ${errs.length ? errs.join(' | ') : 'none'}`);
await browser.close();
