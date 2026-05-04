import { z } from 'zod';

// Story Schemas
export const storySchema = z.object({
  name: z.string().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
  theme: z.string().max(200, 'Theme must be under 200 characters').optional().nullable(),
  description: z.string().max(5000, 'Description must be under 5000 characters').optional().nullable(),
});

// Conflict Schemas
export const conflictSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
  type: z.enum(['internal', 'external', 'society']),
  description: z.string().max(3000, 'Description must be under 3000 characters').optional().nullable(),
});

// Character Schemas
export const characterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  role: z.enum(['main', 'sub-main', 'supporting', 'antagonist']),
  description: z.string().max(3000, 'Description must be under 3000 characters').optional().nullable(),
  motivation: z.object({
    goal: z.string().max(1000, 'Goal must be under 1000 characters').optional().nullable(),
    fear: z.string().max(1000, 'Fear must be under 1000 characters').optional().nullable(),
    desire: z.string().max(1000, 'Desire must be under 1000 characters').optional().nullable(),
  }).optional().nullable(),
  traits: z.object({
    strengths: z.array(z.string().max(50)).max(20).optional().nullable(),
    weaknesses: z.array(z.string().max(50)).max(20).optional().nullable(),
    personality: z.array(z.string().max(50)).max(20).optional().nullable(),
  }).optional().nullable(),
});

// World Settings Schemas
export const worldSettingsSchema = z.object({
  timePeriod: z.string().max(200, 'Time period must be under 200 characters').optional().nullable(),
  atmosphere: z.string().max(200, 'Atmosphere must be under 200 characters').optional().nullable(),
  environmentDescription: z.string().max(5000, 'Environment description must be under 5000 characters').optional().nullable(),
  locations: z.array(z.string().max(100)).max(50).optional().nullable(),
  linkedResources: z.array(z.string()).optional().nullable(),
});

// Scene Schemas
export const sceneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
  type: z.enum(['introduction', 'conflict', 'climax', 'resolution', 'transition']),
  goal: z.string().max(2000, 'Goal must be under 2000 characters').optional().nullable(),
  background: z.string().max(5000, 'Background must be under 5000 characters').optional().nullable(),
  outcome: z.string().max(3000, 'Outcome must be under 3000 characters').optional().nullable(),
});

// Resource Schemas
export const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
  type: z.enum(['link', 'note', 'image', 'document', 'other']),
  content: z.string().max(10000, 'Content must be under 10000 characters').optional().nullable(),
  url: z.string().url('Invalid URL format').or(z.literal('')).optional().nullable(),
});
