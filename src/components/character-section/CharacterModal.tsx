import React, { useState } from 'react';
import { FiUser, FiTarget, FiZap, FiTrendingUp, FiLink, FiBox, FiLayers, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { MotivationForm } from './forms/MotivationForm';
import { TraitsForm } from './forms/TraitsForm';
import { ConflictsForm } from './forms/ConflictsForm';
import { RelationshipsForm } from './forms/RelationshipsForm';
import { ArcForm } from './forms/ArcForm';
import { ResourcesForm } from './forms/ResourcesForm';
import type { Character } from '../../types/story.types';
import { characterSchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';

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
     { id: 'basic', label: 'Identity', icon: <FiUser size={18} /> },
     { id: 'motivation', label: 'Drive', icon: <FiTarget size={18} /> },
     { id: 'traits', label: 'Traits', icon: <FiLayers size={18} /> },
     { id: 'conflicts', label: 'Conflict', icon: <FiZap size={18} /> },
     { id: 'relationships', label: 'Bonds', icon: <FiLink size={18} /> },
     { id: 'arc', label: 'Arc', icon: <FiTrendingUp size={18} /> },
     { id: 'resources', label: 'Inventory', icon: <FiBox size={18} /> }
   ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={character ? `Refine Identity` : 'Forge New Identity'}
      description={character ? `Editing: ${character.name}` : 'Beginning a new character lifecycle'}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onDelete}
            disabled={!character}
            title={character ? 'Deconstruct Identity' : 'Discard Forge'}
            className="flex items-center gap-2 text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all disabled:opacity-0"
          >
            <FiTrash2 size={16} className="md:hidden" />
            <span className="hidden md:block">{character ? 'Deconstruct Identity' : 'Discard Forge'}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              title="Cancel"
              className="flex items-center gap-2 text-[10px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all px-4"
            >
              <FiX size={18} className="md:hidden" />
              <span className="hidden md:block">Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-magenta flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-magenta-glow/20"
            >
              <FiCheck size={18} className="md:hidden" />
              <span className="hidden md:block">Commit to Forge</span>
              <span className="md:hidden">Commit</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col relative">
        {/* Sticky Tabs - Refined for Mobile Visibility */}
        <div className="sticky -top-5 md:-top-8 z-30 flex border-b border-white/10 bg-[#0a0a0f] backdrop-blur-2xl overflow-x-hidden whitespace-nowrap -mx-5 md:-mx-8 -mt-5 md:-mt-8 mb-6 md:mb-8 shadow-xl shadow-black/40">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center md:min-w-[110px] px-0 md:px-6 py-2.5 md:py-5 transition-all border-b-2 gap-0.5 group
              ${activeTab === tab.id 
                ? 'border-editor-magenta text-white bg-white/[0.06]' 
                : 'border-transparent text-editor-text-muted hover:text-white hover:bg-white/[0.02]'}`}
            >
              <div className={`${activeTab === tab.id ? 'text-editor-magenta scale-110 drop-shadow-[0_0_12px_rgba(255,0,85,0.6)]' : 'text-current opacity-40 group-hover:opacity-100'} transition-all duration-300`}>
                {React.cloneElement(tab.icon as React.ReactElement, { size: 18 })}
              </div>
              <span className={`hidden md:block text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.25em] transition-colors ${activeTab === tab.id ? 'text-white' : 'text-editor-text-muted/60'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="space-y-6 md:space-y-10 pb-8">
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
               characterId={character?.id}
               linkedResourceIds={formData.resources || []}
             />
           )}
        </div>
      </div>
    </Modal>
  );
};