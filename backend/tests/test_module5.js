require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

const testModule5 = async () => {
  try {
    console.log('🧪 Starting Phone Lookup Module Tests...\n');

    // 1. Get Auth Token (Prerequisite)
    console.log('🔑 Authenticating...');
    await axios.post(`${API_URL}/auth/send-otp`, { phone: '+919876543210' });
    const loginRes = await axios.post(`${API_URL}/auth/verify-otp`, {
      phone: '+919876543210',
      otp: '123456'
    });
    authToken = loginRes.data.token;
    console.log('   ✅ Valid token received');

    // Numbers to test
    const testCases = [
      { name: 'Synthetic Contact', phone: '+919820555555', desc: 'Should hit PhoneDirectory mock user' },
      { name: 'Known Spam', phone: '+918005550199', desc: 'Should hit SpamSeeds database' },
      { name: 'Generic India Mobile', phone: '+919820123456', desc: 'Should hit MobileSeries for operator/circle' },
      { name: 'Global Number', phone: '+12125551234', desc: 'Should hit Carrier or generic E.164 parsing' }
    ];

    for (const tc of testCases) {
      console.log(`\n🔍 Looking up ${tc.phone} (${tc.name})...`);
      console.log(`   ${tc.desc}`);
      try {
        const res = await axios.get(`${API_URL}/phone/lookup/${encodeURIComponent(tc.phone)}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const profile = res.data.data;
        console.log('   ✅ Profile Found:');
        console.log(`      Name:     ${profile.name || 'N/A'}`);
        console.log(`      Carrier:  ${profile.carrier}`);
        console.log(`      Location: ${profile.location}`);
        console.log(`      Type:     ${profile.type}`);
        console.log(`      Spam:     ${profile.isSpam ? 'YES (' + profile.spamScore + ')' : 'No'}`);
        
      } catch (err) {
        console.error('   ❌ Lookup failed:', err.response?.data?.message || err.message);
      }
    }

    console.log('\n🎉 Module 5 testing complete!');
    
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testModule5();
