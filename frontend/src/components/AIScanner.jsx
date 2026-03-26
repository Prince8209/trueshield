import { useState, useRef, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { TextSelect, ShieldCheck, ShieldAlert, AlertTriangle, Loader2 } from 'lucide-react';

export default function AIScanner() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleScan = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/messages/scan', { text });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the TrueShield AI engine.');
    } finally {
      setLoading(false);
    }
  };

  const getThreatColors = (level) => {
    if (level === 'Safe') return 'text-green-400 bg-green-500/10 border-green-500/20 ring-green-500/30';
    if (level === 'Suspicious') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 ring-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/20 ring-red-500/30';
  };

  const ThreatIcon = ({ level, className }) => {
    if (level === 'Safe') return <ShieldCheck className={className} />;
    if (level === 'Suspicious') return <AlertTriangle className={className} />;
    return <ShieldAlert className={className} />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animation-fade-in">
      <div className="bg-truegray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
        
        <div className="flex items-center gap-3 mb-6 focus-within:text-trueblue-400 transition-colors text-gray-500">
          <TextSelect className="w-5 h-5" />
          <h2 className="text-lg font-medium text-white">Paste Suspicious Message</h2>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="E.g. URGENT: Your account has been locked. Click here to verify http://scam.link.com"
          className="w-full min-h-[120px] bg-truegray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-trueblue-500/50 focus:border-trueblue-500 transition-all resize-none shadow-inner"
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleScan}
            disabled={loading || !text.trim()}
            className="px-8 py-3 bg-trueblue-500 hover:bg-trueblue-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-trueblue-500 flex items-center gap-2 shadow-lg shadow-trueblue-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              'Scan Threat Level'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-truegray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-6 sm:p-8 border-b ${getThreatColors(result.threatLevel).replace('text-', 'border-').split(' ')[2]}`}>
            <div className="flex items-start gap-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-4 ring-gray-900 border ${getThreatColors(result.threatLevel)}`}>
                <ThreatIcon level={result.threatLevel} className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  AI Threat Assessment
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold uppercase tracking-tight ${getThreatColors(result.threatLevel).split(' ')[0]}`}>
                    {result.threatLevel}
                  </span>
                  <span className="px-3 py-1 bg-gray-900 rounded-full text-sm font-mono text-gray-400 border border-gray-700">
                    {result.aiConfidence} Match
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-gray-900/50">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Recommendation</h4>
            <p className="text-lg text-white leading-relaxed">
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
