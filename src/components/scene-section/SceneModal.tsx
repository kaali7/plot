import React, { useState } from 'react';
import { SceneBasicInfoForm } from './forms/SceneBasicInfoForm';
import { SceneSettingForm } from './forms/SceneSettingForm';
import { SceneCharactersForm } from './forms/SceneCharactersForm';
import { SceneEventsForm } from './forms/SceneEventsForm';
import { SceneConflictForm } from './forms/SceneConflictForm';
import { SceneOutcomeForm } from './forms/SceneOutcomeForm';
import type { Scene } from '../../types/story.types';

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
    pov_character_id: scene?.pov_character_id || null,
    goal: scene?.goal || '',
    setting: scene?.setting || { location: null, time: null, environment: null },
    characters: scene?.characters || [],
    events: scene?.events || { main: null, turningPoint: null },
    conflicts: scene?.conflicts || { internal: null, external: null },
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

  const handleSave = () => {
    onSave(formData);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a001f] rounded-xl w-full max-w-2xl mx-4 p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {scene ? `Edit Scene: ${scene.title}` : 'Add New Scene'}
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
        <div className="flex space-x-2 mb-6 pb-2 border-b border-purple-900/30 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-t-lg transition-all
              ${activeTab === tab.id 
                ? 'bg-purple-800/50 border-b-2 border-purple-500 text-purple-200' 
                : 'hover:bg-purple-900/20 text-purple-400 hover:text-purple-300'}`}
            >
              <span className="mr-1">{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
           {activeTab === 'basic' && (
             <SceneBasicInfoForm
               data={formData}
               characters={characters}
               onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
             />
           )}
           {activeTab === 'setting' && (
             <SceneSettingForm
               data={formData.setting || { location: null, time: null, environment: null }}
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
               data={formData.events || { main: null, turningPoint: null }}
               onUpdate={(data) => handleFormUpdate('events', data)}
             />
           )}
            {activeTab === 'conflicts' && (
              <SceneConflictForm
                data={formData.conflicts || { internal: null, external: null }}
                conflicts={conflicts}
                onUpdate={(data) => handleFormUpdate('conflicts', data)}
              />
            )}
            {activeTab === 'outcome' && (
              <SceneOutcomeForm
                data={formData}
                onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
              />
            )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onDelete}
            disabled={!scene}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition-colors"
          >
            {scene ? 'Delete Scene' : 'Discard'}
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded transition-colors"
          >
            Save Scene
          </button>
        </div>
      </div>
    </div>
  );
};