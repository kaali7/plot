import { supabase } from './supabase';
import { sanitizeError } from './error-mapper';
import { checkRateLimit } from './rate-limiter';
import { AI_CONFIG } from './ai-config';
import type { 
  AIWritingRequest, AIWritingResponse,
  AICharacterGenerateRequest, AICharacterGenerateResponse,
  AISceneGenerateRequest, AISceneGenerateResponse,
  AIImagePromptRequest, AIImagePromptResponse,
} from '@/types/ai.types';

const ensureAIEnabled = () => {
  if (!AI_CONFIG.enabled) {
    throw new Error('AI features are currently disabled.');
  }
};

export const aiService = {
  async assistWriting(payload: AIWritingRequest, signal?: AbortSignal): Promise<AIWritingResponse> {
    ensureAIEnabled();

    const rateLimit = checkRateLimit(
      `ai-writing:${payload.storyId}`,
      AI_CONFIG.rateLimit.maxAttempts,
      AI_CONFIG.rateLimit.windowMs
    );

    if (!rateLimit.allowed) {
      throw new Error(
        `AI assist is cooling down. Try again in ${Math.ceil(rateLimit.retryAfterMs / 1000)}s.`
      );
    }

    const { data, error } = await supabase.functions.invoke<AIWritingResponse>(
      AI_CONFIG.functions.writing,
      { 
        body: payload,
        signal 
      }
    );

    if (error || !data) {
      if (error?.name === 'AbortError') throw error;
      throw new Error(error?.message || sanitizeError(error));
    }

    return data;
  },

  async generateCharacter(payload: AICharacterGenerateRequest, signal?: AbortSignal): Promise<AICharacterGenerateResponse> {
    ensureAIEnabled();
    const rl = checkRateLimit(`ai-char:${payload.storyId}`, AI_CONFIG.rateLimit.maxAttempts, AI_CONFIG.rateLimit.windowMs);
    if (!rl.allowed) throw new Error(`Rate limited. Retry in ${Math.ceil(rl.retryAfterMs / 1000)}s.`);
    const { data, error } = await supabase.functions.invoke<AICharacterGenerateResponse>(
      AI_CONFIG.functions.character, { body: payload, signal }
    );
    if (error || !data) {
      if (error?.name === 'AbortError') throw error;
      throw new Error(error?.message || 'Character generation failed.');
    }
    return data;
  },

  async generateScene(payload: AISceneGenerateRequest, signal?: AbortSignal): Promise<AISceneGenerateResponse> {
    ensureAIEnabled();
    const rl = checkRateLimit(`ai-scene:${payload.storyId}`, AI_CONFIG.rateLimit.maxAttempts, AI_CONFIG.rateLimit.windowMs);
    if (!rl.allowed) throw new Error(`Rate limited. Retry in ${Math.ceil(rl.retryAfterMs / 1000)}s.`);
    const { data, error } = await supabase.functions.invoke<AISceneGenerateResponse>(
      AI_CONFIG.functions.scene, { body: payload, signal }
    );
    if (error || !data) {
      if (error?.name === 'AbortError') throw error;
      throw new Error(error?.message || 'Scene generation failed.');
    }
    return data;
  },

  async generateImagePrompt(payload: AIImagePromptRequest, signal?: AbortSignal): Promise<AIImagePromptResponse> {
    ensureAIEnabled();
    const rl = checkRateLimit(`ai-img:${payload.storyId}`, AI_CONFIG.rateLimit.maxAttempts, AI_CONFIG.rateLimit.windowMs);
    if (!rl.allowed) throw new Error(`Rate limited. Retry in ${Math.ceil(rl.retryAfterMs / 1000)}s.`);
    const { data, error } = await supabase.functions.invoke<AIImagePromptResponse>(
      AI_CONFIG.functions.imagePrompt, { body: payload, signal }
    );
    if (error || !data) {
      if (error?.name === 'AbortError') throw error;
      throw new Error(error?.message || 'Image prompt generation failed.');
    }
    return data;
  },
};
