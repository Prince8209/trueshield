import { useState } from 'react';
import { api } from '../context/AuthContext';
import { Search, MapPin, Radio, ShieldAlert, ShieldCheck, Flag, UserX, Loader2, Undo2 } from 'lucide-react';

export default function PhoneScanner() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reporting, setReporting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);

    // Default assume they entered a pure number but format it to support E.164 dynamically handled by backend
    try {
      // Send raw query, backend utils/phone.util parses it
      const res = await api.get(`/phone/lookup/${encodeURIComponent(query)}`);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not find information for this number.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSpam = async (isReporting) => {
    setReporting(true);
    try {
      if (isReporting) {
        const res = await api.post('/spam/report', { phoneNumber: result.phoneNumber, reason: 'scam' });
        setResult(prev => ({
          ...prev,
          isSpam: true,
          spamScore: res.data.data.newSpamScore
        }));
      } else {
        await api.post('/spam/unreport', { phoneNumber: result.phoneNumber });
        setResult(prev => ({
          ...prev,
          isSpam: false,
          spamScore: 0 // Simplistic zeroing for UI optimism
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update global database.');
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="w-full animation-fade-in">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-trueblue-500 group-focus-within:text-trueblue-400 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter any phone number (e.g. +91 98765 43210)"
          className="w-full pl-14 pr-32 py-5 bg-truegray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-lg text-white shadow-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-trueblue-500/50 focus:border-trueblue-500 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-3 bottom-3 px-6 bg-trueblue-500 hover:bg-trueblue-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lookup'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="mt-10 max-w-2xl mx-auto bg-truegray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header Bar */}
          <div className={`p-6 sm:p-8 border-b ${result.isSpam ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-800/50 border-gray-700'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  {result.name || 'Unknown Caller'}
                  {result.isSpam && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 uppercase tracking-wider ring-1 ring-red-500/30">
                      <ShieldAlert className="w-3.5 h-3.5" /> High Risk
                    </span>
                  )}
                </h2>
                <p className="text-gray-400 mt-2 font-mono text-lg">{result.phoneNumber}</p>
              </div>
              
              {!result.isSpam ? (
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 ring-4 ring-gray-900 border border-green-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 ring-4 ring-gray-900 border border-red-500/30">
                  <UserX className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-truegray-800">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-4 h-4" /> Carrier
              </span>
              <p className="text-lg text-white capitalize">{result.carrier}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </span>
              <p className="text-lg text-white">{result.location}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Search className="w-4 h-4" /> Type
              </span>
              <p className="text-lg text-white capitalize">{result.type.replace('_', ' ')}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Global Spam Score
              </span>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex-1 h-3 bg-gray-700 overflow-hidden rounded-full">
                  <div 
                    className={`h-full ${result.spamScore > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${result.spamScore}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${result.spamScore > 50 ? 'text-red-400' : 'text-green-400'}`}>
                  {result.spamScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end">
            {!result.isSpam ? (
              <button
                onClick={() => toggleSpam(true)}
                disabled={reporting}
                className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors"
              >
                {reporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                Report as Spam/Scam
              </button>
            ) : (
              <button
                onClick={() => toggleSpam(false)}
                disabled={reporting}
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                {reporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo2 className="w-4 h-4" />}
                Undo Report
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
