import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import { Shield, Smartphone, KeyRound } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return setError('Please enter a phone number');
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/send-otp', { phone });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the OTP');
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-truegray-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-truegray-800 border border-gray-700 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center rounded-2xl mb-4 text-trueblue-400">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">TrueShield Sign In</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {step === 1 ? 'Enter your phone number to continue' : `Enter the verification code sent to ${phone}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-3 bg-truegray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-trueblue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-trueblue-500 hover:bg-trueblue-400 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-3 tracking-widest bg-truegray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-trueblue-500 focus:border-transparent transition-all text-center text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-trueblue-500 hover:bg-trueblue-400 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign In securely'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-3 text-gray-400 hover:text-white font-medium text-sm transition-colors"
            >
              ← Use a different number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
