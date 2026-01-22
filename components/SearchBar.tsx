
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string, location: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-5 md:p-6 -mt-12 relative z-10 border border-white max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-[1.5] relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-indigo-500">
            <i className="fas fa-magnifying-glass font-bold"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-4 py-5 bg-slate-50/50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
            placeholder="What job are you looking for?"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-rose-500">
            <i className="fas fa-location-dot"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-4 py-5 bg-slate-50/50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
            placeholder="London, UK..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 px-10 rounded-3xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 min-w-[180px] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
          {isLoading ? 'Searching' : 'Search Now'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
