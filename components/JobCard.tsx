
import React from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive salary';
    if (min && !max) return `£${min.toLocaleString()}+`;
    if (!min && max) return `Up to £${max.toLocaleString()}`;
    return `£${min?.toLocaleString()} - £${max?.toLocaleString()}`;
  };

  const timeSince = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    return "Today";
  };

  return (
    <div 
      className="bg-white border border-slate-100 rounded-[2rem] p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden" 
      onClick={() => onClick(job)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>
      
      <div className="relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                {job.category}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                Remote
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-500">
               <span className="font-bold text-slate-700">{job.company}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500">
              <i className="fas fa-location-dot"></i>
            </div>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-500">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <span className="text-emerald-600 font-bold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
          {job.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto relative">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
          <i className="far fa-clock"></i>
          <span>Posted {timeSince(job.created)}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100">
          <i className="fas fa-chevron-right text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
