import React from 'react';
import { AI_CONFIG } from '../../lib/ai-config';

interface AIActionButtonProps {
  onClick: () => void;
  label: string;
  mobileLabel?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const AIActionButton: React.FC<AIActionButtonProps> = ({
  onClick,
  label,
  mobileLabel,
  className = '',
  disabled = false,
  loading = false,
  variant = 'primary',
  icon
}) => {
  // Respect global AI feature flag
  if (!AI_CONFIG.enabled) return null;

  const baseStyles = "group flex items-center justify-center gap-2 transition-all duration-300 font-mono uppercase tracking-widest text-[10px] shrink-0";
  
  const variants = {
    primary: "px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/20",
    secondary: "px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-primary hover:bg-primary/20",
    outline: "px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-white/40 hover:bg-white/10 hover:text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon || <span className="text-sm">✦</span>
      )}
      
      <span className={mobileLabel ? "hidden sm:inline" : ""}>{label}</span>
      {mobileLabel && <span className="sm:hidden">{mobileLabel}</span>}
    </button>
  );
};
