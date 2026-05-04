/**
 * Utility to map Supabase/Postgres error codes to user-friendly messages.
 * Prevents leaking database schema details to the UI.
 */

const ERROR_MAP: Record<string, string> = {
  '23505': 'This item already exists.', // Unique violation
  '23503': 'A related item was not found.', // Foreign key violation
  '42501': 'You do not have permission to perform this action.', // RLS violation
  'PGRST301': 'The requested item was not found.', // Row not found
  'PGRST116': 'The requested story was not found or you do not have access.', // .single() row not found
  '23502': 'A required field is missing.', // Not null violation
};

export const sanitizeError = (error: any): string => {
  if (!error) return 'An unexpected error occurred.';
  
  // Handle Supabase error objects
  const code = error.code || (typeof error === 'object' ? error.message?.match(/code: "(.+?)"/)?.[1] : null);
  
  if (code && ERROR_MAP[code]) {
    return ERROR_MAP[code];
  }

  // Fallback to a generic message if we don't recognize the code
  // In a production app, you might want to log the original error to a service here
  return 'Something went wrong. Please try again.';
};
