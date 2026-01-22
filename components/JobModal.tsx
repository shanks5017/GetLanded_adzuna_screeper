
import React, { useEffect, useState } from 'react';
import { Job } from '../types';
import { analyzeJobWithAI } from '../services/geminiService';

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (job) {
      setAiAnalysis(null);
      setIsAnalyzing(true);
      analyzeJobWithAI(job.title, job.description).then(res => {
        setAiAnalysis(res);
        setIsAnalyzing(false);
      });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [job]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-8 py-8 border-b border-slate-50">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1 leading-tight">{job.title}</h2>
            <div className="flex items-center gap-3">
               <p className="text-indigo-600 font-bold text-lg">{job.company}</p>
               <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
               <p className="text-slate-500 font-medium">{job.location}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900 active:scale-90"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
               <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                  <i className="fas fa-sterling-sign"></i>
               </div>
               <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Estimated Salary</p>
               <p className="text-base font-bold text-slate-900">
                  {job.salaryMax ? `£${job.salaryMax.toLocaleString()}` : 'Competitive'}
               </p>
            </div>
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
               <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                  <i className="fas fa-clock"></i>
               </div>
               <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Job Type</p>
               <p className="text-base font-bold text-slate-900">Full-time</p>
            </div>
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 col-span-2 md:col-span-1">
               <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <i className="fas fa-layer-group"></i>
               </div>
               <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">Category</p>
               <p className="text-base font-bold text-slate-900 truncate">{job.category}</p>
            </div>
          </div>

          {/* Premium AI Section */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <i className="fas fa-sparkles text-yellow-300"></i>
                </div>
                <h3 className="text-xl font-extrabold">Smart Analysis by Gemini</h3>
              </div>
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <p className="text-white/80 font-bold animate-pulse text-sm">Decoding job requirements...</p>
                </div>
              ) : (
                <div className="text-indigo-50 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {aiAnalysis}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
              Full Description
            </h3>
            <div className="text-slate-600 leading-relaxed font-medium">
              {job.description}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-slate-400 font-bold text-xs flex items-center gap-2">
            <i className="fas fa-shield-check text-indigo-400"></i>
            Verified by GetLanded
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
            >
              Close
            </button>
            <a 
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-100 text-center flex items-center justify-center gap-3 active:scale-95"
            >
              Apply via Adzuna <i className="fas fa-external-link-alt text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
