import { chromium } from '@playwright/test';

const screenshotPath = 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/bottom-nav-mobile.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
  });

  try {
    console.log('📱 Testing BottomNav in mobile viewport (375x812)...\n');
    
    // Go to signup
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
    console.log('✅ Signup page loaded');
    
    // Generate test email
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    // Fill inputs by ID
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    
    // Accept terms
    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) {
      await checkbox.click();
      console.log('✅ Form filled');
    }
    
    // Submit
    const button = await page.$('button[type="submit"]');
    if (button) {
      await button.click();
      console.log('✅ Signup submitted');
      
      // Wait for response
      await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 }).catch(() => {
        console.log('⚠️  No navigation after submit (expected if email verification required)');
      });
    }
    
    // Wait a bit
    await page.waitForTimeout(1000);
    
    // Check if we're on dashboard or got redirected
    const url = page.url();
    console.log(`📍 Current URL: ${url}\n`);
    
    // Check for BottomNav
    const bottomNav = await page.$('nav[aria-label="Navegação mobile"]');
    
    if (bottomNav) {
      console.log('✅ BottomNav component FOUND!\n');
      
      // Get all buttons
      const buttons = await page.$$('nav[aria-label="Navegação mobile"] button');
      console.log(`📊 Found ${buttons.length} buttons in BottomNav`);
      
      // Check center button
      const centerButton = await page.$('button[aria-label="Ação"]');
      if (centerButton) {
        const box = await centerButton.boundingBox();
        const centerX = box.x + box.width / 2;
        const viewportCenter = 375 / 2;
        const offset = Math.abs(centerX - viewportCenter);
        
        console.log('\n🎯 Center Action Button (+):');
        console.log(`   Position: x=${Math.round(box.x)}, y=${Math.round(box.y)}`);
        console.log(`   Size: ${Math.round(box.width)} x ${Math.round(box.height)}px`);
        console.log(`   Center X: ${Math.round(centerX)}px`);
        console.log(`   Viewport center: ${Math.round(viewportCenter)}px`);
        console.log(`   Offset from center: ${Math.round(offset)}px`);
        
        if (offset < 3) {
          console.log('\n✅✅✅ SUCCESS: Button is perfectly CENTERED!');
        } else if (offset < 10) {
          console.log(`\n⚠️  Button is ${Math.round(offset)}px off-center (acceptable)`);
        } else {
          console.log(`\n❌ Button is ${Math.round(offset)}px off-center (not centered)`);
        }
      } else {
        console.log('❌ Center button not found');
      }
      
      // Take screenshot
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`\n📸 Screenshot: ${screenshotPath}`);
      
    } else {
      console.log('❌ BottomNav NOT FOUND');
      console.log('   This may be expected if the page is behind auth wall');
      console.log('\n🔍 Checking page content...');
      const html = await page.content();
      if (html.includes('BottomNav')) {
        console.log('   BottomNav code is present in HTML');
      } else {
        console.log('   BottomNav component not in HTML (likely not rendered due to auth)');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
