import React, { useState } from 'react';
import { FiUpload, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

interface ResourceFormProps {
  data: {
    type?: string;
    title?: string;
    content?: string;
    url?: string;
    file_path?: string;
  };
  onUpdate: (data: {
    type?: string;
    title?: string;
    content?: string;
    url?: string;
    file_path?: string;
  }) => void;
  errors?: Record<string, string>;
}

const resourceTypes = [
  { value: 'link', label: 'URL/Link' },
  { value: 'note', label: 'Text Note' },
  { value: 'image', label: 'Image' },
  { value: 'document', label: 'Document/Reference' },
  { value: 'other', label: 'Other' }
];

export const ResourceForm: React.FC<ResourceFormProps> = ({ data, onUpdate, errors = {} }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error } = await api.storage.uploadFile('resources', filePath, file);
      
      if (error) throw new Error(error);

      if (uploadData) {
        const publicUrl = api.storage.getPublicUrl('resources', filePath);
        onUpdate({ 
          ...data, 
          file_path: filePath,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'document'
        });
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Resource Type</label>
          <select
            value={data.type || 'note'}
            onChange={(e) => onUpdate({ ...data, type: e.target.value })}
            className={`w-full select-tactile text-sm ${errors.type ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onUpdate({ ...data, title: e.target.value })}
            className={`w-full input-tactile text-base ${errors.title ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
            placeholder="Asset Designation"
            maxLength={200}
          />
          {errors.title && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.title}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Content/Description</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onUpdate({ ...data, content: e.target.value })}
          className={`w-full input-tactile text-sm min-h-[120px] leading-relaxed ${errors.content ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
          placeholder="Detailed archive description..."
          maxLength={10000}
        />
        {errors.content && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.content}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">URL (Source)</label>
          <input
            type="text"
            value={data.url || ''}
            onChange={(e) => onUpdate({ ...data, url: e.target.value })}
            className={`w-full input-tactile text-sm ${errors.url ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
            placeholder="https://external-resource.com"
          />
          {errors.url && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.url}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Resource Attachment</label>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-dashed transition-all
                ${uploading 
                  ? 'bg-white/[0.02] border-white/10 text-white/20' 
                  : data.file_path 
                    ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                    : 'bg-white/[0.02] border-white/20 text-white/40 hover:border-white/40 hover:text-white'}`}
            >
              {uploading ? (
                <>
                  <FiLoader size={14} className="animate-spin" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Uploading...</span>
                </>
              ) : data.file_path ? (
                <>
                  <FiCheck size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest line-clamp-1">{data.file_path.split('/').pop()}</span>
                </>
              ) : (
                <>
                  <FiUpload size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Upload Archive</span>
                </>
              )}
            </button>
            {data.file_path && (
              <button
                type="button"
                onClick={() => onUpdate({ ...data, file_path: '', url: '' })}
                className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
          {uploadError && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
};