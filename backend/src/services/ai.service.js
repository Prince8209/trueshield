const axios = require('axios');
const env = require('../config/env.config');

/**
 * Service to interact with the TrueShield Python AI Microservice
 */
class AIService {
  constructor() {
    this.baseUrl = env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Check if the AI service is online and healthy
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, { timeout: 2000 });
      return response.data;
    } catch (error) {
      return { status: 'offline', message: 'AI Service is unreachable' };
    }
  }

  /**
   * Send text to the ML model to predict spam/scam probability
   * @param {string} text - The SMS message
   * @returns {Object} { is_spam: true/false, confidence: 99.9, original_text: "" }
   */
  async predictMessage(text) {
    try {
      const response = await axios.post(`${this.baseUrl}/predict`, { text }, { timeout: 5000 });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        throw new Error('AI_SERVICE_OFFLINE');
      }
      if (error.response && error.response.status === 503) {
        throw new Error('AI_MODELS_NOT_LOADED');
      }
      throw new Error(`AI Prediction failed: ${error.message}`);
    }
  }
}

module.exports = new AIService();
