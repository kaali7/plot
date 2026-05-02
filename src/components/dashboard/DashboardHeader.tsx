import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  story?: any; // Kept as optional to avoid breaking UnifiedStoryDashboard if it passes it
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center py-8 w-full border-b border-white/5">
      <button 
        onClick={() => navigate('/')}
        title="Exit to Archive"
        className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-2xl shadow-glass hover:scale-105 transition-all group"
      >
        <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>
    </div>
  );
};