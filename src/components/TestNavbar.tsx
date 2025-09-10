import React from 'react';

const TestNavbar = () => {
  return (
    <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            CircuitLearn
          </div>
          <div className="flex space-x-6">
            <a href="/" className="text-white/80 hover:text-white transition-colors">Home</a>
            <a href="/materials" className="text-white/80 hover:text-white transition-colors">Materi</a>
            <a href="/practicum" className="text-white/80 hover:text-white transition-colors">Praktikum</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TestNavbar;
