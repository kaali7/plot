import React, { useState } from 'react';
import { FiFileText, FiMapPin, FiUsers, FiZap, FiCrosshair, FiFlag } from 'react-icons/fi';
import { SceneBasicInfoForm } from './forms/SceneBasicInfoForm';
import { SceneSettingForm } from './forms/SceneSettingForm';
import { SceneCharactersForm } from './forms/SceneCharactersForm';
import { SceneEventsForm } from './forms/SceneEventsForm';
import { SceneConflictForm } from './forms/SceneConflictForm';
import { SceneOutcomeForm } from './forms/SceneOutcomeForm';
import type { Scene } from '../../types/story.types';
import { sceneSchema } from '../../lib/schemas';

interface SceneModalProps {
  scene: Scene | null;
  characters: any[]; // Character type
  conflicts: any[]; // Conflict type
  onSave: (sceneData: Partial<Scene>) => void;
  onDelete: () => void;
  onClose: () => void;
}

type TabId = 'basic' | 'setting' | 'characters' | 'events' | 'conflicts' | 'outcome';

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
    outcome: scene?.outcome || ''
  });

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

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
      if (['title', 'type', 'goal'].includes(firstErrorPath)) {
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
    { id: 'basic', label: 'Basic Info', icon: <FiFileText size={18} /> },
    { id: 'setting', label: 'Setting', icon: <FiMapPin size={18} /> },
    { id: 'characters', label: 'Characters', icon: <FiUsers size={18} /> },
    { id: 'events', label: 'Events', icon: <FiZap size={18} /> },
    { id: 'conflicts', label: 'Conflicts', icon: <FiCrosshair size={18} /> },
    { id: 'outcome', label: 'Outcome', icon: <FiFlag size={18} /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-sm w-full max-w-4xl border border-editor-border shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-editor-border bg-white/[0.01]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              {scene ? `Refine Chronicle` : 'Draft New Scene'}
            </h2>
            <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">
              {scene ? `Editing: ${scene.title}` : 'Beginning a new narrative event'}
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
            {activeTab === 'outcome' && (
              <SceneOutcomeForm
                data={formData}
                onUpdate={(data) => setFormData(prev => ({ ...prev, ...data } as Partial<Scene>))}
                errors={errors}
              />
            )}
        </div>

        {/* Action Buttons */}
        <div className="p-8 border-t border-editor-border bg-white/[0.01] flex justify-between items-center">
          <div>
            <button
              onClick={onDelete}
              disabled={!scene}
              className="text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all disabled:opacity-0"
            >
              {scene ? 'Deconstruct Scene' : 'Discard Draft'}
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
              Commit to Chronicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};