require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

const testUserModule = async () => {
  try {
    console.log('🧪 Starting User Module Tests...\n');

    // 1. Send OTP to a test number
    console.log('1️⃣ Requesting OTP...');
    const sendOtpRes = await axios.post(`${API_URL}/auth/send-otp`, {
      phone: '+919876543210'
    });
    console.log('   ✅ OTP Sent:', sendOtpRes.data.message);
    const otp = '123456'; // The mock OTP generated in development
    
    // 2. Verify OTP to get token
    console.log('\n2️⃣ Verifying OTP & Logging In...');
    const verifyOtpRes = await axios.post(`${API_URL}/auth/verify-otp`, {
      phone: '+919876543210',
      otp: otp
    });
    authToken = verifyOtpRes.data.token;
    console.log('   ✅ Login successful! Token received.');

    // 3. Get User Profile
    console.log('\n3️⃣ Fetching User Profile...');
    const profileRes = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   ✅ Profile fetched successfully:');
    console.log('   ', profileRes.data.data);

    // 4. Update User Profile
    console.log('\n4️⃣ Updating User Profile...');
    const updateRes = await axios.put(`${API_URL}/users/profile`, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      spamBlockingPreferences: {
        blockKnownSpam: false,
        blockHiddenNumbers: true
      }
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   ✅ Profile updated successfully:');
    console.log('   ', updateRes.data.data);

    console.log('\n🎉 All tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testUserModule();
