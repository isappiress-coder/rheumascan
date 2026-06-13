const { chromium } = require('./node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 20000 });
  await page.screenshot({ path: './verify_home.png', fullPage: true });
  const cardCount = await page.locator('.grid > div').count();
  const firstTitle = await page.locator('.grid > div h3').first().textContent().catch(() => 'none');
  console.log('CARDS:', cardCount);
  console.log('FIRST_TITLE:', firstTitle ? firstTitle.substring(0, 80) : 'none');
  console.log('ERRORS:', JSON.stringify(errors));
  await browser.close();
})().catch(e => console.error('FATAL:', e.message));
