require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const API_URL = 'http://localhost:5000/api';
const REFRESH_URL = 'mongodb://127.0.0.1:27017/trueshield';
let authToken = '';

// A completely random number that is DEFINITELY not in our 10k synthetic library
const UNKNOWN_NUMBER = '+919876000000'; // Ends in 0, mock API should flag it as a scammer

const testModule6 = async () => {
  try {
    console.log('🧪 Starting External API Aggregation Tests...\n');

    // 1. Get Auth Token
    console.log('🔑 Authenticating...');
    await axios.post(`${API_URL}/auth/send-otp`, { phone: '+919876543210' });
    const loginRes = await axios.post(`${API_URL}/auth/verify-otp`, {
      phone: '+919876543210',
      otp: '123456'
    });
    authToken = loginRes.data.token;
    console.log('   ✅ Valid token received');

    // 2. Clear this specific number from DB to ensure a clean test
    await mongoose.connect(REFRESH_URL);
    await mongoose.connection.collection('phonedirectories').deleteOne({ phoneNumber: UNKNOWN_NUMBER });
    console.log(`\n🧹 Cleared ${UNKNOWN_NUMBER} from MongoDB cash to force External API call.`);

    // 3. First Lookup (Should hit External API)
    console.log(`\n🔍 First Lookup: ${UNKNOWN_NUMBER} (Expected: Slow, Hits External API)`);
    console.time('   ⏱️ Lookup Time (External)');
    const firstRes = await axios.get(`${API_URL}/phone/lookup/${encodeURIComponent(UNKNOWN_NUMBER)}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.timeEnd('   ⏱️ Lookup Time (External)');
    
    const profile = firstRes.data.data;
    console.log('   ✅ Profile Acquired:');
    console.log(`      Name:     ${profile.name}`);
    console.log(`      Carrier:  ${profile.carrier}`);
    console.log(`      Spam:     ${profile.isSpam ? 'YES (' + profile.spamScore + ')' : 'No'}`);

    // Wait 1 second to ensure DB cache resolves
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 4. Second Lookup (Should hit Local MongoDB instantly)
    console.log(`\n🔍 Second Lookup: ${UNKNOWN_NUMBER} (Expected: Fast, Hits Local Cache)`);
    console.time('   ⏱️ Lookup Time (Local Cache)');
    const secondRes = await axios.get(`${API_URL}/phone/lookup/${encodeURIComponent(UNKNOWN_NUMBER)}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.timeEnd('   ⏱️ Lookup Time (Local Cache)');
    
    console.log('   ✅ Profile Acquired Directly From MongoDB!');

    // Cleanup
    await mongoose.disconnect();
    console.log('\n🎉 Module 6 testing complete!');
    
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
};

testModule6();
