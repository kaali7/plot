import React, { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  type: 'url' | 'note' | 'image' | 'reference' | 'inspiration';
}

interface Entity {
  id: string;
  name: string; // For display
  type: 'character' | 'scene' | 'conflict' | 'worldSettings';
}

interface ResourceLinkerProps {
  resource: Resource;
  onLink: (entityType: string, entityId: string) => void;
  onUnlink: (entityType: string, entityId: string) => void;
  linkedEntities: {
    characters: string[];
    scenes: string[];
    conflicts: string[];
    worldSettings: string[];
  };
  characters: Entity[];
  scenes: Entity[];
  conflicts: Entity[];
  worldSettings: Entity[]; // For world settings, we might have a different structure
}

export const ResourceLinker: React.FC<ResourceLinkerProps> = ({
  resource,
  onLink,
  onUnlink,
  linkedEntities,
  characters,
  scenes,
  conflicts,
  worldSettings
}) => {
  const [selectedEntity, setSelectedEntity] = useState<{ type: string; id: string } | null>(null);
  const [linking, setLinking] = useState(false);

  const handleLink = async () => {
    if (!selectedEntity) return;
    setLinking(true);
    try {
      await onLink(selectedEntity.type, selectedEntity.id);
      // Optionally, reset selection after linking
      setSelectedEntity(null);
    } catch (err) {
      console.error('Failed to link resource:', err);
    } finally {
      setLinking(false);
    }
  };

  const handleUnlink = (entityType: string, entityId: string) => {
    onUnlink(entityType, entityId);
  };

  // Check if the resource is already linked to an entity
  const isLinked = (entityType: string, entityId: string) => {
    const ids = linkedEntities[entityType as keyof typeof linkedEntities] || [];
    return ids.includes(entityId);
  };

  return (
    <div className="border border-purple-800/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-purple-200">Link Resource</h3>
        <p className="text-sm text-purple-400">
          Link "{resource.title}" to story elements
        </p>
      </div>

      {/* Entity selection */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-1">
            Link to
          </label>
          <select
            value={selectedEntity ? `${selectedEntity.type}:${selectedEntity.id}` : ''}
            onChange={(e) => {
              const [type, id] = e.target.value.split(':');
              if (type && id) {
                setSelectedEntity({ type, id });
              } else {
                setSelectedEntity(null);
              }
            }}
            className="w-full px-3 py-2 bg-[#1a001f] border border-purple-600/30 rounded-lg text-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
          >
            <option value="">Select an entity type</option>
            <optgroup label="Characters">
              {characters.map(char => (
                <option
                  key={char.id}
                  value={`character:${char.id}`}
                  disabled={isLinked('character', char.id)}
                >
                  {char.name} {isLinked('character', char.id) && '(already linked)'}
                </option>
              ))}
            </optgroup>
            <optgroup label="Scenes">
              {scenes.map(scene => (
                <option
                  key={scene.id}
                  value={`scene:${scene.id}`}
                  disabled={isLinked('scene', scene.id)}
                >
                  {scene.title} {isLinked('scene', scene.id) && '(already linked)'}
                </option>
              ))}
            </optgroup>
            <optgroup label="Conflicts">
              {conflicts.map(conflict => (
                <option
                  key={conflict.id}
                  value={`conflict:${conflict.id}`}
                  disabled={isLinked('conflict', conflict.id)}
                >
                  {conflict.title} {isLinked('conflict', conflict.id) && '(already linked)'}
                </option>
              ))}
            </optgroup>
            <optgroup label="World Settings">
              {worldSettings.map(ws => (
                <option
                  key={ws.id}
                  value={`worldSettings:${ws.id}`}
                  disabled={isLinked('worldSettings', ws.id)}
                >
                  World Settings {isLinked('worldSettings', ws.id) && '(already linked)'}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Link button */}
        <div className="flex justify-end">
          <button
            onClick={handleLink}
            disabled={!selectedEntity || linking}
            className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors 
                       ${!selectedEntity || linking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {linking ? 'Linking...' : 'Link Resource'}
          </button>
        </div>
      </div>

      {/* Currently linked entities */}
      <div className="mt-4 pt-3 border-t border-purple-800/10">
        <h4 className="text-sm font-medium text-purple-300 mb-2">Currently Linked To</h4>
        <div className="space-y-2">
          {/* Characters */}
          {linkedEntities.characters.length > 0 && (
            <>
              <p className="font-medium text-purple-200 mb-1">Characters:</p>
              <div className="flex flex-wrap gap-2">
                {linkedEntities.characters.map((charId) => {
                  const char = characters.find(c => c.id === charId);
                  if (!char) return null;
                   return (
                      <span key={charId} className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded">
                        {char.name}
                        <button
                          onClick={() => handleUnlink('character', charId)}
                          className="ml-2 text-purple-400 hover:text-purple-300"
                        >
                          ✕
                        </button>
                      </span>
                  );
                })}
              </div>
            </>
          )}

          {/* Scenes */}
          {linkedEntities.scenes.length > 0 && (
            <>
              <p className="font-medium text-purple-200 mb-1 mt-2">Scenes:</p>
              <div className="flex flex-wrap gap-2">
                {linkedEntities.scenes.map((sceneId) => {
                  const scene = scenes.find(s => s.id === sceneId);
                  if (!scene) return null;
                   return (
                     <span key={sceneId} className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded">
                       {scene.title}
                       <button
                         onClick={() => handleUnlink('scene', sceneId)}
                         className="ml-2 text-purple-400 hover:text-purple-300"
                       >
                         ✕
                       </button>
                     </span>
                   );
                })}
              </div>
            </>
          )}

          {/* Conflicts */}
          {linkedEntities.conflicts.length > 0 && (
            <>
              <p className="font-medium text-purple-200 mb-1 mt-2">Conflicts:</p>
              <div className="flex flex-wrap gap-2">
                {linkedEntities.conflicts.map((conflictId) => {
                  const conflict = conflicts.find(c => c.id === conflictId);
                  if (!conflict) return null;
                   return (
                     <span key={conflictId} className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded">
                       {conflict.title}
                       <button
                         onClick={() => handleUnlink('conflict', conflictId)}
                         className="ml-2 text-purple-400 hover:text-purple-300"
                       >
                         ✕
                       </button>
                     </span>
                   );
                })}
              </div>
            </>
          )}

          {/* World Settings */}
          {linkedEntities.worldSettings.length > 0 && (
            <>
              <p className="font-medium text-purple-200 mb-1 mt-2">World Settings:</p>
              <div className="flex flex-wrap gap-2">
                {linkedEntities.worldSettings.map((wsId) => {
                  const ws = worldSettings.find(w => w.id === wsId);
                  if (!ws) return null;
                   return (
                     <span key={wsId} className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded">
                       World Settings
                       <button
                         onClick={() => handleUnlink('worldSettings', wsId)}
                         className="ml-2 text-purple-400 hover:text-purple-300"
                       >
                         ✕
                       </button>
                     </span>
                   );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};