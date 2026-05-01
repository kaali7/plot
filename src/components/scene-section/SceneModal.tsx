import React, { useState } from 'react';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { SettingForm } from './forms/SettingForm';
import { CharactersForm } from './forms/CharactersForm';
import { EventsForm } from './forms/EventsForm';
import { DialogueForm } from './forms/DialogueForm';
import { ConflictForm } from './forms/ConflictForm';
import { OutcomeForm } from './forms/OutcomeForm';
import type { Scene } from '../../types/story.types';

interface SceneModalProps {
  scene: Scene | null;
  characters: any[]; // Character type
  onSave: (sceneData: Partial<Scene>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const SceneModal: React.FC<SceneModalProps> = ({ scene, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'setting' | 'characters' | 'events' | 'conflicts' | 'dialogue' | 'outcome'>('basic');
  
  // Initialize form data
  const [formData, setFormData] = useState<Partial<Scene>>({
    title: scene?.title || '',
    type: scene?.type || 'transition',
    order: scene?.order || 0,
    pov_character_id: scene?.pov_character_id,
    goal: scene?.goal,
    setting: scene?.setting || { location: undefined, time: undefined, environment: undefined },
    characters: scene?.characters || [],
    events: scene?.events || { main: undefined, turningPoint: undefined },
    conflicts: scene?.conflicts || { internal: undefined, external: undefined },
    dialogue: scene?.dialogue || [],
    background: scene?.background,
    outcome: scene?.outcome
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

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'setting', label: 'Setting', icon: '📍' },
    { id: 'characters', label: 'Characters', icon: '👥' },
    { id: 'events', label: 'Events', icon: '⚡' },
    { id: 'conflicts', label: 'Conflicts', icon: '⚔️' },
    { id: 'dialogue', label: 'Dialogue', icon: '💬' },
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
               onUpdate={(data) => handleFormUpdate('title', data)}
             />
           )}
           {activeTab === 'setting' && (
             <SettingForm
               data={formData.setting || { location: undefined, time: undefined, environment: undefined }}
               onUpdate={(data) => handleFormUpdate('setting', data)}
             />
           )}
           {activeTab === 'characters' && (
             <CharactersForm
               data={formData.characters || []}
               onUpdate={(data) => handleFormUpdate('characters', data)}
             />
           )}
           {activeTab === 'events' && (
             <EventsForm
               data={formData.events || { main: undefined, turningPoint: undefined }}
               onUpdate={(data) => handleFormUpdate('events', data)}
             />
           )}
            {activeTab === 'conflicts' && (
              <ConflictForm
                data={formData.conflicts || { internal: undefined, external: undefined }}
                onUpdate={(data) => handleFormUpdate('conflicts', data)}
              />
            )}
            {activeTab === 'dialogue' && (
              <DialogueForm
                onSubmit={(dialogueEntry) => {
                  handleFormUpdate('dialogue', [...(formData.dialogue || []), dialogueEntry]);
                }}
                onCancel={() => {
                  // Cancel logic here
                }}
                characters={[]}
              />
            )}
            {activeTab === 'outcome' && (
              <OutcomeForm
                data={formData}
                onUpdate={(data) => handleFormUpdate('outcome', data)}
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