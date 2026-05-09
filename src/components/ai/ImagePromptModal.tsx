import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { AIErrorNotice } from './AIErrorNotice';
import { aiService } from '@/lib/ai-service';
import { copyToClipboard } from '@/lib/clipboard';
import type { 
  ImagePromptStyle, 
  AIImagePromptResponse,
  ImagePromptEntityType,
  AIContextSnapshot
} from '@/types/ai.types';

interface ImagePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: ImagePromptEntityType;
  entityName: string;
  entityPayload: any;
  storyId: string;
  context: AIContextSnapshot;
  onSaveAsResource?: (prompt: string) => void;
}

const STYLES: { id: ImagePromptStyle; label: string; description: string }[] = [
  { id: 'cinematic', label: 'Cinematic', description: 'Dramatic lighting & film grain' },
  { id: 'anime', label: 'Anime', description: 'Vivid colors & expressive style' },
  { id: 'oil-painting', label: 'Oil Painting', description: 'Classic textured brushwork' },
  { id: 'photorealistic', label: 'Photorealistic', description: 'Sharp studio photography' },
  { id: 'concept-art', label: 'Concept Art', description: 'Epic atmospheric worldbuilding' },
  { id: 'noir', label: 'Noir', description: 'High contrast black & white' },
];

export const ImagePromptModal: React.FC<ImagePromptModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityName,
  entityPayload,
  storyId,
  context,
  onSaveAsResource,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<ImagePromptStyle>('cinematic');
  const [result, setResult] = useState<AIImagePromptResponse | null>(null);
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
      setCopied(false);
      const response = await aiService.generateImagePrompt({
        storyId,
        context,
        entityType,
        entityPayload,
        worldSettings: [],
        style: selectedStyle,
      } as any, abortControllerRef.current.signal);
      setResult(response);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('Image prompt generation aborted');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate prompt');
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

  const handleCopy = async () => {
    if (!result) return;
    const success = await copyToClipboard(result.prompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (!result || !onSaveAsResource) return;
    onSaveAsResource(result.prompt);
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
        Close
      </Button>
      {result && (
        <Button variant="outline" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Prompt'}
        </Button>
      )}
      {onSaveAsResource && result && (
        <Button onClick={handleSave}>
          Save as Note
        </Button>
      )}
      {!result && !loading && (
        <Button onClick={handleGenerate} disabled={loading}>
          Generate Prompt
        </Button>
      )}
      {loading && (
        <Button variant="outline" onClick={handleCancel} className="border-red-500/20 text-red-400">
          Stop
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Visual Prompt Weaver"
      description={`Generate a high-fidelity image prompt for "${entityName}" (${entityType}).`}
      footer={footer}
      maxWidth="3xl"
    >
      <div className="space-y-8">
        {!result && !loading && (
          <div className="space-y-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-editor-text-muted">
              Choose Aesthetic Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left group
                    ${selectedStyle === style.id 
                      ? 'border-primary bg-primary/5 text-white' 
                      : 'border-white/10 bg-white/[0.02] text-editor-text-muted hover:border-white/20 hover:bg-white/5'}`}
                >
                  <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${selectedStyle === style.id ? 'text-primary' : 'group-hover:text-white'}`}>
                    {style.label}
                  </span>
                  <span className="text-[10px] opacity-50 leading-tight">
                    {style.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/70">
                Generated Prompt ({selectedStyle})
              </label>
              <button 
                onClick={() => setResult(null)}
                className="text-[10px] font-mono uppercase tracking-widest text-editor-text-muted hover:text-white transition-colors"
              >
                Change Style
              </button>
            </div>
            <div className="rounded-[24px] border border-primary/20 bg-primary/5 p-6 relative group">
              <textarea
                readOnly
                value={result.prompt}
                className="w-full bg-transparent text-sm leading-7 text-white/90 font-serif resize-none outline-none min-h-[160px]"
              />
            </div>
          </div>
        )}

        {error && <AIErrorNotice message={error} />}
        
        {loading && (
          <div className="space-y-4 py-8 flex flex-col items-center">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary animate-pulse">
              Translating narrative to vision...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
