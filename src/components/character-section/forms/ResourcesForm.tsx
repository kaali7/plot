import React, { useState } from 'react';
import type { Character } from '../../../types/story.types';

interface ResourcesFormProps {
  data: Partial<Character>;
  onUpdate: (data: Partial<Character>) => void;
}

export const ResourcesForm: React.FC<ResourcesFormProps> = ({ data, onUpdate }) => {
  const [resources, setResources] = useState<string[]>((data as Character).resources || []);

  const handleResourcesChange = (newResources: string[]) => {
    setResources(newResources);
    onUpdate({ ...data, resources: newResources });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Character Resources</h3>
        <p className="text-purple-300 mb-6">
          Attach reference materials, images, notes, and inspiration sources to this character.
        </p>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800/30">
        <h4 className="font-medium text-purple-200 mb-2">Resource Types</h4>
        <ul className="text-purple-300 text-sm space-y-1">
          <li className="flex items-center">
            <span className="mr-2">🔗</span>
            <span>URLs: External references and research links</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">📝</span>
            <span>Notes: Character-specific observations and ideas</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">🖼️</span>
            <span>Images: Visual inspiration and reference images</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">📚</span>
            <span>References: Books, articles, and source materials</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">✨</span>
            <span>Inspiration: Creative prompts and mood boards</span>
          </li>
        </ul>
      </div>
      
      <div className="text-center text-purple-400">
        <p>Resource linking functionality will be implemented soon</p>
      </div>
    </div>
  );
};