import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

interface DashboardHeaderProps {
  story?: any; // Kept as optional to avoid breaking UnifiedStoryDashboard if it passes it
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center py-8 w-full border-b border-white/5">
      <button 
        onClick={() => navigate('/dashboard')}
        title="Exit to Archive"
        className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-2xl shadow-glass hover:scale-105 transition-all group"
      >
        <FiArrowLeft className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
      </button>
    </div>
  );
};