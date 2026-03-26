require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

const testMessages = [
  "Are we still on for the movies tonight?",
  "URGENT: Your account has been locked. Click here to verify http://scam.link.com",
  "WINNER!! You have been selected to receive a £900 prize reward! Call 09061701461 to claim."
];

const testModule10 = async () => {
  try {
    console.log('🧪 Starting Node <-> Python Integration Tests...\n');

    // 1. Authenticate user
    console.log('🔑 Authenticating user...');
    await axios.post(`${API_URL}/auth/send-otp`, { phone: '+919876543210' });
    const loginRes = await axios.post(`${API_URL}/auth/verify-otp`, {
      phone: '+919876543210',
      otp: '123456'
    });
    authToken = loginRes.data.token;
    console.log('   ✅ Valid token received\n');

    // 2. Scan messages through Node.js Express Server
    console.log('📡 Sending texts to Node.js backend (which proxies to Python)...\n');

    for (const text of testMessages) {
        const start = performance.now();
        
        // Post to Node.js Express server on port 5000, not the AI on port 8000
        const res = await axios.post(`${API_URL}/messages/scan`, { text }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const latency = (performance.now() - start).toFixed(2);
        const data = res.data.data;
        
        let visualTag = '';
        if (data.threatLevel === 'Safe') visualTag = '🟢 SAFE';
        if (data.threatLevel === 'Suspicious') visualTag = '🟡 SUSPICIOUS';
        if (data.threatLevel === 'Malicious') visualTag = '🔴 MALICIOUS';

        console.log(`💬 Message: "${text}"`);
        console.log(`   Threat Level:   ${visualTag} (${data.aiConfidence})`);
        console.log(`   Recommendation: ${data.recommendation}`);
        console.log(`   ⏱️ Round-Trip:  ${latency}ms\n`);
    }

    console.log('🎉 Module 10 testing complete!');
    
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testModule10();
