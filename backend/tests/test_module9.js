const axios = require('axios');

const AI_URL = 'http://localhost:8000';

const testMessages = [
  "Hey Mom, what time is dinner?",
  "URGENT: Your account has been locked. Click here to verify http://scam.link.com",
  "Free entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005. Text FA to 87121",
  "Are we still on for the movies tonight?",
  "WINNER!! You have been selected to receive a £900 prize reward! Call 09061701461 to claim.",
  "Your Amazon package has been delayed. Reply to track it.",
  "Let's meet at the coffee shop at 5.",
  "Final Notice: You have 1 unread message from the IRS regarding your tax return."
];

const testModule9 = async () => {
  try {
    console.log('🧪 Starting Python AI Service Tests...\n');

    // 1. Health check
    console.log('🩺 Pinging AI Service Health Endpoint...');
    const healthRes = await axios.get(`${AI_URL}/health`);
    console.log(`   ✅ Status: ${healthRes.data.status} | Service: ${healthRes.data.service}\n`);

    if (healthRes.data.status === 'degraded') {
      console.log('⚠️ Models not loaded. Please ensure train.py ran successfully.');
      process.exit(1);
    }

    // 2. Predictions
    console.log('🧠 Sending 8 Test Messages to the NLP Classifier...\n');

    let correctCount = 0;

    for (let i = 0; i < testMessages.length; i++) {
        const text = testMessages[i];
        
        const start = performance.now();
        const res = await axios.post(`${AI_URL}/predict`, { text });
        const latency = (performance.now() - start).toFixed(2);
        
        const data = res.data;
        const tag = data.is_spam ? '🚫 SPAM' : '✅ SAFE';

        console.log(`💬 Message: "${text}"`);
        console.log(`   Result:  ${tag} (Confidence: ${data.confidence}%) | ⏱️ ${latency}ms\n`);
    }

    console.log('🎉 Module 9 AI testing complete!');
    
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('The Python AI Server is not running on port 8000. Please start it using uvicorn.');
    } else if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

testModule9();
