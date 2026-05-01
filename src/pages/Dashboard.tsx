import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { StoryModal } from '@/components/dashboard/StoryModal';
import type { Story } from '@/types/story.types';

const Dashboard: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      setError(err.message);
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
      alert(`Failed to create story: ${err.message}`);
      console.error('Error creating story:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadStories();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] pt-16 px-6">
        <div className="pt-8 pb-4">
          <Skeleton className="h-8 w-48 mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton.Card />
            <Skeleton.Card />
            <Skeleton.Card />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 px-6 md:px-12">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-end pb-8 border-b border-editor-border mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight mb-2">Manuscripts</h1>
          <p className="text-editor-text-muted font-mono text-sm uppercase tracking-widest italic">Your Creative Workspace</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-magenta px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-sm"
        >
          Begin New Plot
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-sm font-mono text-xs uppercase tracking-wider">
            {error}
          </div>
        </div>
      )}

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto pb-24">
        {stories.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-editor-border rounded-sm">
            <p className="text-editor-text-muted font-serif text-xl mb-8">
              No manuscripts found in your archives.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-editor-magenta hover:text-white transition-all font-mono text-sm uppercase tracking-widest border-b border-editor-magenta hover:border-white pb-1"
            >
              Initialize First Entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map(story => (
              <div 
                key={story.id} 
                onClick={() => navigate(`/story/${story.id}`)}
                className="card-tactile group p-8 cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-tighter border border-editor-magenta/30 px-2 py-0.5">Story</span>
                    <span className="text-[10px] font-mono text-editor-text-muted uppercase tracking-tighter italic">Entry #{story.id.slice(0, 4)}</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-editor-text group-hover:text-white transition-colors mb-4">{story.name}</h2>
                  {story.description && (
                    <p className="text-editor-text-muted text-sm line-clamp-2 italic mb-4">"{story.description}"</p>
                  )}
                </div>
                <div className="pt-4 border-t border-editor-border flex justify-between items-center">
                  <p className="text-editor-text-muted font-mono text-[10px] uppercase tracking-widest">
                    Last Modified: {new Date(story.updated_at).toLocaleDateString()}
                  </p>
                  <div className="w-2 h-2 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
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
    </div>
  );
};

export default Dashboard;