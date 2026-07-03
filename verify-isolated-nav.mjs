import { chromium } from '@playwright/test';

const testFile = 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/test-bottom-nav.html';
const screenshotPath = 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/bottom-nav-verification.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
  });

  try {
    console.log('📱 Testing BottomNav layout in isolated HTML...\n');
    
    // Open test file
    await page.goto(`file://${testFile.replace(/\//g, '\/')}`);
    console.log('✅ Test HTML loaded');
    
    // Wait for page to settle
    await page.waitForTimeout(500);
    
    // Get button position info from console
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('===') || text.includes('Button Center') || text.includes('Nav Center') || text.includes('Offset') || text.includes('Status')) {
        consoleMessages.push(text);
        console.log(text);
      }
    });
    
    // Evaluate button position
    const result = await page.evaluate(() => {
      const centerBtn = document.querySelector('.action-btn');
      const nav = document.querySelector('nav');
      
      if (!centerBtn || !nav) {
        return { error: 'Button or nav not found' };
      }
      
      const rect = centerBtn.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      
      const btnCenterX = rect.left - navRect.left + rect.width / 2;
      const navCenterX = navRect.width / 2;
      const offset = Math.abs(btnCenterX - navCenterX);
      
      return {
        btnCenterX: parseFloat(btnCenterX.toFixed(1)),
        navCenterX: parseFloat(navCenterX.toFixed(1)),
        navWidth: navRect.width,
        btnWidth: rect.width,
        offset: parseFloat(offset.toFixed(1)),
        isCentered: offset < 2
      };
    });
    
    console.log('\n=== BottomNav Center Button Analysis ===');
    console.log(`Button Center X: ${result.btnCenterX}px`);
    console.log(`Nav Center X: ${result.navCenterX}px`);
    console.log(`Nav Width: ${result.navWidth}px`);
    console.log(`Button Width: ${result.btnWidth}px`);
    console.log(`Offset from center: ${result.offset}px`);
    
    if (result.isCentered) {
      console.log('\n✅✅✅ SUCCESS: Button is PERFECTLY CENTERED!');
    } else {
      console.log(`\n❌ Button is ${result.offset}px off-center`);
    }
    
    // Take screenshot
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
