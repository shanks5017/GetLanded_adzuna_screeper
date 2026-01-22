
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import JobCard from './components/JobCard';
import JobModal from './components/JobModal';
import { Job } from './types';
import { searchJobs } from './services/adzunaService';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [lastSearch, setLastSearch] = useState({ keyword: '', location: '' });
  const [page, setPage] = useState(1);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [minSalary, setMinSalary] = useState<number>(0);

  const handleSearch = async (keyword: string, location: string, isNewSearch = true) => {
    if (isNewSearch) {
      setIsLoading(true);
      setPage(1);
      setJobs([]);
    } else {
      setIsLoadingMore(true);
    }
    
    setError(null);
    setHasSearched(true);
    setLastSearch({ keyword, location });

    try {
      const currentPage = isNewSearch ? 1 : page + 1;
      const results = await searchJobs(keyword, location, currentPage);
      
      if (isNewSearch) {
        setJobs(results);
      } else {
        setJobs(prev => [...prev, ...results]);
        setPage(currentPage);
      }

      if (results.length === 0 && isNewSearch) {
        setError("We couldn't find any jobs matching that. Try broader keywords.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadTopJobs = () => {
    handleSearch('', 'United Kingdom', true);
  };

  const downloadCSV = () => {
    if (jobs.length === 0) return;
    const headers = ['Title', 'Company', 'Location', 'Salary Min', 'Salary Max', 'Category', 'Date Posted', 'URL'];
    const rows = jobs.map(j => [
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      `"${j.location.replace(/"/g, '""')}"`,
      j.salaryMin || 'N/A',
      j.salaryMax || 'N/A',
      `"${j.category}"`,
      new Date(j.created).toLocaleDateString(),
      j.url
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `getlanded_jobs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = useMemo(() => {
    const cats = new Set(jobs.map(j => j.category));
    return ['All', ...Array.from(cats)].sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesCategory = filterCategory === 'All' || j.category === filterCategory;
      const matchesSalary = !minSalary || (j.salaryMax && j.salaryMax >= minSalary) || (j.salaryMin && j.salaryMin >= minSalary);
      return matchesCategory && matchesSalary;
    });
  }, [jobs, filterCategory, minSalary]);

  useEffect(() => {
    loadTopJobs();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Dynamic Hero */}
      <section className="bg-slate-950 pt-32 pb-44 px-4 relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-violet-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            <span className="text-indigo-300 text-xs font-extrabold uppercase tracking-[0.2em]">New: AI Role Insights Enabled</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
            Land Your Next <br/> 
            <span className="gradient-text">Great Move.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
            Stop searching, start landing. The most intelligent UK job engine <br className="hidden md:block"/> 
            with real-time Gemini AI analysis for every role.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <SearchBar onSearch={(k, l) => handleSearch(k, l, true)} isLoading={isLoading} />

        {/* Global Controls */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button 
            onClick={loadTopJobs}
            className="group bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-10 rounded-[2rem] transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-95"
          >
            <i className="fas fa-fire-flame-curved text-orange-400 group-hover:scale-125 transition-transform"></i>
            Top Jobs This Week
          </button>
          <button 
            onClick={downloadCSV}
            disabled={jobs.length === 0}
            className="bg-white border-2 border-slate-100 text-slate-800 hover:border-indigo-100 hover:bg-indigo-50/30 font-extrabold py-4 px-10 rounded-[2rem] transition-all flex items-center gap-3 disabled:opacity-40 disabled:grayscale"
          >
            <i className="fas fa-file-csv text-emerald-500 text-xl"></i>
            Export Dataset
          </button>
        </div>

        {/* Dynamic Filters */}
        {jobs.length > 0 && (
          <div className="mt-16 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Industry Segment</label>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Minimum Salary Requirement</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-emerald-500 font-bold">
                  £
                </div>
                <input 
                  type="number" 
                  step="5000"
                  placeholder="35,000"
                  value={minSalary || ''}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
                />
              </div>
            </div>
            <button 
              onClick={() => { setFilterCategory('All'); setMinSalary(0); }}
              className="px-6 py-4 text-sm font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="mt-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">
                {isLoading ? 'Fetching Opportunities...' : `Discovering ${filteredJobs.length} roles`}
              </h3>
              <p className="text-slate-500 font-medium">Curated from Adzuna's real-time UK database</p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-8 py-6 rounded-[2rem] flex items-center gap-4 mb-12 shadow-sm">
              <i className="fas fa-circle-exclamation text-2xl"></i>
              <p className="font-bold">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-50 rounded-[2rem] p-8 h-80 animate-pulse">
                  <div className="flex gap-4 mb-6">
                    <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                  </div>
                  <div className="h-8 bg-slate-100 rounded-full w-full mb-4"></div>
                  <div className="h-8 bg-slate-100 rounded-full w-2/3 mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={`${job.id}-${Math.random()}`} 
                    job={job} 
                    onClick={(j) => setSelectedJob(j)}
                  />
                ))}
              </div>

              {jobs.length > 0 && (
                <div className="mt-24 flex flex-col items-center gap-6">
                  <button
                    onClick={() => handleSearch(lastSearch.keyword, lastSearch.location, false)}
                    disabled={isLoadingMore}
                    className="group bg-slate-900 hover:bg-indigo-600 text-white font-extrabold py-5 px-16 rounded-[2.5rem] transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 active:scale-95"
                  >
                    {isLoadingMore ? (
                      <i className="fas fa-spinner animate-spin"></i>
                    ) : (
                      <i className="fas fa-plus"></i>
                    )}
                    {isLoadingMore ? 'Expanding Reach...' : 'Explore More Jobs'}
                  </button>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Page {page} of results</p>
                </div>
              )}
            </>
          )}
          
          {hasSearched && !isLoading && filteredJobs.length === 0 && !error && (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fas fa-binoculars text-4xl text-slate-300"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">No jobs found under these filters</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                Try widening your search or lowering your salary expectations to see more matches.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-950 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-rocket text-white"></i>
            </div>
            <h2 className="text-2xl font-black text-white">GetLanded<span className="text-indigo-500">.uk</span></h2>
          </div>
          <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
            The intelligent UK career companion. Combining the depth of Adzuna with the insight of Gemini AI.
          </p>
          <div className="flex justify-center gap-8 mb-12">
             <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><i className="fab fa-linkedin-in text-xl"></i></a>
             <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><i className="fab fa-twitter text-xl"></i></a>
             <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><i className="fab fa-github text-xl"></i></a>
          </div>
          <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} GETLANDED UK SEARCH
          </p>
        </div>
      </footer>

      <JobModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
      />
    </div>
  );
};

export default App;
