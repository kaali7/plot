import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { AIGenerationPreview } from '../ai/AIGenerationPreview';
import { AIErrorNotice } from '../ai/AIErrorNotice';
import { aiService } from '@/lib/ai-service';
import { copyToClipboard } from '@/lib/clipboard';
import { FiCopy, FiCheck } from 'react-icons/fi';
import type { 
  AISceneSeed, 
  AISceneGenerateResponse, 
  AIContextSnapshot 
} from '@/types/ai.types';
import type { Scene, Character } from '@/types/story.types';

interface AISceneGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  context: AIContextSnapshot;
  characters: Character[];
  onSave: (scene: Partial<Scene>) => void;
}

export const AISceneGenerateModal: React.FC<AISceneGenerateModalProps> = ({
  isOpen,
  onClose,
  storyId,
  context,
  characters,
  onSave,
}) => {
  const [seed, setSeed] = useState<AISceneSeed>({
    title: '',
    type: 'introduction',
    povCharacterId: '',
    includeDialogue: true,
  });
  const [result, setResult] = useState<AISceneGenerateResponse | null>(null);
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
      const response = await aiService.generateScene({
        storyId,
        context,
        seed,
      }, abortControllerRef.current.signal);
      setResult(response);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('Scene generation aborted');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate scene');
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
    
    const povChar = characters.find(c => c.id === result.pov_character_id)?.name || 'Narrator';
    const castNames = result.characters.map(c => characters.find(char => char.id === c.characterId)?.name).filter(Boolean).join(', ');

    const prompt = `A ${result.type} scene titled "${result.title}". 
Goal: ${result.goal}
Setting: ${result.setting.location} at ${result.setting.time}. ${result.setting.environment}.
Perspective: ${povChar}
Cast: ${castNames}`;

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
        Save Scene
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Scene Architect"
      description="Sketch a scene beat and let the AI build the narrative framework."
      footer={footer}
      maxWidth="4xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Title Hint
            </label>
            <input
              type="text"
              value={seed.title}
              onChange={(e) => setSeed({ ...seed, title: e.target.value })}
              placeholder="e.g. The Midnight Meeting (optional)"
              className="w-full rounded-[24px] border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-editor-text-muted focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
                Scene Type
              </label>
              <select
                value={seed.type}
                onChange={(e) => setSeed({ ...seed, type: e.target.value })}
                className="w-full rounded-[24px] border border-white/10 bg-[#1a1b1e] px-4 py-3 text-sm text-white outline-none focus:border-primary/40 appearance-none"
              >
                <option value="introduction">Introduction</option>
                <option value="conflict">Conflict</option>
                <option value="climax">Climax</option>
                <option value="resolution">Resolution</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
                POV Character
              </label>
              <select
                value={seed.povCharacterId}
                onChange={(e) => setSeed({ ...seed, povCharacterId: e.target.value })}
                className="w-full rounded-[24px] border border-white/10 bg-[#1a1b1e] px-4 py-3 text-sm text-white outline-none focus:border-primary/40 appearance-none"
              >
                <option value="">Auto-Select</option>
                {characters.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             <input 
               type="checkbox" 
               id="dialogue" 
               checked={seed.includeDialogue} 
               onChange={(e) => setSeed({...seed, includeDialogue: e.target.checked})}
               className="accent-primary h-4 w-4"
             />
             <label htmlFor="dialogue" className="text-xs text-white/70 font-mono uppercase tracking-widest">Include Initial Dialogue</label>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Placement / Context
            </label>
            <textarea
              value={seed.placementHint}
              onChange={(e) => setSeed({ ...seed, placementHint: e.target.value })}
              rows={3}
              placeholder="e.g. Right after the escape from the dungeon, the characters find a safe house..."
              className="w-full rounded-[24px] border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-editor-text-muted focus:border-primary/40"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={loading} className="flex-1 py-4">
              {loading ? 'Building Framework...' : 'Forge Scene'}
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
              emptyLabel="Sketch your scene details to begin."
              isJSON={true}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
