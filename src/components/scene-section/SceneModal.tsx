import React, { useState } from 'react';
import { FiFileText, FiMapPin, FiUsers, FiZap, FiCrosshair, FiFlag, FiMessageSquare, FiPaperclip } from 'react-icons/fi';
import { SceneBasicInfoForm } from './forms/SceneBasicInfoForm';
import { SceneSettingForm } from './forms/SceneSettingForm';
import { SceneCharactersForm } from './forms/SceneCharactersForm';
import { SceneEventsForm } from './forms/SceneEventsForm';
import { SceneConflictForm } from './forms/SceneConflictForm';
import { SceneOutcomeForm } from './forms/SceneOutcomeForm';
import { SceneScriptForm } from './forms/SceneScriptForm';
import { SceneResourcesForm } from './forms/SceneResourcesForm';
import type { Scene } from '../../types/story.types';
import { sceneSchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';

interface SceneModalProps {
  scene: Scene | null;
  characters: any[]; // Character type
  conflicts: any[]; // Conflict type
  onSave: (sceneData: Partial<Scene>) => void;
  onDelete: () => void;
  onClose: () => void;
}

type TabId = 'basic' | 'setting' | 'characters' | 'events' | 'conflicts' | 'script' | 'outcome' | 'resources';

export const SceneModal: React.FC<SceneModalProps> = ({ scene, characters, conflicts, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  
  const [formData, setFormData] = useState<Partial<Scene>>({
    title: scene?.title || '',
    type: scene?.type || 'transition',
    order: scene?.order || 0,
    pov_character_id: scene?.pov_character_id || undefined,
    goal: scene?.goal || '',
    setting: scene?.setting || { location: undefined, time: undefined, environment: undefined },
    characters: scene?.characters || [],
    events: scene?.events || { main: undefined, turningPoint: undefined },
    conflicts: scene?.conflicts || { internal: undefined, external: undefined },
    dialogue: scene?.dialogue || [],
    background: scene?.background || '',
    context: scene?.context || '',
    situation_details: scene?.situation_details || '',
    outcome: scene?.outcome || '',
    impact: scene?.impact || ''
  });

  const handleFormUpdate = (section: keyof Scene, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const result = sceneSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      
      const firstErrorPath = result.error.issues[0]?.path[0] as string;
      if (['title', 'type', 'goal', 'context', 'situation_details'].includes(firstErrorPath)) {
        setActiveTab('basic');
      } else if (firstErrorPath === 'background') {
        setActiveTab('basic');
      } else if (firstErrorPath === 'outcome') {
        setActiveTab('outcome');
      }
      
      return;
    }

    onSave(formData);
    setErrors({});
    onClose();
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'Basic', icon: <FiFileText size={18} /> },
    { id: 'setting', label: 'Setting', icon: <FiMapPin size={18} /> },
    { id: 'characters', label: 'Cast', icon: <FiUsers size={18} /> },
    { id: 'events', label: 'Events', icon: <FiZap size={18} /> },
    { id: 'conflicts', label: 'Conflict', icon: <FiCrosshair size={18} /> },
    { id: 'script', label: 'Script', icon: <FiMessageSquare size={18} /> },
    { id: 'outcome', label: 'Outcome', icon: <FiFlag size={18} /> },
    { id: 'resources', label: 'Resources', icon: <FiPaperclip size={18} /> }
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={scene ? `Refine Chronicle` : 'Draft New Scene'}
      description={scene ? `Editing: ${scene.title}` : 'Beginning a new narrative event'}
      maxWidth="4xl"
      footer={
        <>
          <button
            onClick={onDelete}
            disabled={!scene}
            className="text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all disabled:opacity-0 mr-auto"
          >
            {scene ? 'Deconstruct Scene' : 'Discard Draft'}
          </button>
          <button
            onClick={onClose}
            className="text-[10px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all px-4"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-magenta px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-magenta-glow/20"
          >
            Commit to Chronicle
          </button>
        </>
      }
    >
      <div className="flex flex-col h-full -mx-5 md:-mx-8 -mt-5 md:-mt-8">
        {/* Sticky Tabs */}
        <div className="sticky top-0 z-10 flex border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-md overflow-x-auto whitespace-nowrap scrollbar-hide touch-pan-x no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none flex flex-col items-center justify-center min-w-[64px] md:min-w-[100px] px-2 md:px-6 py-3 md:py-4 transition-all border-b-2 gap-1 group
              ${activeTab === tab.id 
                ? 'border-editor-magenta text-white bg-white/[0.04]' 
                : 'border-transparent text-editor-text-muted hover:text-white hover:bg-white/[0.01]'}`}
            >
              <div className={`${activeTab === tab.id ? 'text-editor-magenta scale-110 drop-shadow-[0_0_8px_rgba(255,0,85,0.5)]' : 'text-current opacity-40 group-hover:opacity-100'} transition-all duration-300`}>
                {React.cloneElement(tab.icon as React.ReactElement, { size: 20 })}
              </div>
              <span className="text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-[0.2em]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-5 md:p-8 space-y-6 md:space-y-8">
           {activeTab === 'basic' && (
             <SceneBasicInfoForm
               data={formData}
               characters={characters}
               onUpdate={(data) => setFormData(prev => ({ ...prev, ...data } as Partial<Scene>))}
               errors={errors}
             />
           )}
           {activeTab === 'setting' && (
             <SceneSettingForm
               data={formData.setting || { location: undefined, time: undefined, environment: undefined }}
               onUpdate={(data) => handleFormUpdate('setting', data)}
             />
           )}
           {activeTab === 'characters' && (
             <SceneCharactersForm
               data={formData.characters || []}
               characters={characters}
               onUpdate={(data) => handleFormUpdate('characters', data)}
             />
           )}
           {activeTab === 'events' && (
             <SceneEventsForm
               data={formData.events || { main: undefined, turningPoint: undefined }}
               onUpdate={(data) => handleFormUpdate('events', data)}
             />
           )}
            {activeTab === 'conflicts' && (
              <SceneConflictForm
                data={formData.conflicts || { internal: undefined, external: undefined }}
                conflicts={conflicts}
                onUpdate={(data) => handleFormUpdate('conflicts', data)}
              />
            )}
            {activeTab === 'script' && (
              <SceneScriptForm
                data={formData.dialogue || []}
                characters={characters}
                onUpdate={(data) => handleFormUpdate('dialogue', data)}
              />
            )}
            {activeTab === 'outcome' && (
              <SceneOutcomeForm
                data={formData}
                onUpdate={(data) => setFormData(prev => ({ ...prev, ...data } as Partial<Scene>))}
                errors={errors}
              />
            )}
            {activeTab === 'resources' && (
              <SceneResourcesForm
                sceneId={scene?.id}
              />
            )}
        </div>
      </div>
    </Modal>
  );
};