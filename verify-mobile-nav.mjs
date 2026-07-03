import { chromium } from '@playwright/test';

const screenshotPath = 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/mobile-nav.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
  });

  try {
    console.log('📱 Opening app in mobile viewport (375x812)...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    const url = page.url();
    console.log('✅ Loaded URL:', url);
    
    await page.waitForTimeout(1000);
    
    const bottomNav = await page.$('nav[aria-label="Navegação mobile"]');
    if (bottomNav) {
      console.log('✅ BottomNav component found');
      
      const buttons = await page.$$('nav[aria-label="Navegação mobile"] button');
      console.log(`✅ Found ${buttons.length} buttons in BottomNav`);
      
      const centerButton = await page.$('button[aria-label="Ação"]');
      if (centerButton) {
        const box = await centerButton.boundingBox();
        console.log('✅ Center button (+) found');
        console.log(`   Position: x=${Math.round(box.x)}, y=${Math.round(box.y)}`);
        console.log(`   Size: ${Math.round(box.width)}x${Math.round(box.height)}`);
        
        const centerX = box.x + box.width / 2;
        const viewportCenter = 375 / 2;
        const offset = Math.abs(centerX - viewportCenter);
        console.log(`   Center X: ${Math.round(centerX)} (offset from center: ${Math.round(offset)}px)`);
        
        if (offset < 5) {
          console.log('✅ Button appears centered!');
        } else {
          console.log('⚠️  Button may not be perfectly centered');
        }
      } else {
        console.log('❌ Center button (+) not found');
      }
    } else {
      console.log('❌ BottomNav not found (page is protected or component not rendered)');
    }
    
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
