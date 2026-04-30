import * as React from 'react';
const { useState, useEffect } = React;
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';

interface Character {
  id: string;
  story_id: string;
  name: string;
  role: string;
  goal: string;
  description: string;
  created_at: string;
}

const Characters: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  
  const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id' | 'story_id' | 'created_at'>>({
    name: '',
    role: 'Character',
    goal: '',
    description: ''
  });

  const loadCharacters = async () => {
    if (!user || !storyId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setCharacters(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading characters:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveCharacter = async (character: Omit<Character, 'id' | 'story_id' | 'created_at'>) => {
    if (!user || !storyId) return;
    
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('characters')
        .insert({
          ...character,
          story_id: storyId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setCharacters(prev => [...prev, data]);
      setNewCharacter({ name: '', role: 'Character', goal: '', description: '' });
    } catch (err: any) {
      setError(`Failed to save character: ${err.message}`);
      console.error('Error saving character:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateCharacter = async (character: Character) => {
    if (!user) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('characters')
        .update({
          name: character.name,
          role: character.role,
          goal: character.goal,
          description: character.description
        })
        .eq('id', character.id);
      
      if (error) throw error;
      
      setCharacters(prev => prev.map(c => c.id === character.id ? character : c));
      setEditingCharacter(null);
    } catch (err: any) {
      setError(`Failed to update character: ${err.message}`);
      console.error('Error updating character:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCharacter = async (characterId: string) => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to delete this character?')) {
      return;
    }
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId);
      
      if (error) throw error;
      
      setCharacters(prev => prev.filter(c => c.id !== characterId));
    } catch (err: any) {
      setError(`Failed to delete character: ${err.message}`);
      console.error('Error deleting character:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user && storyId) {
      loadCharacters();
    }
  }, [user, storyId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <p className="text-gray-400">
            You need to be logged in to access your characters.
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
          <p className="mt-4 text-gray-400">Loading characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-8 pb-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(`/story/${storyId}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl hover:bg-purple-700/90 transition-colors"
          >
            ← Back to Story
          </button>
          <h1 className="text-xl font-semibold text-white">Character Management</h1>
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

      {/* Main Content */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Character Form */}
          <Card className="border border-purple-500/20 bg-black/40">
            <h2 className="text-accent text-lg font-semibold mb-4">Add New Character</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Name</label>
                <input
                  type="text"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Character name..."
                  className="w-full bg-[#1a001f] border border-purple-900/30 rounded-xl px-3 py-2 text-gray-200 focus:border-purple-600 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Role</label>
                <select
                  value={newCharacter.role}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#1a001f] border border-purple-900/30 rounded-xl px-3 py-2 text-gray-200 focus:border-purple-600 outline-none transition-colors"
                >
                  <option value="Character">Character</option>
                  <option value="Protagonist">Protagonist</option>
                  <option value="Antagonist">Antagonist</option>
                  <option value="Supporting">Supporting</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Goal/Motivation</label>
                <input
                  type="text"
                  value={newCharacter.goal}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="What drives this character?"
                  className="w-full bg-[#1a001f] border border-purple-900/30 rounded-xl px-3 py-2 text-gray-200 focus:border-purple-600 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Description</label>
                <textarea
                  value={newCharacter.description}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Character background and personality..."
                  className="w-full bg-[#1a001f] border border-purple-900/30 rounded-xl px-3 py-2 text-gray-200 focus:border-purple-600 outline-none resize-none min-h-[100px] transition-colors"
                />
              </div>
              
              <button
                onClick={() => saveCharacter(newCharacter)}
                disabled={saving || !newCharacter.name.trim()}
                className={`w-full bg-purple-600 text-white font-medium py-2 px-4 rounded-xl transition-colors ${
                  saving || !newCharacter.name.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                }`}
              >
                {saving ? 'Saving...' : 'Add Character'}
              </button>
            </div>
          </Card>

          {/* Characters List */}
          <div className="space-y-4">
            <h2 className="text-accent text-lg font-semibold">Characters ({characters.length})</h2>
            
            {characters.length === 0 ? (
              <Card className="border border-purple-500/20 bg-black/40 text-center py-8">
                <p className="text-gray-400">No characters created yet. Add your first character!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {characters.map((character) => (
                  <Card key={character.id} className="border border-purple-500/20 bg-black/40">
                    {editingCharacter?.id === character.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-gray-300 text-sm font-medium block mb-1">Name</label>
                          <input
                            type="text"
                            value={editingCharacter.name}
                            onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="w-full bg-[#1a001f] border border-purple-900/30 rounded-lg px-2 py-1 text-gray-200 focus:border-purple-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-gray-300 text-sm font-medium block mb-1">Role</label>
                          <select
                            value={editingCharacter.role}
                            onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, role: e.target.value } : null)}
                            className="w-full bg-[#1a001f] border border-purple-900/30 rounded-lg px-2 py-1 text-gray-200 focus:border-purple-600 outline-none"
                          >
                            <option value="Character">Character</option>
                            <option value="Protagonist">Protagonist</option>
                            <option value="Antagonist">Antagonist</option>
                            <option value="Supporting">Supporting</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-300 text-sm font-medium block mb-1">Goal</label>
                          <input
                            type="text"
                            value={editingCharacter.goal}
                            onChange={(e) => setEditingCharacter(prev => prev ? { ...prev, goal: e.target.value } : null)}
                            className="w-full bg-[#1a001f] border border-purple-900/30 rounded-lg px-2 py-1 text-gray-200 focus:border-purple-600 outline-none"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateCharacter(editingCharacter)}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-lg text-sm transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCharacter(null)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-1 px-3 rounded-lg text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-white font-medium">{character.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              character.role === 'Protagonist' ? 'bg-green-900/50 text-green-300' :
                              character.role === 'Antagonist' ? 'bg-red-900/50 text-red-300' :
                              'bg-purple-900/50 text-purple-300'
                            }`}>
                              {character.role}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingCharacter(character)}
                              className="text-purple-400 hover:text-purple-300 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCharacter(character.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {character.goal && (
                          <p className="text-gray-400 text-sm mb-2">Goal: {character.goal}</p>
                        )}
                        {character.description && (
                          <p className="text-gray-500 text-sm">{character.description}</p>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Characters;