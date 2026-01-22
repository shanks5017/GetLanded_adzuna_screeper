
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <i className="fas fa-rocket text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              GetLanded<span className="text-indigo-600">.uk</span>
            </h1>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-10">
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Jobs</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Companies</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Career Blog</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-slate-700 font-bold hover:text-indigo-600 px-4 py-2 transition-all">
              Log in
            </button>
            <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
