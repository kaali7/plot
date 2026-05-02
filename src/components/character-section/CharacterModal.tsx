import React, { useState } from 'react';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { MotivationForm } from './forms/MotivationForm';
import { TraitsForm } from './forms/TraitsForm';
import { ConflictsForm } from './forms/ConflictsForm';
import { RelationshipsForm } from './forms/RelationshipsForm';
import { ArcForm } from './forms/ArcForm';
import { ResourcesForm } from './forms/ResourcesForm';
import type { Character } from '../../types/story.types';
import { characterSchema } from '../../lib/schemas';

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
    image_url: character?.image_url || '',
    motivation: character?.motivation || { goal: undefined, fear: undefined, desire: undefined },
    traits: character?.traits || { strengths: [], weaknesses: [], personality: [] },
    conflicts: character?.conflicts || { internal: undefined, external: undefined },
    relationships: character?.relationships || [],
    arc: character?.arc || { start: undefined, end: undefined },
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const result = characterSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      
      // Auto-switch to the first tab with an error if helpful
      const firstErrorPath = result.error.issues[0]?.path[0] as string;
      if (firstErrorPath === 'name' || firstErrorPath === 'role' || firstErrorPath === 'description') {
        setActiveTab('basic');
      } else if (firstErrorPath === 'motivation') {
        setActiveTab('motivation');
      } else if (firstErrorPath === 'traits') {
        setActiveTab('traits');
      }
      
      return;
    }

    onSave(formData);
    setErrors({});
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-sm w-full max-w-3xl border border-editor-border shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-editor-border bg-white/[0.01]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              {character ? `Refine Identity` : 'Forge New Identity'}
            </h2>
            <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">
              {character ? `Editing: ${character.name}` : 'Beginning a new character lifecycle'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-editor-text-muted hover:text-white transition-all p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-editor-border bg-white/[0.01] overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 px-6 py-4 transition-all border-b-2
              ${activeTab === tab.id 
                ? 'border-editor-magenta text-white bg-white/[0.02]' 
                : 'border-transparent text-editor-text-muted hover:text-white'}`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
            {activeTab === 'basic' && (
              <BasicInfoForm
                data={formData}
                onUpdate={(data) => setFormData(prev => ({ ...prev, ...data } as Partial<Character>))}
                errors={errors}
              />
            )}
           {activeTab === 'motivation' && (
             <MotivationForm
               data={formData.motivation || { goal: undefined, fear: undefined, desire: undefined }}
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
               data={formData.conflicts || { internal: undefined, external: undefined }}
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
               data={formData.arc || { start: undefined, end: undefined }}
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
        <div className="p-8 border-t border-editor-border bg-white/[0.01] flex justify-between items-center">
          <div>
            <button
              onClick={onDelete}
              disabled={!character}
              className="text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all disabled:opacity-0"
            >
              {character ? 'Deconstruct Identity' : 'Discard Forge'}
            </button>
          </div>
          <div className="flex space-x-6">
            <button
              onClick={onClose}
              className="text-[10px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-magenta px-10 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Commit to Forge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};