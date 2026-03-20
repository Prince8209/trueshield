import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/**
 * TrueShield App — Root component
 * Routes will be added in Module 11 (Frontend UI)
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🛡️ TrueShield
          </h1>
          <p className="text-center text-gray-400 mt-2">
            AI-Powered Phone Intelligence & Spam Detection
          </p>
          <div className="mt-8 p-6 bg-gray-900 rounded-2xl border border-gray-800 text-center">
            <p className="text-green-400 text-lg">✅ Frontend is running!</p>
            <p className="text-gray-500 mt-2 text-sm">Pages will be added in Module 11</p>
          </div>
        </div>
        <Routes>
          <Route path="/" element={null} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
