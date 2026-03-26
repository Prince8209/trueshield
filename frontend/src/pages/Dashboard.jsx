import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldAlert, ShieldCheck, Search, MessageSquareCode } from 'lucide-react';
import PhoneScanner from '../components/PhoneScanner';
import AIScanner from '../components/AIScanner';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('phone');

  return (
    <div className="min-h-screen bg-truegray-900 text-gray-100 font-sans selection:bg-trueblue-500/30">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-truegray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-trueblue-500/10 flex items-center justify-center rounded-xl text-trueblue-500 ring-1 ring-trueblue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                TrueShield
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-white">{user?.phone}</span>
                <span className="text-xs text-gray-500">Verified Member</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Threat Intelligence Hub
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Instantly decode phone numbers to real-world identities, or computationally scan SMS text messages for phishing attacks using our AI engine.
          </p>
        </header>

        {/* Tab Switcher */}
        <div className="flex p-1 space-x-1 bg-truegray-800 rounded-xl mb-10 max-w-sm mx-auto ring-1 ring-gray-700/50 shadow-xl">
          <button
            onClick={() => setActiveTab('phone')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'phone'
                ? 'bg-truegray-700 text-white shadow ring-1 ring-gray-600'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Search className="w-4 h-4" />
            Caller ID
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'ai'
                ? 'bg-truegray-700 text-white shadow ring-1 ring-gray-600'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            AI Scanner
          </button>
        </div>

        {/* Dynamic Tool View */}
        <div className="auto-rows-max transition-all duration-300 ease-in-out">
          {activeTab === 'phone' ? <PhoneScanner /> : <AIScanner />}
        </div>
      </main>
    </div>
  );
}
