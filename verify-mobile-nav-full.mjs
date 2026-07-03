import { chromium } from '@playwright/test';

const screenshotPath = 'C:/Users/GUSTAV~1/AppData/Local/Temp/claude/D--Claude-Code/66ce6167-6aca-498f-82f1-ce7b84b6ac20/scratchpad/mobile-nav-full.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
  });

  try {
    console.log('📱 Opening signup page in mobile viewport (375x812)...');
    
    // Go to signup
    await page.goto('http://localhost:3000/signup', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    console.log('✅ Signup page loaded');
    
    // Generate a random test email
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    // Wait for form inputs
    await page.waitForSelector('input[name="email"]', { timeout: 5000 });
    
    // Fill in email
    console.log(`📝 Filling email: ${testEmail}`);
    await page.fill('input[name="email"]', testEmail);
    await page.waitForTimeout(300);
    
    // Fill in password
    console.log('📝 Filling password...');
    await page.fill('input[name="password"]', testPassword);
    await page.waitForTimeout(300);
    
    // Fill in confirm password
    console.log('📝 Filling confirm password...');
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.waitForTimeout(300);
    
    // Click signup button
    console.log('🖱️  Clicking signup button...');
    const signupButton = await page.$('button[type="submit"]');
    if (signupButton) {
      await signupButton.click();
      
      // Wait for navigation or error message
      console.log('⏳ Waiting for signup response...');
      await page.waitForTimeout(3000);
      
      const url = page.url();
      console.log('📍 Current URL:', url);
      
      // Check if still on signup (meaning error) or moved to dashboard
      if (url.includes('signup')) {
        const errorMsg = await page.textContent('[role="alert"]') || 'Unknown error';
        console.log('⚠️  Signup failed or waiting for email verification:', errorMsg);
      } else {
        console.log('✅ Signup successful, checking for BottomNav...');
      }
    }
    
    // Try to find BottomNav anyway
    await page.waitForTimeout(1000);
    const bottomNav = await page.$('nav[aria-label="Navegação mobile"]');
    if (bottomNav) {
      console.log('✅✅ BottomNav component FOUND!');
      
      const centerButton = await page.$('button[aria-label="Ação"]');
      if (centerButton) {
        const box = await centerButton.boundingBox();
        console.log('✅ Center button (+) found');
        console.log(`   Position: x=${Math.round(box.x)}, y=${Math.round(box.y)}`);
        console.log(`   Size: ${Math.round(box.width)}x${Math.round(box.height)}`);
        
        const centerX = box.x + box.width / 2;
        const viewportCenter = 375 / 2;
        const offset = Math.abs(centerX - viewportCenter);
        console.log(`   Center X: ${Math.round(centerX)} (viewport center: ${Math.round(viewportCenter)})`);
        console.log(`   Offset from center: ${Math.round(offset)}px`);
        
        if (offset < 5) {
          console.log('✅✅✅ Button is perfectly CENTERED!');
        } else {
          console.log(`⚠️  Button offset: ${Math.round(offset)}px from center`);
        }
      }
      
      // Screenshot
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
    } else {
      console.log('❌ BottomNav still not found (auth wall or not rendered)');
      console.log('   This is expected as signup may require email verification');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
