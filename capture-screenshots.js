const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = '/home/seung/.cokacdir/workspace/yif7zotu/screenshots';

async function captureScreenshots() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    console.log('=== SearchAdvisor V2 Migration Screen Capture ===\n');

    try {
        // 1. Capture test-single.html (단일 계정)
        console.log('1. Capturing test-single.html (단일 계정)...');
        await captureSingleAccount(context);

        // 2. Capture test-merged.html (복합 계정)
        console.log('\n2. Capturing test-merged.html (복합 계정)...');
        await captureMergedAccount(context);

        // 3. Capture demo.html (데모)
        console.log('\n3. Capturing demo.html (데모)...');
        await captureDemo(context);

        console.log('\n=== 모든 캡처가 완료되었습니다 ===');

    } catch (error) {
        console.error('캡처 중 오류 발생:', error);
    } finally {
        await browser.close();
    }
}

async function captureSingleAccount(context) {
    const page = await context.newPage();

    // 콘솔 로그 수집
    const consoleLogs = [];
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warn') {
            consoleLogs.push(`[${type.toUpperCase()}] ${msg.text()}`);
        }
    });

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html';
    await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });

    // 페이지 로딩 대기
    await page.waitForTimeout(3000);

    // 1. 전체현황 모드 캡처
    console.log('  - 전체현황 모드 캡처 중...');
    await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v2-single-all-overview.png'),
        fullPage: false
    });
    console.log('    ✓ 저장됨: v2-single-all-overview.png');

    // 탭 목록 (data-t 속성으로 찾기)
    const tabs = [
        { name: 'overview', label: '개요' },
        { name: 'daily', label: '일별' },
        { name: 'urls', label: 'URL' },
        { name: 'queries', label: '검색어' },
        { name: 'indexed', label: '색인' },
        { name: 'crawl', label: '크롤' },
        { name: 'backlink', label: '백링크' },
        { name: 'pattern', label: '패턴' },
        { name: 'insight', label: '인사이트' }
    ];

    console.log('  캡처할 탭:', tabs.map(t => t.label).join(', '));

    for (const tab of tabs) {
        try {
            console.log(`  - ${tab.label} 탭 캡처 중...`);

            // 탭 클릭 (button 태그의 data-t 속성 사용)
            const tabSelector = `button[data-t="${tab.name}"]`;
            const tabElement = await page.$(tabSelector);

            if (!tabElement) {
                console.log(`    ! ${tab.label} 탭을 찾을 수 없음`);
                continue;
            }

            await tabElement.click();

            // 탭 전환 대기
            await page.waitForTimeout(1500);

            // 스크린샷 캡처
            const filename = `v2-single-all-${tab.name}.png`;
            await page.screenshot({
                path: path.join(SCREENSHOT_DIR, filename),
                fullPage: false
            });

            console.log(`    ✓ 저장됨: ${filename}`);
        } catch (error) {
            console.log(`    ✗ ${tab.label} 탭 캡처 실패:`, error.message);
        }
    }

    // 2. 사이트별 모드 캡처
    console.log('  - 사이트별 모드로 전환...');
    const siteModeBtn = await page.$('button.sadv-mode[data-m="site"]');
    if (siteModeBtn) {
        await siteModeBtn.click();
        await page.waitForTimeout(1500);

        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, 'v2-single-site-mode.png'),
            fullPage: false
        });
        console.log('    ✓ 저장됨: v2-single-site-mode.png');

        // 사이트 선택 및 캡처
        const siteTabs = await page.$$('.sadv-site-tab');

        if (siteTabs.length === 0) {
            console.log('    ! 사이트 탭을 찾을 수 없음');
        } else {
            const siteCount = Math.min(3, siteTabs.length);
            console.log(`    ${siteTabs.length}개 사이트 발견, ${siteCount}개 캡처...`);

            for (let i = 0; i < siteCount; i++) {
                try {
                    // 현재 활성화된 사이트 탭이 아니면 클릭
                    const isActive = await siteTabs[i].evaluate(el => el.classList.contains('on'));

                    if (!isActive) {
                        await siteTabs[i].click();
                        await page.waitForTimeout(1000);
                    }

                    const filename = `v2-single-site-${i + 1}-overview.png`;
                    await page.screenshot({
                        path: path.join(SCREENSHOT_DIR, filename),
                        fullPage: false
                    });

                    console.log(`    ✓ 사이트 ${i + 1} 캡처됨: ${filename}`);
                } catch (error) {
                    console.log(`    ✗ 사이트 ${i + 1} 캡처 실패:`, error.message);
                }
            }
        }
    } else {
        console.log('    ! 사이트별 모드 버튼을 찾을 수 없음');
    }

    // 콘솔 오류 보고
    if (consoleLogs.length > 0) {
        console.log('\n  콘솔 오류/경고:');
        consoleLogs.forEach(log => console.log(`    ${log}`));
    } else {
        console.log('\n  콘솔 오류/경고 없음');
    }

    await page.close();
}

async function captureMergedAccount(context) {
    const page = await context.newPage();

    const consoleLogs = [];
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warn') {
            consoleLogs.push(`[${type.toUpperCase()}] ${msg.text()}`);
        }
    });

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-merged.html';
    await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 메인 화면 캡처
    const filename = 'v2-merged-overview.png';
    await page.screenshot({
        path: path.join(SCREENSHOT_DIR, filename),
        fullPage: false
    });
    console.log(`  ✓ 저장됨: ${filename}`);

    if (consoleLogs.length > 0) {
        console.log('\n  콘솔 오류/경고:');
        consoleLogs.forEach(log => console.log(`    ${log}`));
    } else {
        console.log('  콘솔 오류/경고 없음');
    }

    await page.close();
}

async function captureDemo(context) {
    const page = await context.newPage();

    const consoleLogs = [];
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warn') {
            consoleLogs.push(`[${type.toUpperCase()}] ${msg.text()}`);
        }
    });

    const filePath = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/demo.html';
    await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 메인 화면 캡처
    const filename = 'v2-demo-overview.png';
    await page.screenshot({
        path: path.join(SCREENSHOT_DIR, filename),
        fullPage: false
    });
    console.log(`  ✓ 저장됨: ${filename}`);

    if (consoleLogs.length > 0) {
        console.log('\n  콘솔 오류/경고:');
        consoleLogs.forEach(log => console.log(`    ${log}`));
    } else {
        console.log('  콘솔 오류/경고 없음');
    }

    await page.close();
}

// 실행
captureScreenshots().catch(console.error);
