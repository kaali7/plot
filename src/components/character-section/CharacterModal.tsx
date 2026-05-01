import React, { useState } from 'react';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { MotivationForm } from './forms/MotivationForm';
import { TraitsForm } from './forms/TraitsForm';
import { ConflictsForm } from './forms/ConflictsForm';
import { RelationshipsForm } from './forms/RelationshipsForm';
import { ArcForm } from './forms/ArcForm';
import { ResourcesForm } from './forms/ResourcesForm';
import type { Character } from '../../types/story.types';

type TabId = 'basic' | 'motivation' | 'traits' | 'conflicts' | 'relationships' | 'arc' | 'resources';

interface CharacterModalProps {
  character: Character | null;
  onSave: (characterData: Partial<Character>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({ character, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'motivation' | 'traits' | 'conflicts' | 'relationships' | 'arc' | 'resources'>('basic');
  
  // Initialize form data
  const [formData, setFormData] = useState<Partial<Character>>({
    name: character?.name || '',
    role: character?.role || 'supporting',
    description: character?.description || '',
    motivation: character?.motivation || { goal: null, fear: null, desire: null },
    traits: character?.traits || { strengths: [], weaknesses: [], personality: [] },
    conflicts: character?.conflicts || { internal: null, external: null },
    relationships: character?.relationships || [],
    arc: character?.arc || { start: null, end: null },
    resources: character?.resources || []
  });

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  const handleFormUpdate = (section: keyof Character, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

   const tabs: { id: TabId; label: string; icon: string }[] = [
     { id: 'basic', label: 'Basic Info', icon: '👤' },
     { id: 'motivation', label: 'Motivation', icon: '💫' },
     { id: 'traits', label: 'Traits', icon: '⚖️' },
     { id: 'conflicts', label: 'Conflicts', icon: '⚔️' },
     { id: 'relationships', label: 'Relationships', icon: '🔗' },
     { id: 'arc', label: 'Character Arc', icon: '📈' },
     { id: 'resources', label: 'Resources', icon: '📎' }
   ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a001f] rounded-xl w-full max-w-2xl mx-4 p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {character ? `Edit ${character.name}` : 'Add New Character'}
          </h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 pb-2 border-b border-purple-900/30">
           {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 text-center py-2 rounded-t-lg 
            ${activeTab === tab.id 
              ? 'bg-purple-800/50 border-b-2 border-purple-500 text-purple-200' 
              : 'hover:bg-[#1a001f]/50 text-purple-300'}`}
          >
               <span className="mr-1">{tab.icon}</span>
               <span>{tab.label}</span>
             </button>
           ))}
        </div>

        {/* Form Content */}
        <div className="space-y-6">
           {activeTab === 'basic' && (
             <BasicInfoForm
               data={formData}
               onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
             />
           )}
           {activeTab === 'motivation' && (
             <MotivationForm
               data={formData.motivation || { goal: null, fear: null, desire: null }}
               onUpdate={(data) => handleFormUpdate('motivation', data)}
             />
           )}
           {activeTab === 'traits' && (
             <TraitsForm
               data={formData.traits || { strengths: [], weaknesses: [], personality: [] }}
               onUpdate={(data) => handleFormUpdate('traits', data)}
             />
           )}
           {activeTab === 'conflicts' && (
             <ConflictsForm
               data={formData.conflicts || { internal: null, external: null }}
               onUpdate={(data) => handleFormUpdate('conflicts', data)}
             />
           )}
           {activeTab === 'relationships' && (
             <RelationshipsForm
               data={formData.relationships || []}
               onUpdate={(data) => handleFormUpdate('relationships', data)}
             />
           )}
           {activeTab === 'arc' && (
             <ArcForm
               data={formData.arc || { start: null, end: null }}
               onUpdate={(data) => handleFormUpdate('arc', data)}
             />
           )}
           {activeTab === 'resources' && (
             <ResourcesForm
               data={formData}
               onUpdate={(data) => handleFormUpdate('resources', data)}
             />
           )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onDelete}
            disabled={!character}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition-colors"
          >
            {character ? 'Delete Character' : 'Discard'}
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded transition-colors"
          >
            Save Character
          </button>
        </div>
      </div>
    </div>
  );
};