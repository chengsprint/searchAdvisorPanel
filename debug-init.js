const { chromium } = require('playwright');

async function debugInit() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 콘솔 로그 수집
    page.on('console', msg => {
        console.log(`[콘솔 ${msg.type()}] ${msg.text()}`);
    });

    // 에러 수집
    page.on('pageerror', error => {
        console.log(`[페이지 에러] ${error.message}`);
    });

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html';

    console.log('페이지 로딩 시작...');
    await page.goto(filePath, { waitUntil: 'load' });
    console.log('페이지 로딩 완료, 대기 중...');

    // 충분한 대기 시간
    await page.waitForTimeout(10000);

    console.log('\n=== 초기화 상태 확인 ===');

    // window.__sadvInitData 확인
    const initData = await page.evaluate(() => {
        return {
            hasInitData: typeof window.__sadvInitData !== 'undefined',
            hasSites: window.__sadvInitData && typeof window.__sadvInitData.sites !== 'undefined',
            siteCount: window.__sadvInitData && window.__sadvInitData.sites ? Object.keys(window.__sadvInitData.sites).length : 0
        };
    });
    console.log('초기화 데이터:', initData);

    // #sadv-tabs 확인
    const tabsContainer = await page.$eval('#sadv-tabs', el => ({
        innerHTML: el.innerHTML,
        childCount: el.children.length
    })).catch(() => ({ innerHTML: null, childCount: 0, error: true }));

    console.log('#sadv-tabs 상태:', tabsContainer);

    // 전체 body HTML 확인 (처음 5000자)
    const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 5000));
    console.log('\n=== Body HTML (처음 5000자) ===');
    console.log(bodyHTML);

    await browser.close();
}

debugInit().catch(console.error);
