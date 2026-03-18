const { chromium } = require('playwright');

async function inspectDOM() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html';
    await page.goto(filePath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Get the sadv-tabs container
    const tabsHTML = await page.$eval('#sadv-tabs', el => el.innerHTML);
    console.log('\n=== #sadv-tabs HTML ===');
    console.log(tabsHTML);

    // Get all clickable elements
    const clickables = await page.$$eval('button, [role="button"], [onclick]', elements =>
        elements.map(el => ({
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            text: el.textContent?.trim().substring(0, 30),
            onclick: el.getAttribute('onclick')
        }))
    );

    console.log('\n=== All Clickable Elements ===');
    clickables.forEach(el => {
        if (el.text) {
            console.log(`${el.tagName}#${el.id || ''}.${el.className.split(' ').join('.')}`);
            console.log(`  text: "${el.text}"`);
        }
    });

    await browser.close();
}

inspectDOM().catch(console.error);
