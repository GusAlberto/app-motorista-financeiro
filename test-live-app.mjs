import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
  });

  try {
    console.log('📱 Testing live app at localhost:3000...\n');
    
    // Go to login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    console.log('✅ Login page loaded');
    
    // Check for BottomNav on public page (should not appear)
    let bottomNav = await page.$('nav[aria-label="Navegação mobile"]');
    console.log(`   BottomNav on /login: ${bottomNav ? '❌ Should not appear' : '✅ Correctly hidden'}`);
    
    // Go to home
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    console.log('✅ Home page loaded');
    
    bottomNav = await page.$('nav[aria-label="Navegação mobile"]');
    console.log(`   BottomNav on /: ${bottomNav ? '❌ Should not appear' : '✅ Correctly hidden'}`);
    
    // Check if BottomNav component code exists in the bundle
    const html = await page.content();
    if (html.includes('Navegação mobile')) {
      console.log('\n⚠️  BottomNav code found in HTML');
    } else {
      console.log('\n✅ BottomNav code NOT in public pages (correct)');
    }
    
    // Check layout.tsx includes BottomNav
    const layoutTest = await page.evaluate(() => {
      return document.documentElement.outerHTML.includes('BottomNav');
    });
    console.log(`   Layout includes BottomNav: ${layoutTest ? '✅ Yes' : '❌ No'}`);
    
    // Try to access protected route to see if BottomNav renders
    console.log('\n📍 Checking protected routes...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    
    const url = page.url();
    if (url.includes('/login')) {
      console.log('✅ Protected route redirects to login (correct)');
    } else {
      console.log('   Possible authenticated access');
      
      bottomNav = await page.$('nav[aria-label="Navegação mobile"]');
      if (bottomNav) {
        console.log('✅✅ BottomNav FOUND on authenticated page!');
      } else {
        console.log('❌ BottomNav NOT found on authenticated page');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
