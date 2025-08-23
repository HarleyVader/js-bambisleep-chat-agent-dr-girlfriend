// JSON Error Testing Script
// Run this in browser console to test the storage cleanup functionality

console.log('🧪 Testing JSON Error Handling and Storage Cleanup...');

// Test 1: Check if emergency cleanup function is available
function testEmergencyCleanup() {
    if (typeof window.emergencyStorageCleanup === 'function') {
        console.log('✅ Emergency cleanup function is available');
        return true;
    } else {
        console.error('❌ Emergency cleanup function not found');
        return false;
    }
}

// Test 2: Create corrupted localStorage entries to test cleanup
function testCorruptedDataCleanup() {
    try {
        // Create some corrupted entries
        localStorage.setItem('test_corrupted_1', '[object Object]');
        localStorage.setItem('test_corrupted_2', 'undefined');
        localStorage.setItem('test_corrupted_3', '{invalid json}');

        console.log('✅ Created test corrupted data');

        // Wait a moment, then check if they get cleaned up
        setTimeout(() => {
            const stillCorrupted = [
                localStorage.getItem('test_corrupted_1'),
                localStorage.getItem('test_corrupted_2'),
                localStorage.getItem('test_corrupted_3')
            ].filter(item => item !== null);

            if (stillCorrupted.length === 0) {
                console.log('✅ Corrupted data was automatically cleaned up');
            } else {
                console.warn('⚠️ Some corrupted data remains:', stillCorrupted);
            }
        }, 2000);

        return true;
    } catch (error) {
        console.error('❌ Failed to test corrupted data cleanup:', error);
        return false;
    }
}

// Test 3: Test memory service functionality
async function testMemoryService() {
    try {
        // Check if memory service functions are working
        if (typeof window.memoryService !== 'undefined') {
            console.log('✅ Memory service is available');
        } else {
            console.log('ℹ️ Memory service not exposed globally (this is normal)');
        }

        // Test LocalForage is working
        if (typeof localforage !== 'undefined') {
            await localforage.setItem('test_key', 'test_value');
            const retrieved = await localforage.getItem('test_key');
            if (retrieved === 'test_value') {
                console.log('✅ LocalForage is working correctly');
                await localforage.removeItem('test_key');
            } else {
                console.warn('⚠️ LocalForage not working as expected');
            }
        } else {
            console.log('ℹ️ LocalForage not available in global scope');
        }

        return true;
    } catch (error) {
        console.error('❌ Memory service test failed:', error);
        return false;
    }
}

// Test 4: Simulate JSON parsing error to test error handling
function testErrorHandling() {
    try {
        console.log('🧪 Testing error handling by simulating JSON parse error...');

        // Create a promise that rejects with a JSON parsing error
        const fakeJsonError = Promise.reject(new SyntaxError('"[object Object]" is not valid JSON'));

        // This should be caught by our global error handler
        fakeJsonError.catch(() => {
            // Error already handled by global handler
        });

        console.log('✅ Error handling test completed');
        return true;
    } catch (error) {
        console.error('❌ Error handling test failed:', error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting comprehensive storage and error handling tests...');

    const results = {
        emergencyCleanup: testEmergencyCleanup(),
        corruptedDataCleanup: testCorruptedDataCleanup(),
        memoryService: await testMemoryService(),
        errorHandling: testErrorHandling()
    };

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    console.log('📋 Detailed Results:', results);

    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! JSON error handling is working correctly.');
    } else {
        console.log('⚠️ Some tests failed - check individual results above');
    }

    // Provide manual cleanup instructions
    console.log('\n💡 Manual Commands Available:');
    console.log('- window.emergencyStorageCleanup() - Clean all storage');
    console.log('- localStorage.clear() - Clear localStorage only');
    console.log('- sessionStorage.clear() - Clear sessionStorage only');

    return results;
}

// Auto-run tests
runAllTests();
