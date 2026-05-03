import React, { useState } from 'react';
import { FiUser, FiTarget, FiZap, FiTrendingUp, FiLink, FiBox, FiLayers } from 'react-icons/fi';
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
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  
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

  const handleTabChange = (tab: TabId) => {
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
      
      const firstErrorPath = result.error.issues[0]?.path[0] as string;
      if (['name', 'role', 'description'].includes(firstErrorPath)) {
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

   const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
     { id: 'basic', label: 'Basic Info', icon: <FiUser size={18} /> },
     { id: 'motivation', label: 'Motivation', icon: <FiTarget size={18} /> },
     { id: 'traits', label: 'Traits', icon: <FiLayers size={18} /> },
     { id: 'conflicts', label: 'Conflicts', icon: <FiZap size={18} /> },
     { id: 'relationships', label: 'Relationships', icon: <FiLink size={18} /> },
     { id: 'arc', label: 'Character Arc', icon: <FiTrendingUp size={18} /> },
     { id: 'resources', label: 'Resources', icon: <FiBox size={18} /> }
   ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-sm w-full max-w-4xl border border-editor-border shadow-2xl flex flex-col max-h-[90vh]">
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
        <div className="flex px-4 border-b border-editor-border bg-white/[0.01] overflow-x-auto whitespace-nowrap scrollbar-hide md:justify-center touch-pan-x">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 flex flex-col items-center px-6 py-4 transition-all border-b-2 gap-2 group
              ${activeTab === tab.id 
                ? 'border-editor-magenta text-white bg-white/[0.02]' 
                : 'border-transparent text-editor-text-muted hover:text-white'}`}
            >
              <div className={`${activeTab === tab.id ? 'text-editor-magenta drop-shadow-[0_0_8px_rgba(255,0,85,0.5)]' : 'text-current opacity-40 group-hover:opacity-100'} transition-all`}>
                {tab.icon}
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]">{tab.label}</span>
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
              className="btn-magenta px-10 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-lg shadow-magenta-glow/20"
            >
              Commit to Forge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};