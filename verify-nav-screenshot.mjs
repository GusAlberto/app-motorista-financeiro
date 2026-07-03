import { chromium } from '@playwright/test';

const testFile = 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/test-bottom-nav.html';
const screenshotPath = 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/bottom-nav-final.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
  });

  try {
    await page.goto(`file://${testFile}`);
    await page.waitForTimeout(500);
    
    // Zoom in on the bottom nav area
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
      clip: { x: 0, y: 700, width: 375, height: 112 }
    });
    
    console.log(`✅ BottomNav screenshot saved: ${screenshotPath}`);
    
    // Also save full page for reference
    await page.screenshot({
      path: 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/full-page.png',
      fullPage: false
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
