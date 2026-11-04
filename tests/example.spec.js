// @ts-check
const { test, expect } = require('@playwright/test');

test('Tookan Complete Automation', async ({ browser }) => {

    // ─── Setup context with geolocation permission ────────────────────
    const context = await browser.newContext({
        permissions: ['geolocation'],
        geolocation: { latitude: 30.7046, longitude: 76.7179 },
    });


    const page = await context.newPage();
    page.setDefaultTimeout(60000);

    // Maximize using window.moveTo and resizeTo
    await page.goto('about:blank');
    await page.evaluate(() => {
        window.moveTo(0, 0);
        window.resizeTo(screen.availWidth, screen.availHeight);
    });
    console.log('Window maximized.');

    // ─── Login ────────────────────────────────────────────────────────
    await page.goto('https://app.tookanapp.com/#/login');
    await page.locator('#email').waitFor();
    await page.locator('#email').fill('merry.gadaili1+1@deltaschool.in');
    await page.locator('#password').fill('merry@123');
    await page.locator('//button[@type="submit"]').click();
    console.log('Login attempted successfully.');

    // Wait for dashboard
    await page.waitForFunction(() =>
        window.location.href.includes('dashboard')
    , { timeout: 60000 });
    await page.waitForTimeout(2000);
    console.log('Dashboard loaded.');

    // Step 1: Click main menu
    await page.locator('//li[@class="menu-trigger"]').click();
    console.log('Main menu clicked.');
    await page.waitForTimeout(1500);

    // Step 2: Click Settings
    await page.locator('//span[contains(@class,"full-text") and normalize-space()="Settings"]').click();
    console.log('Settings clicked.');
    await page.waitForTimeout(1500);

    // Step 3: Switch to iframe → click Web App Editor
    await page.waitForTimeout(2000);
    const iframe = page.frameLocator('.new-angular');
    await iframe.locator('//li[contains(text(),"Web App Editor")]').click();
    console.log('Web App Editor clicked.');
    await page.waitForTimeout(2000);
    console.log('Stayed in same window after Web App Editor.');

    // Step 4: Click bnbnbnnnb link inside iframe
    await page.waitForTimeout(1500);

    // Set up page listener BEFORE clicking the link
    const pagePromise = context.waitForEvent('page');
    await iframe.locator('//a[contains(@class,"domain-url") and contains(@href,"bnbnbnnnb")]').click();
    console.log('Web app link clicked.');

    // Step 5: Switch to new tab
    const bookingPage = await pagePromise;
    await bookingPage.waitForLoadState('domcontentloaded');
    await bookingPage.waitForTimeout(5000);

    // Maximize booking page window using CDP
    const bookingSession = await context.newCDPSession(bookingPage);
    await bookingSession.send('Browser.setWindowBounds', {
        windowId: (await bookingSession.send('Browser.getWindowForTarget')).windowId,
        bounds: { windowState: 'maximized' }
    });
    console.log('Booking page maximized.');

    try {
        await bookingPage.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (e) {
        console.log('Network idle timeout, continuing anyway.');
    }

    bookingPage.setDefaultTimeout(60000);
    console.log('Switched to booking page.');
    console.log('Booking page URL: ' + bookingPage.url());

    // Step 6: Click Place Order
    await bookingPage.waitForTimeout(3000);
    await bookingPage.waitForSelector(
        '//button[@type="submit"] | //button[contains(@class,"get-estimate-btn")] | //button[contains(text(),"Place Order")]',
        { state: 'visible', timeout: 60000 }
    );
    await bookingPage.locator(
        '//button[@type="submit"] | //button[contains(@class,"get-estimate-btn")] | //button[contains(text(),"Place Order")]'
    ).first().click();
    console.log('Place Order clicked.');
    await bookingPage.waitForTimeout(2000);

    // Step 7: Click Sign up here
    await bookingPage.evaluate(() => {
        const links = document.querySelectorAll('a');
        for (let l of links) {
            if (l.textContent.includes('Sign up here')) {
                l.removeAttribute('target');
                l.click();
                break;
            }
        }
    });
    console.log('Sign up here clicked.');
    await bookingPage.waitForTimeout(4000);

    // Handle new tab if opened
    let signupPage = bookingPage;
    if (context.pages().length > 2) {
        signupPage = context.pages()[context.pages().length - 1];
    }
    signupPage.setDefaultTimeout(60000);

    // Maximize signup page
    const signupSession = await context.newCDPSession(signupPage);
    await signupSession.send('Browser.setWindowBounds', {
        windowId: (await signupSession.send('Browser.getWindowForTarget')).windowId,
        bounds: { windowState: 'maximized' }
    });
    console.log('Signup page maximized.');
    console.log('On signup page.');

    // Step 8: Fill Sign Up form
    await signupPage.waitForTimeout(2000);
    await signupPage.locator('#name').fill('auto50');
    await signupPage.locator('#email').fill('auto50@yopmail.com');
    await signupPage.locator('#phoneNumber').fill('1234567850');
    await signupPage.locator('#company').fill('kk');

    // Click location icon to fetch address
    await signupPage.locator('//i[contains(@class,"fa-location-crosshairs")]').click();
    await signupPage.waitForTimeout(4000);
    console.log('Address fetched.');

    await signupPage.locator('#password').fill('Test@123');
    await signupPage.locator('//input[@type="checkbox"]').click();
    console.log('Checkbox checked.');

    await signupPage.locator('//button[contains(text(),"Sign Up")]').click();
    console.log('Sign Up clicked.');
    await signupPage.waitForTimeout(2000);

    // ─────────────────────────────────────────────────────────────────
    // After Sign Up → Place Order flow
    // ─────────────────────────────────────────────────────────────────

    // Step 9: Navigate to newtask page
    await signupPage.waitForTimeout(3000);
    await signupPage.goto('https://bnbnbnnnb.tookan.in/app/newtask');
    await signupPage.waitForFunction(() =>
        window.location.href.includes('newtask')
    , { timeout: 60000 });
    console.log('On booking/newtask page after signup.');
    await signupPage.waitForTimeout(3000);

    // Step 10: Dismiss cookie banner
    try {
        await signupPage.locator('//button[contains(text(),"Got it")]').click({ timeout: 3000 });
        console.log('Cookie banner dismissed.');
    } catch (e) {
        console.log('No cookie banner.');
    }
    await signupPage.waitForTimeout(1000);

    // Step 11: Click Place Order nav button
    await signupPage.locator('//button[contains(@class,"get-estimate-btn")]').click();
    console.log('Place Order nav clicked.');
    await signupPage.waitForTimeout(2000);

    // Step 12: Click Appointment box
    await signupPage.evaluate(() => {
        document.getElementById('pickupHeading0').click();
    });
    console.log('Appointment box clicked - form fields opened.');
    await signupPage.waitForTimeout(2000);

    // Step 13: Fill Name
    await signupPage.locator('p-autocomplete[formcontrolname="name"] input').fill('Test User');
    console.log('Name filled.');

    // Step 14: Fill Phone Number
    await signupPage.locator('#phoneNumber').fill('9876543210');
    console.log('Phone filled.');

    // Step 15: Fill Email
    await signupPage.locator('[id="pickupEmail+0"]').fill('auto50@yopmail.com');
    console.log('Email filled.');

    // Step 16: Calculate Start and End Time
    const now = new Date();
    const startDT = new Date(now.getTime() + 10 * 60000);
    const endDT   = new Date(startDT.getTime() + 30 * 60000);

    const startHour12 = startDT.getHours() % 12 === 0 ? 12 : startDT.getHours() % 12;
    const startMin    = startDT.getMinutes();
    const startAmPm   = startDT.getHours() < 12 ? 'AM' : 'PM';

    const endHour12 = endDT.getHours() % 12 === 0 ? 12 : endDT.getHours() % 12;
    const endMin    = endDT.getMinutes();
    const endAmPm   = endDT.getHours() < 12 ? 'AM' : 'PM';

    console.log(`Target Start: ${startHour12}:${startMin} ${startAmPm}`);
    console.log(`Target End  : ${endHour12}:${endMin} ${endAmPm}`);

    // Step 17: Set Start Time
    await signupPage.locator('(//button[@aria-label="Choose Date" and contains(@class,"p-datepicker-dropdown")])[1]').click();
    await signupPage.waitForTimeout(1000);
    console.log('Start time picker opened.');
    await setTimePicker(signupPage, startHour12, startMin, startAmPm);
    await signupPage.locator('//td[contains(@class,"p-datepicker-today")]//span').first().click();
    await signupPage.waitForTimeout(500);
    console.log('Start time set.');

    // Step 18: Set End Time
    await signupPage.locator('(//button[@aria-label="Choose Date" and contains(@class,"p-datepicker-dropdown")])[2]').click();
    await signupPage.waitForTimeout(1000);
    console.log('End time picker opened.');
    await setTimePicker(signupPage, endHour12, endMin, endAmPm);
    await signupPage.locator('//td[contains(@class,"p-datepicker-today")]//span').first().click();
    await signupPage.waitForTimeout(500);
    console.log('End time set.');

    // Step 19: Fetch current address
    await signupPage.locator('//i[contains(@class,"fa-location-crosshairs")] | //i[contains(@class,"fa-crosshairs")]').click();
    console.log('Location icon clicked.');
    await signupPage.waitForTimeout(5000);
    console.log('Address fetched.');

    // Step 20: Click Place Order to submit
    await signupPage.locator('//button[contains(@class,"get-estimate-btn")]').click();
    console.log('Place Order submitted successfully!');
    await signupPage.waitForTimeout(5000);

    // Step 21: Close confirmation popup
    try {
        const closeBtn = signupPage.locator(
            '//div[contains(@class,"modal-header")]//i' +
            ' | //i[contains(@class,"material-icons") and contains(text(),"close")]' +
            ' | //div[contains(@class,"header-content")]//i[contains(@class,"icon")]'
        ).first();
        await closeBtn.evaluate(el => el.click());
        console.log('Order confirmation popup closed.');
    } catch (e) {
        try {
            await signupPage.locator('//button[contains(text(),"Go to Home")]').click({ timeout: 5000 });
            console.log('Closed popup via Go to Home.');
        } catch (e2) {
            console.log('No popup found, continuing.');
        }
    }
    await signupPage.waitForTimeout(2000);

    // Step 22: Click profile dropdown
    await signupPage.locator('//button[contains(@class,"profile-dropdown-btn")]').click();
    console.log('Profile dropdown clicked.');
    await signupPage.waitForTimeout(1000);

    // Step 23: Logout
    await signupPage.locator('//div[contains(@class,"dropdown-item")][.//img[@alt="Logout"]]').click();
    console.log('Logged out successfully!');
    await signupPage.waitForTimeout(2000);

    // Step 24: Click Place Order on home page
    await signupPage.locator('//button[@type="submit" and contains(@class,"submit")][.//div[contains(@class,"place-order")]]').click();
    console.log('Place Order clicked on home page.');
    await signupPage.waitForTimeout(2000);

    // Step 25: Enter email
    await signupPage.locator('#email').fill('auto50@yopmail.com');
    console.log('Login email entered.');

    // Step 26: Enter password
    await signupPage.locator('#password').fill('Test@123');
    console.log('Login password entered.');

    // Step 27: Click Login
    await signupPage.locator('//button[contains(@class,"submit_button")]').click();
    console.log('Login button clicked.');
    await signupPage.waitForTimeout(3000);

    // Step 28: Verify logged in
    await signupPage.waitForSelector('//button[contains(@class,"profile-dropdown-btn")]',
        { timeout: 60000 });
    console.log('Logged in successfully with existing credentials!');
    await signupPage.waitForTimeout(2000);

    // Step 29: Click profile dropdown
    await signupPage.locator('//button[contains(@class,"profile-dropdown-btn")]').click();
    console.log('Profile dropdown clicked.');
    await signupPage.waitForTimeout(1000);

    // Step 30: Logout
    await signupPage.locator('//div[contains(@class,"dropdown-item")][.//img[@alt="Logout"]]').click();
    console.log('Logged out successfully!');
    await signupPage.waitForTimeout(2000);

    // Step 31: Click Place Order on home page
    await signupPage.locator('//button[@type="submit" and contains(@class,"submit")][.//div[contains(@class,"place-order")]]').click();
    console.log('Place Order clicked on home page.');
    await signupPage.waitForTimeout(2000);

    // Step 32: Enter email
    await signupPage.locator('#email').fill('auto50@yopmail.com');
    console.log('Login email entered.');

    // Step 33: Enter WRONG password
    await signupPage.locator('#password').fill('WrongPassword@123');
    console.log('Wrong password entered.');

    // Step 34: Click Login button
    await signupPage.locator('//button[contains(@class,"submit_button")]').click();
    console.log('Login button clicked with wrong password.');
    await signupPage.waitForTimeout(2000);

    // Step 35: Verify error message
    await signupPage.waitForSelector(
        '//div[contains(@class,"error")] | //*[contains(text(),"Incorrect Password")]',
        { timeout: 10000 }
    );
    console.log('Incorrect Password error message displayed!');
    await signupPage.waitForTimeout(2000);

    // Step 36: Clear wrong password and enter correct password
    await signupPage.locator('#password').clear();
    await signupPage.locator('#password').fill('Test@123');
    console.log('Correct password entered.');

    // Step 37: Click Login again
    await signupPage.locator('//button[contains(@class,"submit_button")]').click();
    console.log('Login button clicked with correct password.');
    await signupPage.waitForTimeout(3000);

    // Step 38: Verify logged in successfully
    await signupPage.waitForSelector('//button[contains(@class,"profile-dropdown-btn")]',
        { timeout: 60000 });
    console.log('Logged in successfully with correct password!');
    await signupPage.waitForTimeout(2000);

    await context.close();
});

// ─── Helper: Set PrimeNG time picker ─────────────────────────────────────
async function setTimePicker(page, targetHour, targetMin, targetAmPm) {

    const hourBtns = await page.locator('div.p-datepicker-hour-picker button.p-button-icon-only').all();
    const minBtns  = await page.locator('div.p-datepicker-minute-picker button.p-button-icon-only').all();
    const ampmBtns = await page.locator('div.p-datepicker-ampm-picker button.p-button-icon-only').all();

    const hourSpan = page.locator(
        'div.p-datepicker-hour-picker span:not([class*="p-button"]):not([class*="p-icon"]):not([class*="p-ink"])'
    ).first();
    const minSpan = page.locator(
        'div.p-datepicker-minute-picker span:not([class*="p-button"]):not([class*="p-icon"]):not([class*="p-ink"])'
    ).first();
    const ampmSpan = page.locator(
        'div.p-datepicker-ampm-picker span:not([class*="p-button"]):not([class*="p-icon"]):not([class*="p-ink"])'
    ).first();

    let curHour  = parseInt(await hourSpan.innerText());
    let curMin   = parseInt(await minSpan.innerText());
    let curAmPm  = (await ampmSpan.innerText()).trim();

    console.log(`Picker showing: ${curHour}:${curMin} ${curAmPm}`);

    // Adjust Hour
    let attempts = 0;
    while (curHour !== targetHour && attempts < 12) {
        await hourBtns[0].evaluate(el => el.click());
        await page.waitForTimeout(150);
        curHour = parseInt(await hourSpan.innerText());
        attempts++;
    }

    // Adjust Minute
    attempts = 0;
    while (curMin !== targetMin && attempts < 60) {
        if (curMin < targetMin) {
            await minBtns[0].evaluate(el => el.click());
            curMin++;
        } else {
            await minBtns[1].evaluate(el => el.click());
            curMin--;
        }
        await page.waitForTimeout(100);
        attempts++;
    }

    // Adjust AM/PM
    curAmPm = (await ampmSpan.innerText()).trim();
    if (curAmPm.toLowerCase() !== targetAmPm.toLowerCase()) {
        await ampmBtns[0].evaluate(el => el.click());
        await page.waitForTimeout(200);
    }

    console.log(`Picker set to: ${targetHour}:${targetMin} ${targetAmPm}`);
}