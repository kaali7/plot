import { supabase } from './supabase';

/**
 * Helper to retrieve the current authenticated user's ID from the Supabase session.
 * Throws an error if the user is not authenticated.
 */
export const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error('Authentication error:', error);
    throw new Error('Not authenticated');
  }
  
  return user.id;
};
