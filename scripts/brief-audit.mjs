// Audits the rendered homepage against the specific items in the client's change brief.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] ?? 'http://localhost:4321/';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0' });

const r = await page.evaluate(() => {
  const text = document.body.innerText;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const cols = (el) => (el ? getComputedStyle(el).gridTemplateColumns.split(' ').length : 0);

  const card = $('#best-sellers article');
  // Text-block order only: heading, model, SKU, then the reviews line
  const textBlock = card ? card.querySelector('article > div, div.flex-1') : null;
  const cardParts = textBlock
    ? [...textBlock.querySelectorAll('h3, p, div > a')]
        .map((e) => e.textContent.trim().replace(/\s+/g, ' '))
        .filter(Boolean)
    : [];

  const catsH2 = $$('h2').find((h) => h.textContent.trim() === 'Popular Categories');
  return {
    benefitsCols: cols($('main section:nth-of-type(2) ul')),
    catCols: cols(catsH2?.closest('section')?.querySelector('ul')),
    railCols: cols($('#best-sellers ul')),
    cardParts: cardParts.slice(0, 9),
    // Colour checks: model number must be blue, never red
    modelColor: getComputedStyle($('#best-sellers article p.font-semibold')).color,
    // Review stars must be unselected (no filled star)
    filledStars: $$('#best-sellers svg[aria-hidden="true"] path').filter(
      (p) => getComputedStyle(p).fill.includes('rgb(2') || getComputedStyle(p).fill.includes('rgb(3')
    ).length,
    starFill: getComputedStyle($('#best-sellers article svg[aria-hidden="true"]')).fill,
    reviewCount: $('#best-sellers article')
      .innerText.match(/\n0\n/) !== null || $('#best-sellers article').innerText.includes(' 0 '),

    h2s: $$('h2').map((h) => h.textContent.trim()),
    sectionTitles: ['Best Sellers', 'New Arrivals', 'Featured Collections', 'Popular Categories'].map(
      (t) => `${t}: ${text.includes(t)}`
    ),
    // Removed items
    hasAuthenticGuarantee: /100% Authentic Guarantee/i.test(text),
    hasWishlistUi: !!$('a[href*="wishlist"], a[href*="favourite"]'),
    // Currency
    usdPrices: $$('#best-sellers article').filter((a) => a.innerText.includes('$')).length,
    otherCurrency: /£|€|AED|SAR|GBP/.test(text),
    // Company identity in footer
    footerHasCompany: /JOHNKEANS UK LTD/.test(text),
    footerHasRegNo: /Company Registration No:/.test(text),
    footerHasRegOffice: /Registered Office:/.test(text),
    footerHasRegistered: /Registered in England and Wales/.test(text),
    footerHeadingAbout: /About JOHNKEANS/.test(text),
    footerWarranty: /Warranty Policy/.test(text),
    footerOutdoor: /Outdoor Equipment/.test(text),
    footerWorkshop: /Workshop & Automotive/.test(text),
    // Request a Quote placements
    quoteLinks: $$('a[href="/request-a-quote"]').map((a) => a.closest('header, footer, section, div')?.tagName + ':' + a.textContent.trim().slice(0, 20)),
    // Error/notice styling is theme blue not green
    greens: (text.match(/\bgreen\b/gi) || []).length,
    // Link hygiene
    badHrefs: $$('a[href]').map((a) => a.getAttribute('href')).filter((h) => /^\s|\s$|^\/\s/.test(h)),
    placeholderSvg: /(^|\s)svg(\s|$)/.test(text),
  };
});

const checks = [
  ['5 benefit columns on desktop', r.benefitsCols === 5, r.benefitsCols],
  ['3 category columns on desktop', r.catCols === 3, r.catCols],
  ['5 products per rail on desktop', r.railCols === 5, r.railCols],
  ['Card order: heading -> model -> SKU -> reviews', /^18V Brushless Combi Drill/.test(r.cardParts[0]) && r.cardParts[1] === 'JKD-18BL' && r.cardParts[2].startsWith('SKU:') && r.cardParts[3].includes('Be the first to review'), r.cardParts.slice(0, 4).join(' / ')],
  ['Model number is blue, not red', r.modelColor === 'rgb(19, 78, 160)', r.modelColor],
  ['No review stars pre-selected', r.filledStars === 0, `${r.filledStars} filled, fill=${r.starFill}`],
  ['"0" reviews shown', r.reviewCount, ''],
  ['"100% Authentic Guarantee" removed', !r.hasAuthenticGuarantee, ''],
  ['Wishlist removed from UI', !r.hasWishlistUi, ''],
  ['All rail prices in USD', r.usdPrices === 5, `${r.usdPrices}/5 cards`],
  ['No other currency symbols', !r.otherCurrency, ''],
  ['Renamed "Mega Deals" -> "Best Sellers"', r.sectionTitles[0].endsWith('true'), ''],
  ['Sections: Popular Categories / Best Sellers / New Arrivals / Featured Collections', r.sectionTitles.every((s) => s.endsWith('true')), ''],
  ['Footer: JOHNKEANS UK LTD', r.footerHasCompany, ''],
  ['Footer: company registration number', r.footerHasRegNo, ''],
  ['Footer: registered office', r.footerHasRegOffice, ''],
  ['Footer: "Registered in England and Wales"', r.footerHasRegistered, ''],
  ['Footer: "About JOHNKEANS"', r.footerHeadingAbout, ''],
  ['Footer: Warranty Policy added', r.footerWarranty, ''],
  ['Footer: "Outdoor Equipment" naming', r.footerOutdoor, ''],
  ['Footer: "Workshop & Automotive" naming', r.footerWorkshop, ''],
  ['No leading/trailing spaces in hrefs', r.badHrefs.length === 0, r.badHrefs.join(',')],
  ['No "svg" placeholder text on the page', !r.placeholderSvg, ''],
];

let failed = 0;
for (const [name, pass, detail] of checks) {
  if (!pass) failed += 1;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
}
console.log(`\nRequest a Quote links (${r.quoteLinks.length}): ${r.quoteLinks.join(' , ')}`);
console.log(`\n${checks.length - failed}/${checks.length} brief items verified`);
await browser.close();
process.exit(failed ? 1 : 0);
