// Verifies the light theme (white page, gray-100 cards, unchanged blue buttons)
// and mobile ergonomics (tap targets, no horizontal scroll, no overflow).
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] ?? 'http://localhost:4321/';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
let failed = 0;

// ---------- 1. theme audit on the desktop page ----------
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0' });

const theme = await page.evaluate(() => {
  // Tailwind v4 emits oklch(); normalise to perceived lightness 0..1
  const lightness = (c) => {
    if (!c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') return null;
    if (c.startsWith('oklch')) {
      const l = parseFloat(c.match(/oklch\(([\d.]+)/)[1]);
      return l > 1 ? l / 100 : l;
    }
    const [r, g, b] = c.match(/[\d.]+/g).map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };
  const bg = (el) => getComputedStyle(el).backgroundColor;
  const rendered = (el) => el.getClientRects().length > 0;
  const isBlue = (c) => c === 'rgb(22, 99, 199)';

  const surfaces = [...document.querySelectorAll('main > section, header, footer')].filter(rendered);
  const darkSections = surfaces
    .filter((el) => {
      const l = lightness(bg(el));
      return l !== null && l < 0.85;
    })
    .map((el) => `${el.tagName.toLowerCase()}=${bg(el)}`);

  // Cards should be gray-100 (perceived lightness ~0.967)
  const cardSel = [
    '#best-sellers article',
    'main a[href="/power-tools"].group',
    'main a[href^="/collections/"].group',
    'main section:nth-of-type(2) ul li',
  ];
  const cardEls = [...new Set(cardSel.flatMap((s) => [...document.querySelectorAll(s)]))].filter(rendered);
  const grayOk = cardEls.filter((el) => {
    const l = lightness(bg(el));
    return l !== null && l > 0.94 && l < 0.99;
  }).length;

  const buttons = [...document.querySelectorAll('.btn-primary')].filter(rendered);
  const blueOk = buttons.filter((el) => isBlue(bg(el))).length;

  // Any leftover dark surface that is not an intentional dark chip (badges) or the blue button?
  const darkSurfaces = [...document.querySelectorAll('body *')]
    .filter(rendered)
    .filter((el) => {
      const c = bg(el);
      if (isBlue(c)) return false; // the brand blue button
      const l = lightness(c);
      if (l === null || l >= 0.5) return false;
      const cls = el.getAttribute('class') || '';
      return !/bg-ink-9|bg-amber|text-white/.test(cls);
    })
    .slice(0, 6)
    .map((el) => `${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').slice(0, 40)} -> ${bg(el)}`);

  return {
    bodyBg: bg(document.body),
    darkSections,
    cardTotal: cardEls.length,
    grayOk,
    blueTotal: buttons.length,
    blueOk,
    darkSurfaces,
  };
});

const themeChecks = [
  ['Page background is white', theme.bodyBg === 'rgb(255, 255, 255)', theme.bodyBg],
  ['No dark section backgrounds', theme.darkSections.length === 0, theme.darkSections.join(' ') || 'all light'],
  ['Cards use bg-gray-100', theme.grayOk === theme.cardTotal, `${theme.grayOk}/${theme.cardTotal}`],
  [
    'All primary buttons keep the same blue',
    theme.blueOk === theme.blueTotal,
    `${theme.blueOk}/${theme.blueTotal} at rgb(22,99,199)`,
  ],
  ['No leftover dark surfaces', theme.darkSurfaces.length === 0, theme.darkSurfaces.join(' | ')],
];

console.log('— theme audit (1440px) —');
for (const [name, pass, detail] of themeChecks) {
  if (!pass) failed += 1;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
}
await page.close();

// ---------- 2. mobile ergonomics ----------
for (const vp of [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 812 },
  { name: 'mobile-lg', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  const p = await browser.newPage();
  await p.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 768, hasTouch: vp.width < 768 });
  await p.goto(URL, { waitUntil: 'networkidle0' });

  const m = await p.evaluate(() => {
    const rendered = (el) => el.getClientRects().length > 0;
    const inScroller = (el) => {
      for (let q = el.parentElement; q; q = q.parentElement) {
        const o = getComputedStyle(q).overflowX;
        if (o === 'auto' || o === 'scroll' || o === 'hidden') return true;
      }
      return false;
    };
    const vw = document.documentElement.clientWidth;

    // Tap targets: only enforced on touch viewports, where small controls are hard to hit
    const touch = window.innerWidth < 768;
    const small = [...document.querySelectorAll('a[href], button, input')]
      .filter(rendered)
      .filter((el) => !inScroller(el))
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ el, r }) => {
        if (r.width === 0) return false;
        if (!touch) return false;
        const cls = el.getAttribute('class') || '';
        if (cls.includes('sr-only')) return false; // screen-reader-only skip link
        if ((el.getAttribute('aria-label') || '').toLowerCase().includes('home')) return false; // logo
        return r.height < 40 || r.width < 24;
      })
      .slice(0, 6)
      .map(({ el, r }) => `${el.tagName.toLowerCase()}[${Math.round(r.width)}x${Math.round(r.height)}] "${(el.textContent || '').trim().slice(0, 22)}"`);

    const overflow = [...document.querySelectorAll('body *')]
      .filter((el) => rendered(el) && !inScroller(el) && getComputedStyle(el).position !== 'fixed')
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.right > vw + 1.5 || r.left < -1.5;
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').slice(0, 45)}`);

    // Product cards must not be so narrow that text stacks badly
    const card = document.querySelector('#best-sellers article');
    const cardBox = card ? card.getBoundingClientRect() : null;

    return {
      scrollW: document.documentElement.scrollWidth,
      vw,
      small,
      overflow,
      cardW: cardBox ? Math.round(cardBox.width) : 0,
      cardH: cardBox ? Math.round(cardBox.height) : 0,
    };
  });

  const probs = [];
  if (m.scrollW > m.vw + 1) probs.push(`h-scroll ${m.scrollW}>${m.vw}`);
  if (m.overflow.length) probs.push(`overflow: ${m.overflow.join(' | ')}`);
  if (m.small.length) probs.push(`small tap targets: ${m.small.join(' | ')}`);
  console.log(
    `\n[${vp.name} ${vp.width}] card ${m.cardW}x${m.cardH}  ${probs.length ? 'FAIL' : 'ok'}`
  );
  probs.forEach((x) => console.log('   - ' + x));
  if (probs.length) failed += 1;

  if (['iPhone SE', 'mobile', 'desktop'].includes(vp.name)) {
    await p.screenshot({ path: `shots/v2-${vp.name.replace(/\s/g, '-')}.png`, fullPage: true });
  }
  await p.close();
}

await browser.close();
console.log(failed ? `\n${failed} problem group(s)` : '\nAll checks clean');
process.exit(failed ? 1 : 0);
