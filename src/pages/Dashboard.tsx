import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { sanitizeError } from '@/lib/error-mapper';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { StoryModal } from '@/components/dashboard/StoryModal';
import type { Story } from '@/types/story.types';
import { FaTrash } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadStories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setStories(data || []);
    } catch (err: any) {
      setError(sanitizeError(err));
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (storyName: string) => {
    if (!user) return;
    
    if (!storyName.trim()) {
      alert('Please enter a story name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('stories')
        .insert({
          name: storyName,
          user_id: user.id,
          description: '',
          world_settings: {
            locations: [],
            linkedResources: []
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setIsModalOpen(false);
      // Redirect to story editor
      navigate(`/story/${data.id}`);
    } catch (err: any) {
      alert(sanitizeError(err));
      console.error('Error creating story:', err);
    }
  };

  const confirmDeleteStory = async () => {
    if (!storyToDelete || !user) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyToDelete.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setStories(stories.filter(s => s.id !== storyToDelete.id));
      setStoryToDelete(null);
    } catch (err: any) {
      alert(sanitizeError(err));
      console.error('Error deleting story:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStories();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 px-6">
        <div className="pt-8 pb-4">
          <Skeleton className="h-8 w-48 mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
            <Skeleton.Card />
            <Skeleton.Card />
            <Skeleton.Card />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 px-4 md:px-12 relative overflow-hidden">
      {/* Ambient Dashboard Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto flex flex-row md:flex-row justify-between items-center md:items-end pb-6 md:pb-8 border-b border-white/10 mb-8 md:mb-12 relative z-10">
        <div className="flex-1 pr-4">
          <h1 className="text-2xl md:text-5xl font-sans font-bold text-white tracking-tight mb-1 md:mb-3">
            <span className="text-primary font-serif italic pr-1 md:pr-2">Your</span>Manuscripts
          </h1>
          <p className="text-editor-text-muted font-sans text-xs md:text-lg tracking-wide max-w-[200px] md:max-w-none truncate md:whitespace-normal">The creative workspace for your next masterpiece.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-primary hover:bg-accent text-background shadow-primary-glow transition-all duration-300 hover:-translate-y-1 active:scale-95
                     w-12 h-12 md:w-auto md:h-auto md:px-8 md:py-4 rounded-xl md:rounded-full flex-shrink-0"
          title="Initialize New Plot"
        >
          <span className="text-xl md:text-sm md:font-bold">+</span>
          <span className="hidden md:inline ml-2 text-sm font-bold tracking-wide">Initialize New Plot</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-8 relative z-10">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl font-sans text-sm tracking-wide flex items-center">
            <span className="mr-3">⚠️</span> {error}
          </div>
        </div>
      )}

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto pb-24 relative z-10">
        {stories.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-white font-sans text-xl mb-3 font-semibold">
              Your archive is empty.
            </p>
            <p className="text-editor-text-muted font-sans max-w-md mx-auto mb-8">
              Start by creating your first manuscript. Plot will help you outline, build characters, and draft your story.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full transition-all font-sans text-sm font-bold tracking-wide"
            >
              Start Writing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
            {stories.map(story => (
                <div 
                  key={story.id} 
                  onClick={() => navigate(`/story/${story.id}`)}
                  className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 cursor-pointer flex flex-col justify-between min-h-[220px] md:min-h-[240px] transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-primary-glow-lg"
                >
                  {/* Subtle top border glow on hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[2rem]"></div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                      <span className="text-[10px] md:text-xs font-sans font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Story</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] md:text-xs font-mono text-editor-text-muted uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">#{story.id.slice(0, 4)}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setStoryToDelete(story);
                          }}
                          className="p-2 rounded-full bg-white/5 text-editor-text-muted hover:bg-red-500/20 hover:text-red-400 transition-colors border border-white/5"
                          title="Delete Story"
                        >
                          <FaTrash className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-sans font-bold text-white group-hover:text-primary transition-colors mb-3 md:mb-4 tracking-tight leading-tight">{story.name}</h2>
                  {story.description && (
                    <p className="text-editor-text-muted text-sm line-clamp-2 leading-relaxed mb-4">{story.description}</p>
                  )}
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-4">
                  <p className="text-editor-text-muted font-sans text-xs tracking-wider">
                    Last Modified: {new Date(story.updated_at).toLocaleDateString()}
                  </p>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-primary-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <StoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateStory}
      />

      {/* Delete Confirmation Modal */}
      {storyToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-surface-dark border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl transform transition-all relative overflow-hidden">
            {/* Subtle red background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-red-500/10 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 relative z-10">
              <FaTrash className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-2xl font-sans font-bold text-white mb-2 tracking-tight relative z-10">Delete Manuscript?</h3>
            <p className="text-editor-text-muted font-sans text-sm mb-8 leading-relaxed relative z-10">
              Are you sure you want to permanently delete <strong className="text-white">"{storyToDelete.name}"</strong>? This action cannot be undone and all characters, scenes, and settings will be lost forever.
            </p>
            <div className="flex justify-end space-x-4 relative z-10">
              <button 
                onClick={() => setStoryToDelete(null)}
                className="px-6 py-3 rounded-full text-editor-text-muted hover:text-white hover:bg-white/5 border border-transparent font-sans text-sm font-bold tracking-wide transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteStory}
                disabled={isDeleting}
                className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-400 text-white font-sans text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;