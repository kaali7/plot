import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { AIGenerationPreview } from '../ai/AIGenerationPreview';
import { AIErrorNotice } from '../ai/AIErrorNotice';
import { copyToClipboard } from '@/lib/clipboard';
import type { AIWritingAction } from '@/types/ai.types';

interface AIWritingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (input: { action: AIWritingAction; instructions: string }) => Promise<void>;
  onCancel?: () => void;
  onAccept: () => void;
  generatedContent: string;
  selectedText: string;
  isLoading: boolean;
  error: string | null;
  isReplaceMode: boolean;
}

const actions: Array<{ value: AIWritingAction; label: string; description: string }> = [
  { value: 'continue', label: 'Continue', description: 'Extend the current manuscript from where it stops.' },
  { value: 'expand', label: 'Expand', description: 'Develop the selected passage with more texture and detail.' },
  { value: 'rewrite', label: 'Rewrite', description: 'Rework the selected passage while keeping the intent.' },
  { value: 'dialogue', label: 'Dialogue', description: 'Draft dialogue beats from the current story context.' },
  { value: 'describe', label: 'Describe', description: 'Generate setting and atmosphere description.' },
];

export const AIWritingPanel: React.FC<AIWritingPanelProps> = ({
  isOpen,
  onClose,
  onGenerate,
  onCancel,
  onAccept,
  generatedContent,
  selectedText,
  isLoading,
  error,
  isReplaceMode,
}) => {
  const [action, setAction] = useState<AIWritingAction>(selectedText.trim() ? 'rewrite' : 'continue');
  const [instructions, setInstructions] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setAction(selectedText.trim() ? 'rewrite' : 'continue');
    setInstructions('');
    setCopied(false);
  }, [isOpen, selectedText]);

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button
        variant="outline"
        onClick={handleCopy}
        disabled={!generatedContent.trim()}
      >
        {copied ? 'Copied!' : 'Copy'}
      </Button>
      <Button onClick={onAccept} disabled={!generatedContent.trim()}>
        {isReplaceMode ? 'Replace Selection' : 'Append to Manuscript'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Assist"
      description="Generate a draft from your current manuscript and story context, then choose how to apply it."
      footer={footer}
      maxWidth="4xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {actions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setAction(item.value)}
                className={`rounded-[24px] border p-4 text-left transition-all ${
                  action === item.value
                    ? 'border-primary/40 bg-primary/10 shadow-primary-glow'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="mb-1 text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs leading-5 text-editor-text-muted">{item.description}</div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Custom instruction
            </label>
            <textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              rows={5}
              placeholder="Optional: keep the tone restrained, emphasize tension, sharpen the dialogue..."
              className="w-full rounded-[24px] border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-editor-text-muted focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Selected text
            </div>
            <div className="max-h-48 overflow-y-auto rounded-[24px] border border-white/10 bg-white/[0.02] p-4 text-sm leading-6 text-white/75">
              {selectedText.trim() || 'No selection detected. AI will use the current manuscript context.'}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => onGenerate({ action, instructions })} 
              disabled={isLoading} 
              className="flex-1"
            >
              {isLoading ? 'Generating...' : 'Generate Draft'}
            </Button>
            {isLoading && onCancel && (
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="px-4 border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {error && <AIErrorNotice message={error} />}
          <AIGenerationPreview
            content={generatedAIContent}
            isLoading={isLoading}
            emptyLabel="Generate a draft to preview it here."
          />
        </div>
      </div>
    </Modal>
  );
};
