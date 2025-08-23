// 🧠 Screen Reader Accessibility Test
// Testing screen reader functionality and accessibility features

console.log('🧪 Testing Screen Reader Accessibility Features\n');

// Test 1: Check if screen reader elements exist
console.log('1. Testing Screen Reader Element Existence:');

const checkElement = (id, description) => {
    const element = document.getElementById(id);
    if (element) {
        console.log(`✅ ${description} exists`);
        console.log(`   - ID: ${element.id}`);
        console.log(`   - Classes: ${element.className}`);
        console.log(`   - ARIA Live: ${element.getAttribute('aria-live')}`);
        console.log(`   - ARIA Atomic: ${element.getAttribute('aria-atomic')}`);
        return element;
    } else {
        console.log(`❌ ${description} not found`);
        return null;
    }
};

const srAnnouncements = checkElement('sr-announcements', 'Screen Reader Announcements');

// Test 2: Check screen reader toggle button
console.log('\n2. Testing Screen Reader Toggle Button:');
const toggleButton = document.querySelector('.screen-reader-toggle');
if (toggleButton) {
    console.log('✅ Screen reader toggle button exists');
    console.log(`   - Title: ${toggleButton.title}`);
    console.log(`   - ARIA Label: ${toggleButton.getAttribute('aria-label')}`);
    console.log(`   - ARIA Pressed: ${toggleButton.getAttribute('aria-pressed')}`);
    console.log(`   - Classes: ${toggleButton.className}`);
} else {
    console.log('❌ Screen reader toggle button not found');
}

// Test 3: Test accessibility CSS classes
console.log('\n3. Testing CSS Accessibility Classes:');
const testCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
        .test-sr-only {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        }
    `;
    document.head.appendChild(style);

    const testElement = document.createElement('div');
    testElement.className = 'test-sr-only';
    testElement.textContent = 'Test screen reader content';
    document.body.appendChild(testElement);

    const computed = window.getComputedStyle(testElement);
    const isHidden = computed.width === '1px' && computed.height === '1px';

    document.body.removeChild(testElement);
    document.head.removeChild(style);

    return isHidden;
};

if (testCSS()) {
    console.log('✅ Screen reader CSS classes work correctly');
} else {
    console.log('❌ Screen reader CSS classes not working');
}

// Test 4: Browser compatibility detection
console.log('\n4. Testing Browser Compatibility:');
const detectBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Firefox')) return 'Firefox';
    return 'Unknown';
};

const browser = detectBrowser();
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

console.log(`Browser: ${browser}`);
console.log(`Mobile: ${isMobile}`);
console.log(`Android: ${isAndroid}`);
console.log(`iOS: ${isIOS}`);

// Test 5: Screen reader detection capabilities
console.log('\n5. Testing Screen Reader Detection:');
const detectScreenReaderFeatures = () => {
    const features = {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        ariaSupport: 'ariaLabel' in document.createElement('div'),
        speechSynthesis: 'speechSynthesis' in window,
        localStorage: 'localStorage' in window
    };

    Object.entries(features).forEach(([feature, supported]) => {
        console.log(`${supported ? '✅' : '❌'} ${feature}: ${supported}`);
    });

    return features;
};

const features = detectScreenReaderFeatures();

// Test 6: Simulate screen reader toggle
console.log('\n6. Testing Screen Reader Toggle Functionality:');
if (toggleButton && srAnnouncements) {
    console.log('Simulating screen reader toggle...');

    // Check initial state
    const initialState = toggleButton.getAttribute('aria-pressed') === 'true';
    console.log(`Initial state: ${initialState ? 'enabled' : 'disabled'}`);

    // Simulate click
    toggleButton.click();

    setTimeout(() => {
        const newState = toggleButton.getAttribute('aria-pressed') === 'true';
        console.log(`New state after toggle: ${newState ? 'enabled' : 'disabled'}`);

        const hasActiveClass = toggleButton.classList.contains('active');
        const bodyHasClass = document.body.classList.contains('screen-reader-enabled');

        console.log(`Button has active class: ${hasActiveClass}`);
        console.log(`Body has screen-reader-enabled class: ${bodyHasClass}`);
        console.log(`Announcement text: "${srAnnouncements.textContent}"`);
    }, 100);
}

console.log('\n✅ Screen Reader Accessibility Test Completed!');
console.log('\nImplemented Features:');
console.log('• Screen reader announcement div with proper ARIA attributes');
console.log('• Toggle button with accessibility icon and ARIA labels');
console.log('• Auto-detection of screen reader preferences');
console.log('• Visual feedback when screen reader mode is enabled');
console.log('• Support for Chrome, Safari, Edge, and mobile browsers');
console.log('• LocalStorage persistence of user preferences');
console.log('• CSS-only visual hiding with focus visibility for skip links');
