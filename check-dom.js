const { chromium } = require('playwright');

async function checkDOM() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[콘솔 ${msg.type()}] ${msg.text()}`);
    });

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html';
    await page.goto(filePath, { waitUntil: 'load' });
    await page.waitForTimeout(5000);

    console.log('\n=== DOM 확인 ===');

    const sadvP = await page.$('#sadv-p');
    console.log('#sadv-p 존재:', sadvP ? '예' : '아니오');

    const sadvTabs = await page.$('#sadv-tabs');
    console.log('#sadv-tabs 존재:', sadvTabs ? '예' : '아니오');

    if (sadvTabs) {
        const innerHTML = await sadvTabs.innerHTML();
        console.log('#sadv-tabs 내용:', innerHTML.substring(0, 200));
    }

    // __sadvTabsEl 확인
    const globalTabs = await page.evaluate(() => {
        return typeof window.__sadvTabsEl !== 'undefined';
    });
    console.log('window.__sadvTabsEl 존재:', globalTabs ? '예' : '아니오');

    if (globalTabs) {
        const tabsEl = await page.evaluate(() => {
            return window.__sadvTabsEl ? window.__sadvTabsEl.id : null;
        });
        console.log('window.__sadvTabsEl.id:', tabsEl);
    }

    await browser.close();
}

checkDOM().catch(console.error);
