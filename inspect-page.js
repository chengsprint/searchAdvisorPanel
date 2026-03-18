const { chromium } = require('playwright');

async function inspectPage() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html';
    await page.goto(filePath, { waitUntil: 'networkidle' });

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Get page content
    const content = await page.content();

    // Find all buttons
    const buttons = await page.$$eval('button', buttons =>
        buttons.map(btn => ({
            text: btn.textContent?.trim(),
            className: btn.className,
            attributes: Array.from(btn.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ')
        }))
    );

    console.log('\n=== All Buttons ===');
    buttons.forEach(btn => {
        if (btn.text) {
            console.log(`Text: "${btn.text}"`);
            console.log(`Class: ${btn.className}`);
            console.log(`Attributes: ${btn.attributes}`);
            console.log('---');
        }
    });

    // Find all elements with 'tab' in class or id
    const tabElements = await page.$$eval('[class*="tab"], [id*="tab"], [data-tab], [role="tab"]', elements =>
        elements.map(el => ({
            tagName: el.tagName,
            text: el.textContent?.trim().substring(0, 50),
            className: el.className,
            id: el.id,
            dataTab: el.getAttribute('data-tab'),
            role: el.getAttribute('role')
        }))
    );

    console.log('\n=== Tab Elements ===');
    tabElements.forEach(el => {
        console.log(`${el.tagName}: "${el.text}"`);
        console.log(`  class: ${el.className}`);
        console.log(`  id: ${el.id}`);
        console.log(`  data-tab: ${el.dataTab}`);
        console.log(`  role: ${el.role}`);
        console.log('---');
    });

    await page.waitForTimeout(3000);
    await browser.close();
}

inspectPage().catch(console.error);
