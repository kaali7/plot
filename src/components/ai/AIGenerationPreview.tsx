import React from 'react';

interface AIGenerationPreviewProps {
  content: string;
  isLoading: boolean;
  emptyLabel?: string;
  isJSON?: boolean;
}

export const AIGenerationPreview: React.FC<AIGenerationPreviewProps> = ({
  content,
  isLoading,
  emptyLabel = 'No generated content yet.',
  isJSON = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-[24px] border border-primary/20 bg-primary/5 p-5 md:p-6 h-full min-h-[400px] flex flex-col">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="space-y-3 flex-1">
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-[92%] animate-pulse rounded bg-white/10" />
          <div className="h-3 w-[84%] animate-pulse rounded bg-white/10" />
          <div className="h-3 w-[88%] animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-[95%] animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (!content.trim()) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5 md:p-6 text-sm text-editor-text-muted h-full min-h-[400px]">
        {emptyLabel}
      </div>
    );
  }

  let displayContent = content;
  if (isJSON) {
    try {
      const parsed = JSON.parse(content);
      // Custom formatter for Character/Scene data
      if (parsed.name && parsed.description) {
        displayContent = `Name: ${parsed.name}\nRole: ${parsed.role}\n\nDescription:\n${parsed.description}\n\nMotivation:\n- Goal: ${parsed.motivation?.goal}\n- Fear: ${parsed.motivation?.fear}\n- Desire: ${parsed.motivation?.desire}\n\nTraits:\n- Strengths: ${parsed.traits?.strengths?.join(', ')}\n- Weaknesses: ${parsed.traits?.weaknesses?.join(', ')}\n- Personality: ${parsed.traits?.personality?.join(', ')}`;
      } else if (parsed.title && parsed.goal) {
        displayContent = `Title: ${parsed.title}\nType: ${parsed.type}\n\nGoal: ${parsed.goal}\n\nSetting:\n${parsed.setting?.location}, ${parsed.setting?.time}\n${parsed.setting?.environment}\n\nOutcome:\n${parsed.outcome}`;
      } else {
        displayContent = JSON.stringify(parsed, null, 2);
      }
    } catch (e) {
      displayContent = content;
    }
  }

  return (
    <div className="rounded-[24px] border border-primary/20 bg-primary/5 p-5 md:p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.3em] text-primary/70">
        {isJSON ? 'Forged Specs' : 'Generated Draft'}
      </div>
      <div className="whitespace-pre-wrap text-sm leading-7 text-white/90 font-serif">{displayContent}</div>
    </div>
  );
};
