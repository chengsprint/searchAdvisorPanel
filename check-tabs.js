const { chromium } = require('playwright');

async function checkTabs() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('[Tabs]') || text.includes('[Init]') || text.includes('Error') || text.includes('error')) {
            console.log(`[콘솔 ${msg.type()}] ${text}`);
        }
    });

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html';
    await page.goto(filePath, { waitUntil: 'load' });
    await page.waitForTimeout(5000);

    console.log('\n=== DOM 확인 ===');

    const tabsInner = await page.$eval('#sadv-tabs', el => el.innerHTML);
    console.log('#sadv-tabs 내용:', tabsInner.substring(0, 500));

    const tabButtons = await page.$$('.sadv-t');
    console.log('.sadv-t 버튼 수:', tabButtons.length);

    await browser.close();
}

checkTabs().catch(console.error);
