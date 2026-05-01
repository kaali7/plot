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
    <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] pt-16">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center pt-8 pb-4 px-6">
        <h1 className="text-2xl font-bold text-white">Your Stories</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(138,0,194,0.4)]"
        >
          Add Story
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 mb-4">
          <div className="bg-red-900/50 border border-red-700/50 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        </div>
      )}

      {/* Stories Grid */}
      <div className="px-6 pb-12">
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              You haven't created any stories yet. Click the "Add Story" button above to start!
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(138,0,194,0.4)]"
            >
              Create Your First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <div 
                key={story.id} 
                onClick={() => navigate(`/story/${story.id}`)}
                className="bg-[#1a001f] rounded-2xl p-6 cursor-pointer hover:bg-[#22002a] transition-colors border border-[#2a003f]/50 hover:border-[#5a007a]/50"
              >
                <h2 className="text-xl font-semibold mb-2 text-white">{story.name}</h2>
                <p className="text-gray-400 text-sm">
                  Updated: {new Date(story.updated_at).toLocaleDateString()}
                </p>
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