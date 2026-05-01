import React, { useState } from 'react';
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

export const SceneModal: React.FC<SceneModalProps> = ({ scene, characters, conflicts, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'setting' | 'characters' | 'events' | 'conflicts' | 'outcome'>('basic');
  
  // Initialize form data
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

  const handleTabChange = (tab: typeof activeTab) => {
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
      
      // Auto-switch to the first tab with an error
      const firstErrorPath = result.error.issues[0]?.path[0] as string;
      if (firstErrorPath === 'title' || firstErrorPath === 'type' || firstErrorPath === 'goal') {
        setActiveTab('basic');
      } else if (firstErrorPath === 'background') {
        setActiveTab('basic'); // Background is in basic info form currently
      } else if (firstErrorPath === 'outcome') {
        setActiveTab('outcome');
      }
      
      return;
    }

    onSave(formData);
    setErrors({});
    onClose();
  };

  const tabs: { id: typeof activeTab; label: string; icon: string }[] = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'setting', label: 'Setting', icon: '📍' },
    { id: 'characters', label: 'Characters', icon: '👥' },
    { id: 'events', label: 'Events', icon: '⚡' },
    { id: 'conflicts', label: 'Conflicts', icon: '⚔️' },
    { id: 'outcome', label: 'Outcome', icon: '🏁' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-sm w-full max-w-3xl border border-editor-border shadow-2xl flex flex-col max-h-[90vh]">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
              className="btn-magenta px-10 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Commit to Chronicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};