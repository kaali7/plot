import React, { useState } from 'react';
import { ResourceManager } from './ResourceManager';
import { ResourceModal } from './ResourceModal';
import { ResourceDetailView } from './ResourceDetailView';
import type { Resource } from '../../types/story.types';

interface ResourcesSectionProps {
  resources: Resource[];
  onResourceAdd: (resourceData: Partial<Resource>) => void;
  onResourceUpdate: (id: string, updates: Partial<Resource>) => void;
  onResourceDelete: (id: string) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ 
  resources, 
  onResourceAdd, 
  onResourceUpdate, 
  onResourceDelete 
}) => {
  const [viewingResourceId, setViewingResourceId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const selectedResource = resources.find(r => r.id === viewingResourceId) || null;

  const handleResourceClick = (resource: Resource) => {
    setViewingResourceId(resource.id);
  };

  const handleCloseDetail = () => {
    setViewingResourceId(null);
  };

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setShowAddModal(false);
  };

  const handleSaveResource = (resourceData: Partial<Resource>) => {
    if (viewingResourceId) {
      onResourceUpdate(viewingResourceId, resourceData);
    } else {
      onResourceAdd(resourceData);
    }
    handleCloseModal();
  };

  const handleDeleteResource = () => {
    if (viewingResourceId) {
      onResourceDelete(viewingResourceId);
      setViewingResourceId(null);
      handleCloseModal();
    }
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Sidebar Navigation - Resource List */}
      <div className={`relative h-full flex flex-col border-r border-white/5 bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden z-20
        ${viewingResourceId ? 'w-24' : 'w-full p-8'}`}>
        
        {/* Full Header - Only shown when no selection */}
        {!viewingResourceId && (
          <div className="flex items-end justify-between pb-8 mb-12 border-b border-editor-border animate-in fade-in slide-in-from-top duration-700">
            <div>
              <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Narrative Library</h2>
              <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-2 italic">Repository of Knowledge & Inspiration ({resources.length})</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-magenta px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Archive Resource
            </button>
          </div>
        )}

        {/* Close Selection Button (Only in Narrow View) */}
        {viewingResourceId && (
          <button 
            onClick={handleCloseDetail}
            className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-editor-magenta hover:text-white transition-all duration-300 z-30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}

        {/* Navigation Area */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ${viewingResourceId ? 'pt-20' : ''}`}>
          {viewingResourceId ? (
            <div className={`flex flex-col transition-all duration-700 space-y-1`}>
              {resources.map(res => (
                <div 
                  key={res.id} 
                  onClick={() => handleResourceClick(res)}
                  className={`group relative h-20 w-full flex items-center transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
                    ${viewingResourceId === res.id 
                      ? 'bg-white text-black z-20 rounded-l-full translate-x-1' 
                      : 'text-white/20 hover:text-white/60'}`}
                >
                  <div className={`flex items-center space-x-6 transition-all duration-[800ms] justify-center w-full`}>
                    <span className={`text-sm font-mono font-bold tracking-tighter w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 flex-shrink-0 border
                      ${viewingResourceId === res.id 
                        ? 'bg-black text-white border-black shadow-2xl scale-110' 
                        : 'bg-white/[0.02] border-white/5 group-hover:border-white/20 group-hover:bg-white/10'}`}>
                      {res.title.charAt(0)}
                    </span>
                  </div>

                  {/* Liquid Curve Elements */}
                  {viewingResourceId === res.id && (
                    <>
                      <div className="absolute -top-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_24px_0_0_#fff] transition-all duration-[800ms]" />
                      <div className="absolute -bottom-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_-24px_0_0_#fff] transition-all duration-[800ms]" />
                    </>
                  )}
                </div>
              ))}

              {/* Persistent Add Button */}
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center text-white/20 hover:border-editor-magenta hover:text-white transition-all duration-300 mt-4 mx-auto"
                title="Archive New Resource"
              >
                +
              </button>
            </div>
          ) : (
            <ResourceManager 
              resources={resources}
              onResourceClick={handleResourceClick}
            />
          )}
        </div>
      </div>

      {/* Detail Panel Area */}
      <div className={`flex-1 h-full bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
        ${viewingResourceId ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedResource && (
          <ResourceDetailView 
            resource={selectedResource}
            onEdit={handleOpenEdit}
            onClose={handleCloseDetail}
            isIntegrated={true}
          />
        )}
      </div>

      {/* Modals */}
      {(isEditing || showAddModal) && (
        <ResourceModal
          resource={isEditing ? selectedResource : null}
          onSave={handleSaveResource}
          onDelete={handleDeleteResource}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};