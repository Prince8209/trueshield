require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
const TARGET_NUMBER = '+919876111111'; // Pure dev number, completely clean initially

const testModule7 = async () => {
  try {
    console.log('🧪 Starting Spam Reporting Module Tests...\n');

    // 1. Authenticate user
    console.log('🔑 Authenticating user...');
    await axios.post(`${API_URL}/auth/send-otp`, { phone: '+919876543210' });
    const loginRes = await axios.post(`${API_URL}/auth/verify-otp`, {
      phone: '+919876543210',
      otp: '123456'
    });
    authToken = loginRes.data.token;
    console.log('   ✅ Valid token received');

    // 2. Initial lookup
    console.log(`\n🔍 First Lookup: ${TARGET_NUMBER} (Expected: Clean)`);
    let res = await axios.get(`${API_URL}/phone/lookup/${encodeURIComponent(TARGET_NUMBER)}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    let profile = res.data.data;
    console.log(`   ✅ Original Spam Score: ${profile.spamScore}%`);

    // 3. Report as Scam
    console.log(`\n🛑 Reporting ${TARGET_NUMBER} as Scam...`);
    const reportRes = await axios.post(`${API_URL}/spam/report`, {
      phoneNumber: TARGET_NUMBER,
      reason: 'scam'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`   ✅ Success! New Global Score: ${reportRes.data.data.newSpamScore}%`);

    // 4. Second lookup (Verify global score updated)
    console.log(`\n🔍 Second Lookup: ${TARGET_NUMBER} (Expected: Higher spam score natively)`);
    res = await axios.get(`${API_URL}/phone/lookup/${encodeURIComponent(TARGET_NUMBER)}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    profile = res.data.data;
    console.log(`   ✅ Database Confirmed Score: ${profile.spamScore}% | isSpam: ${profile.isSpam}`);
    
    // 5. Unreport
    console.log(`\n↩️  Undo Report (Un-reporting)...`);
    await axios.post(`${API_URL}/spam/unreport`, {
      phoneNumber: TARGET_NUMBER,
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`   ✅ Undo successful. Score reduced to zero.`);

    console.log('\n🎉 Module 7 testing complete!');
    
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testModule7();
