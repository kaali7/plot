import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const StoryEditor: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  
  const [overview, setOverview] = useState<string>('');
  const [characters, setCharacters] = useState<string>('');
  const [plot, setPlot] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'synopsis' | 'personas' | 'narrative' | 'inspiration'>('synopsis');

  const loadStory = async () => {
    if (!user || !storyId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        navigate('/dashboard');
        return;
      }
      
      setStory(data);
      setOverview(data.overview || '');
      setCharacters(data.characters || '');
      setPlot(data.plot || '');
      setNotes(data.notes || '');
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading story:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveStorySection = async (section: string, content: string) => {
    if (!user || !storyId) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('stories')
        .update({ [section]: content, updated_at: new Date().toISOString() })
        .eq('id', storyId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setStory(prev => ({ ...prev, [section]: content, updated_at: new Date().toISOString() }));
    } catch (err: any) {
      setError(`Failed to save: ${err.message}`);
      console.error('Error saving story:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStory = async () => {
    if (!user || !storyId) return;
    
    if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(`Failed to delete story: ${err.message}`);
      console.error('Error deleting story:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user && storyId) {
      loadStory();
    }
  }, [user, storyId]);

  // Auto-save functionality (debounced)
  useEffect(() => {
    const handleOverviewChange = () => {
      if (overview !== story?.overview) {
        saveStorySection('overview', overview);
      }
    };
    
    const handleCharactersChange = () => {
      if (characters !== story?.characters) {
        saveStorySection('characters', characters);
      }
    };
    
    const handlePlotChange = () => {
      if (plot !== story?.plot) {
        saveStorySection('plot', plot);
      }
    };
    
    const handleNotesChange = () => {
      if (notes !== story?.notes) {
        saveStorySection('notes', notes);
      }
    };
    
    // Debounce saves
    const overviewDebounce = setTimeout(handleOverviewChange, 2000);
    const charactersDebounce = setTimeout(handleCharactersChange, 2000);
    const plotDebounce = setTimeout(handlePlotChange, 2000);
    const notesDebounce = setTimeout(handleNotesChange, 2000);
    
    return () => {
      clearTimeout(overviewDebounce);
      clearTimeout(charactersDebounce);
      clearTimeout(plotDebounce);
      clearTimeout(notesDebounce);
    };
  }, [overview, characters, plot, notes, story, saveStorySection]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <p className="text-gray-400">
            You need to be logged in to access your stories.
          </p>
        </div>
      </div>
    );
  }

   if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Story not found</h2>
          <p className="text-gray-400">
            The story you're looking for doesn't exist or you don't have access to it.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f]">
      {/* Editor Header */}
      <div className="flex justify-between items-center px-6 pt-8 pb-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl hover:bg-purple-700/90 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold text-white">{story.name}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDeleteStory}
            disabled={saving}
            className={`
              bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl 
              ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700/90 transition-colors'}
            `}
          >
            {saving ? 'Saving...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 mb-4">
          <div className="bg-red-900/50 border border-red-700/50 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        </div>
      )}

      {/* Main Editor Layout */}
      <div className="flex min-h-[calc(100vh-140px)] px-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#1a001f] rounded-2xl mr-6">
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('synopsis')}
              className={`
                flex w-full items-center px-3 py-2 rounded-xl text-left 
                ${activeTab === 'synopsis' 
                  ? 'bg-purple-600/20 text-white' 
                  : 'hover:bg-[#22002a]/50 text-gray-300 hover:text-white'}
                transition-colors
              `}
            >
              Synopsis
            </button>
            
            <button 
              onClick={() => setActiveTab('personas')}
              className={`
                flex w-full items-center px-3 py-2 rounded-xl text-left 
                ${activeTab === 'personas' 
                  ? 'bg-purple-600/20 text-white' 
                  : 'hover:bg-[#22002a]/50 text-gray-300 hover:text-white'}
                transition-colors
              `}
            >
              Personas
            </button>
            
            <button 
              onClick={() => setActiveTab('narrative')}
              className={`
                flex w-full items-center px-3 py-2 rounded-xl text-left 
                ${activeTab === 'narrative' 
                  ? 'bg-purple-600/20 text-white' 
                  : 'hover:bg-[#22002a]/50 text-gray-300 hover:text-white'}
                transition-colors
              `}
            >
              Narrative
            </button>
            
            <button 
              onClick={() => setActiveTab('inspiration')}
              className={`
                flex w-full items-center px-3 py-2 rounded-xl text-left 
                ${activeTab === 'inspiration' 
                  ? 'bg-purple-600/20 text-white' 
                  : 'hover:bg-[#22002a]/50 text-gray-300 hover:text-white'}
                transition-colors
              `}
            >
              Inspiration
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <section className="flex-1 bg-[#1a001f] rounded-2xl p-6 overflow-auto">
          <div className="h-full">
            {/* Tab Content */}
            {activeTab === 'synopsis' && (
              <textarea
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Write your story synopsis here..."
                className="w-full h-full p-4 bg-[#22002a] rounded-xl border-0 text-gray-200 focus:outline-none resize-none"
                style={{ minHeight: '100%' }}
              />
            )}
            
            {activeTab === 'personas' && (
              <textarea
                value={characters}
                onChange={(e) => setCharacters(e.target.value)}
                placeholder="Develop your personas..."
                className="w-full h-full p-4 bg-[#22002a] rounded-xl border-0 text-gray-200 focus:outline-none resize-none"
                style={{ minHeight: '100%' }}
              />
            )}
            
            {activeTab === 'narrative' && (
              <textarea
                value={plot}
                onChange={(e) => setPlot(e.target.value)}
                placeholder="Outline your narrative..."
                className="w-full h-full p-4 bg-[#22002a] rounded-xl border-0 text-gray-200 focus:outline-none resize-none"
                style={{ minHeight: '100%' }}
              />
            )}
            
            {activeTab === 'inspiration' && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add inspiration, research, or notes..."
                className="w-full h-full p-4 bg-[#22002a] rounded-xl border-0 text-gray-200 focus:outline-none resize-none"
                style={{ minHeight: '100%' }}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StoryEditor;