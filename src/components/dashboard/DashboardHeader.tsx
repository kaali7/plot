import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  story: {
    id: string;
    name: string;
    theme?: string;
    description?: string;
    world_settings: {
      locations: string[];
      timePeriod?: string;
      atmosphere?: string;
      environmentDescription?: string;
      linkedResources: string[];
    };
  };
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ story }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start px-8 py-10 border-b border-purple-900/10">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-purple-400/60 hover:text-purple-300 transition-colors mb-6 group"
      >
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
      </button>

      <div className="flex items-center space-x-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-900/40">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">Plot Studio</span>
      </div>
      
      <h1 className="text-2xl font-black text-white leading-tight tracking-tight mb-1 truncate w-full">
        {story.name || 'Untitled Story'}
      </h1>
      
      {story.theme && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          <p className="text-purple-400/60 text-[10px] font-bold uppercase tracking-widest">{story.theme}</p>
        </div>
      )}
    </div>
  );
};