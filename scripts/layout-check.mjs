// Layout smoke test for the JOHNKEANS demo homepage. Not part of the site build.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] ?? 'http://localhost:4321/';
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'mobile-lg', width: 414, height: 896 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
let failures = 0;

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle0' });

  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const desc = (el) =>
      `${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').slice(0, 60)}`;

    const rendered = (el) => el.getClientRects().length > 0;

    // Skip anything living inside a horizontal scroll container (carousel / chip rail)
    const inScroller = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const ov = getComputedStyle(p).overflowX;
        if (ov === 'auto' || ov === 'scroll' || ov === 'hidden') return true;
      }
      return false;
    };

    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => {
        if (!rendered(el) || inScroller(el)) return false;
        if (getComputedStyle(el).position === 'fixed') return false;
        const r = el.getBoundingClientRect();
        return r.right > vw + 1.5 || r.left < -1.5;
      })
      .slice(0, 6)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${desc(el)} [${Math.round(r.left)}..${Math.round(r.right)}]`;
      });

    const collapsedSvgs = [...document.querySelectorAll('svg')]
      .filter((s) => rendered(s))
      .filter((s) => {
        const r = s.getBoundingClientRect();
        return r.width < 2 || r.height < 2;
      })
      .map((s) => s.getAttribute('aria-label') || s.getAttribute('class'));

    // Text that is visually clipped by its own box (a common flex/grid bug)
    const clippedText = [...document.querySelectorAll('h1,h2,h3,p,a,span,li,button')]
      .filter(rendered)
      .filter((el) => el.children.length === 0 && (el.textContent || '').trim().length > 3)
      .filter((el) => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === 'visible')
      .slice(0, 6)
      .map(desc);

    return {
      vw,
      scrollW: document.documentElement.scrollWidth,
      docH: document.body.scrollHeight,
      overflowing,
      collapsedSvgs,
      clippedText,
    };
  });

  const problems = [];
  if (report.scrollW > report.vw + 1)
    problems.push(`horizontal page scroll: scrollWidth ${report.scrollW} > ${report.vw}`);
  if (report.overflowing.length)
    problems.push(`overflow outside scroller (${report.overflowing.length}): ${report.overflowing.join(' | ')}`);
  if (report.collapsedSvgs.length) problems.push(`collapsed svgs: ${report.collapsedSvgs.join(', ')}`);
  if (report.clippedText.length) problems.push(`clipped text: ${report.clippedText.join(' | ')}`);
  if (errors.length) problems.push(`js errors: ${errors.join(' | ')}`);

  console.log(
    `\n[${vp.name} ${vp.width}x${vp.height}] height ${report.docH}px  ${problems.length ? 'FAIL' : 'ok'}`
  );
  problems.forEach((p) => console.log('   - ' + p));
  if (problems.length) failures += 1;

  if (['mobile', 'desktop'].includes(vp.name)) {
    await page.screenshot({ path: `shots/${vp.name}.png`, fullPage: true });
  }
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} viewport(s) with problems` : '\nAll viewports clean');
process.exit(failures ? 1 : 0);
