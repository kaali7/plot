import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { AIGenerationPreview } from '../ai/AIGenerationPreview';
import { AIErrorNotice } from '../ai/AIErrorNotice';
import { aiService } from '@/lib/ai-service';
import { copyToClipboard } from '@/lib/clipboard';
import { FiCopy, FiCheck } from 'react-icons/fi';
import type { 
  AICharacterSeed, 
  AICharacterGenerateResponse, 
  AIContextSnapshot 
} from '@/types/ai.types';
import type { Character } from '@/types/story.types';

interface AICharacterGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  context: AIContextSnapshot;
  onSave: (character: Partial<Character>) => void;
}

export const AICharacterGenerateModal: React.FC<AICharacterGenerateModalProps> = ({
  isOpen,
  onClose,
  storyId,
  context,
  onSave,
}) => {
  const [seed, setSeed] = useState<AICharacterSeed>({
    name: '',
    role: 'main',
    concept: '',
  });
  const [result, setResult] = useState<AICharacterGenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    try {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      const response = await aiService.generateCharacter({
        storyId,
        context,
        seed,
      }, abortControllerRef.current.signal);
      setResult(response);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('Character generation aborted');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate character');
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!result) return;
    
    // Format the character as a descriptive prompt
    const prompt = `A ${result.role} character named ${result.name}. 
Description: ${result.description}
Traits: ${result.traits.personality.join(', ')}. 
Strengths: ${result.traits.strengths.join(', ')}.`;

    const success = await copyToClipboard(prompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSave(result as any);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      {result && (
        <>
          <Button variant="outline" onClick={handleCopyPrompt} className="flex items-center gap-2">
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            {copied ? 'Copied' : 'Copy Prompt'}
          </Button>
          <Button variant="outline" onClick={handleGenerate} disabled={loading}>
            Regenerate
          </Button>
        </>
      )}
      <Button onClick={handleSave} disabled={!result || loading}>
        Save Character
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Character Forge"
      description="Define a spark of identity and let the AI forge a complete character persona."
      footer={footer}
      maxWidth="4xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Name Hint
            </label>
            <input
              type="text"
              value={seed.name}
              onChange={(e) => setSeed({ ...seed, name: e.target.value })}
              placeholder="e.g. Elias Thorne (optional)"
              className="w-full rounded-[24px] border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-editor-text-muted focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Role
            </label>
            <select
              value={seed.role}
              onChange={(e) => setSeed({ ...seed, role: e.target.value })}
              className="w-full rounded-[24px] border border-white/10 bg-[#1a1b1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/40 appearance-none"
            >
              <option value="main">Main Character</option>
              <option value="antagonist">Antagonist</option>
              <option value="sub-main">Sub-Main</option>
              <option value="supporting">Supporting</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Concept / Spark
            </label>
            <textarea
              value={seed.concept}
              onChange={(e) => setSeed({ ...seed, concept: e.target.value })}
              rows={4}
              placeholder="A disillusioned detective with a secret collection of rare clocks..."
              className="w-full rounded-[24px] border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-editor-text-muted focus:border-primary/40"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={loading} className="flex-1 py-4">
              {loading ? 'Forging Persona...' : 'Forge Character'}
            </Button>
            {loading && (
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="px-4 border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                Stop
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {error && <AIErrorNotice message={error} />}
          <div className="relative h-full min-h-[400px]">
            <AIGenerationPreview
              content={result ? JSON.stringify(result, null, 2) : ''}
              isLoading={loading}
              emptyLabel="Define your character spark to begin."
              isJSON={true}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
