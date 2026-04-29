import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const [stories, setStories] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
          overview: '',
          characters: '',
          plot: '',
          notes: ''
        })
        .select()
        .single();
      
      if (error) throw error;
      
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your stories...</p>
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
          onClick={() => {
            // Simple prompt for story name - in a real app this would be a modal
            const storyName = prompt('Enter story name:');
            if (storyName !== null) {
              handleCreateStory(storyName);
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
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
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 border-4 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              You haven't created any stories yet. Click the "Add Story" button above to start!
            </p>
            <button 
              onClick={() => {
                const storyName = prompt('Enter story name:');
                if (storyName !== null) {
                  handleCreateStory(storyName);
                }
              }}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
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
    </div>
  );
};

export default Dashboard;