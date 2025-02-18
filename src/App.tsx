import React, { useState } from 'react';
import Quiz from './components/Quiz';
import { Brain } from 'lucide-react';

function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="transform transition-all hover:scale-105 duration-300">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 rounded-2xl w-24 h-24 mx-auto mb-8 flex items-center justify-center shadow-lg ring-4 ring-white">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Knowledge Challenge
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
            Challenge yourself with our interactive quiz. Test your knowledge across various topics in just minutes.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            <span className="relative z-10">Start Quiz</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <div className="mt-12 text-sm text-gray-500">
            10 Questions • 30 Seconds Each • Instant Results
          </div>
        </div>
      </div>
    );
  }

  return <Quiz />;
}

export default App;