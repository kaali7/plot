import React from 'react';

interface AIErrorNoticeProps {
  message: string;
}

export const AIErrorNotice: React.FC<AIErrorNoticeProps> = ({ message }) => {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  );
};
