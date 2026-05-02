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
    <div className="flex flex-col items-start px-8 py-12 border-b border-editor-border">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center space-x-3 text-editor-text-muted hover:text-white transition-all mb-8 group"
      >
        <svg className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Exit to Archive</span>
      </button>

      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-magenta-gradient flex items-center justify-center shadow-magenta-glow-lg rounded-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.4em] font-bold">Plot Studio</span>
      </div>
      
      <h1 className="text-4xl font-serif font-bold text-white leading-tight tracking-tight mb-3 truncate w-full">
        {story.name || 'Untitled Manuscript'}
      </h1>
      
      {story.theme && (
        <div className="flex items-center space-x-4">
          <div className="w-8 h-[1px] bg-editor-magenta/40" />
          <p className="text-editor-text-muted text-[10px] font-mono uppercase tracking-[0.3em] italic">Theme: {story.theme}</p>
        </div>
      )}
    </div>
  );
};