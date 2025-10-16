import { useState } from 'react';
import { cn } from '@/lib/utils';

function App() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Hello World
          </h1>
          <p className="text-lg text-gray-600">Welcome to Vite + React + Biome + Tailwind!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <button
            type="button"
            onClick={() => setActiveCard(activeCard === 0 ? null : 0)}
            className={cn(
              'p-6 rounded-xl border-2 transition-all cursor-pointer text-left',
              activeCard === 0
                ? 'bg-blue-100 border-blue-500 scale-105 shadow-lg'
                : 'bg-blue-50 border-blue-200 hover:border-blue-400',
            )}
          >
            <div className="text-3xl mb-2">⚡️</div>
            <h3 className="font-semibold text-blue-900">Vite</h3>
            <p className="text-sm text-blue-700">Lightning fast</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
            className={cn(
              'p-6 rounded-xl border-2 transition-all cursor-pointer text-left',
              activeCard === 1
                ? 'bg-purple-100 border-purple-500 scale-105 shadow-lg'
                : 'bg-purple-50 border-purple-200 hover:border-purple-400',
            )}
          >
            <div className="text-3xl mb-2">⚛️</div>
            <h3 className="font-semibold text-purple-900">React 19</h3>
            <p className="text-sm text-purple-700">Latest features</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
            className={cn(
              'p-6 rounded-xl border-2 transition-all cursor-pointer text-left',
              activeCard === 2
                ? 'bg-indigo-100 border-indigo-500 scale-105 shadow-lg'
                : 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
            )}
          >
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold text-indigo-900">Tailwind</h3>
            <p className="text-sm text-indigo-700">Beautiful UI</p>
          </button>
        </div>

        <div className="flex gap-3 justify-center mt-8">
          <button
            type="button"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
