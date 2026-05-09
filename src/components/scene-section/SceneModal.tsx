import React, { useState } from 'react';
import { FiFileText, FiMapPin, FiUsers, FiZap, FiCrosshair, FiFlag, FiMessageSquare, FiPaperclip, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
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
  initialData?: Partial<Scene>;
  characters: any[]; // Character type
  conflicts: any[]; // Conflict type
  onSave: (sceneData: Partial<Scene>) => void;
  onDelete: () => void;
  onClose: () => void;
}

type TabId = 'basic' | 'setting' | 'characters' | 'events' | 'conflicts' | 'script' | 'outcome' | 'resources';

export const SceneModal: React.FC<SceneModalProps> = ({ scene, initialData, characters, conflicts, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  
  const [formData, setFormData] = useState<Partial<Scene>>({
    title: scene?.title || initialData?.title || '',
    type: scene?.type || initialData?.type || 'transition',
    order: scene?.order || initialData?.order || 0,
    pov_character_id: scene?.pov_character_id || initialData?.pov_character_id || undefined,
    goal: scene?.goal || initialData?.goal || '',
    setting: scene?.setting || initialData?.setting || { location: undefined, time: undefined, environment: undefined },
    characters: scene?.characters || initialData?.characters || [],
    events: scene?.events || initialData?.events || { main: undefined, turningPoint: undefined },
    conflicts: scene?.conflicts || initialData?.conflicts || { internal: undefined, external: undefined },
    dialogue: scene?.dialogue || initialData?.dialogue || [],
    background: scene?.background || initialData?.background || '',
    context: scene?.context || initialData?.context || '',
    situation_details: scene?.situation_details || initialData?.situation_details || '',
    outcome: scene?.outcome || initialData?.outcome || '',
    impact: scene?.impact || initialData?.impact || ''
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
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onDelete}
            disabled={!scene}
            title={scene ? 'Deconstruct Scene' : 'Discard Draft'}
            className="flex items-center gap-2 text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all disabled:opacity-0"
          >
            <FiTrash2 size={16} className="md:hidden" />
            <span className="hidden md:block">{scene ? 'Deconstruct Scene' : 'Discard Draft'}</span>
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
              className="btn-primary flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-primary-glow/20"
            >
              <FiCheck size={18} className="md:hidden" />
              <span className="hidden md:block">Commit to Chronicle</span>
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
                ? 'border-primary text-white bg-white/[0.06]' 
                : 'border-transparent text-editor-text-muted hover:text-white hover:bg-white/[0.02]'}`}
            >
              <div className={`${activeTab === tab.id ? 'text-primary scale-110 drop-shadow-[0_0_12px_rgba(255,0,85,0.6)]' : 'text-current opacity-40 group-hover:opacity-100'} transition-all duration-300`}>
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