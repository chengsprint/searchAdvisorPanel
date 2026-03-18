const { chromium } = require('playwright');

async function verifyTabs() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html';

    console.log('페이지 로딩 시작...');
    await page.goto(filePath, { waitUntil: 'networkidle' });
    console.log('페이지 로딩 완료, 대기 중...');

    // 더 긴 대기 시간
    await page.waitForTimeout(5000);

    console.log('\n=== DOM 확인 ===');

    // #sadv-tabs 확인
    const tabsContainer = await page.$('#sadv-tabs');
    if (tabsContainer) {
        const innerHTML = await tabsContainer.innerHTML();
        console.log('#sadv-tabs 내용:', innerHTML.substring(0, 200));
    } else {
        console.log('#sadv-tabs를 찾을 수 없음');
    }

    // 모든 버튼 확인
    const allButtons = await page.$$eval('button', buttons =>
        buttons.map(btn => ({
            text: btn.textContent?.trim(),
            className: btn.className,
            dataT: btn.getAttribute('data-t'),
            dataTab: btn.getAttribute('data-tab'),
            dataset: Object.keys(btn.dataset).map(k => `${k}=${btn.dataset[k]}`).join(', ')
        }))
    );

    console.log('\n=== 모든 버튼 ===');
    allButtons.forEach(btn => {
        if (btn.text && btn.text.length > 0) {
            console.log(`텍스트: "${btn.text}"`);
            console.log(`  클래스: ${btn.className}`);
            console.log(`  data-t: ${btn.dataT}`);
            console.log(`  data-tab: ${btn.dataTab}`);
            console.log(`  dataset: ${btn.dataset}`);
            console.log('---');
        }
    });

    // .sadv-t 클래스 확인
    const tabButtons = await page.$$('.sadv-t');
    console.log(`\n=== .sadv-t 버튼 수: ${tabButtons.length} ===`);

    for (const btn of tabButtons) {
        const text = await btn.evaluate(el => el.textContent?.trim());
        const dataT = await btn.evaluate(el => el.getAttribute('data-t'));
        console.log(`텍스트: "${text}" data-t: ${dataT}`);
    }

    await browser.close();
}

verifyTabs().catch(console.error);
