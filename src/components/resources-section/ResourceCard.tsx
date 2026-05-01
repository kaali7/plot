import React from 'react';
import type { Resource } from '../../types/story.types';

interface ResourceCardProps {
  resource: Resource;
  typeColor: string;
  onClick: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, typeColor, onClick }) => {


  return (
    <div 
      className={`p-4 rounded-lg border ${typeColor} cursor-pointer hover:border-purple-700/40 transition-colors`}
      onClick={() => onClick(resource)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white">{resource.title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`${typeColor.replace('border-', '').replace('text-', '')} text-xs px-2 py-0.5 rounded`}>
              {resource.type}
            </span>
          </div>
        </div>
        <div className="text-right text-xs">
          <span className="text-purple-400">#{resource.id.substring(0, 8)}...</span>
        </div>
      </div>

      {resource.content && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">Content</h4>
          <p className="text-gray-300 text-sm line-clamp-2">{resource.content}</p>
        </div>
      )}

      {resource.url && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">URL</h4>
          <a 
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-300 hover:text-purple-200 break-all text-sm"
          >
            {resource.url}
          </a>
        </div>
      )}

      {resource.file_path && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">File</h4>
          <p className="text-gray-300 text-sm truncate">{resource.file_path}</p>
        </div>
      )}

      {/* Linked Entities Summary */}
      <div className="mt-4">
        <h4 className="text-purple-300 font-medium mb-2">Linked To</h4>
        <div className="flex flex-wrap gap-2">
          {resource.linked_entities.characters.length > 0 && (
            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded">
              {resource.linked_entities.characters.length} Characters
            </span>
          )}
          {resource.linked_entities.scenes.length > 0 && (
            <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded">
              {resource.linked_entities.scenes.length} Scenes
            </span>
          )}
          {resource.linked_entities.conflicts.length > 0 && (
            <span className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded">
              {resource.linked_entities.conflicts.length} Conflicts
            </span>
          )}
          {resource.linked_entities.worldSettings.length > 0 && (
            <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded">
              World Settings
            </span>
          )}
        </div>
      </div>
    </div>
  );
};