import React, { useState, useRef } from 'react';
import { FiUpload, FiLoader, FiCheck, FiX, FiUser } from 'react-icons/fi';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

interface BasicInfoFormProps {
  data: {
    name?: string;
    role?: string;
    description?: string;
    image_url?: string;
  };
  onUpdate: (data: {
    name?: string;
    role?: string;
    description?: string;
    image_url?: string;
  }) => void;
  errors?: Record<string, string>;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onUpdate, errors = {} }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `portrait-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error } = await api.storage.uploadFile('resources', filePath, file);
      
      if (error) throw new Error(error);

      if (uploadData) {
        const publicUrl = api.storage.getPublicUrl('resources', filePath);
        onUpdate({ 
          ...data, 
          image_url: publicUrl
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
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] font-bold mb-2 block">Name</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => onUpdate({ ...data, name: e.target.value })}
              className={`input-tactile w-full text-base ${errors.name ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
              placeholder="Identity Designation"
              maxLength={100}
            />
            {errors.name && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-widest">{errors.name}</p>}
          </div>

          <div>
            <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] font-bold mb-2 block">Role</label>
            <select
              value={data.role || 'supporting'}
              onChange={(e) => onUpdate({ ...data, role: e.target.value as any })}
              className="select-tactile w-full text-sm"
            >
              <option value="main">Main Identity</option>
              <option value="sub-main">Sub-Main Identity</option>
              <option value="supporting">Supporting Identity</option>
              <option value="antagonist">Antagonistic Force</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] font-bold mb-2 block">Portrait Manifest</label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`flex-1 h-10 flex items-center justify-center space-x-2 px-4 rounded-lg border border-dashed transition-all
                  ${uploading 
                    ? 'bg-white/[0.02] border-white/10 text-white/20' 
                    : data.image_url 
                      ? 'bg-editor-magenta/5 border-editor-magenta/20 text-editor-magenta' 
                      : 'bg-white/[0.02] border-white/20 text-white/40 hover:border-white/40 hover:text-white'}`}
              >
                {uploading ? (
                  <>
                    <FiLoader size={14} className="animate-spin" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Uploading...</span>
                  </>
                ) : data.image_url ? (
                  <>
                    <FiCheck size={14} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Portrait Acquired</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={14} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Upload Portrait</span>
                  </>
                )}
              </button>
              {data.image_url && (
                <button
                  type="button"
                  onClick={() => onUpdate({ ...data, image_url: '' })}
                  className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
            {uploadError && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{uploadError}</p>}
          </div>
          
          <div className="relative group">
            {data.image_url ? (
              <div className="w-full aspect-square md:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-surface-dark shadow-2xl relative">
                <img src={data.image_url} alt="Portrait Preview" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-white/40">Visual Specimen</span>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-square md:aspect-video rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center space-y-3 opacity-40 group-hover:opacity-60 transition-opacity">
                <FiUser size={32} className="text-white/20" />
                <span className="text-[8px] font-mono uppercase tracking-[0.3em]">No Visual Manifest</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] font-bold mb-2 block">Identity Brief</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className="input-tactile w-full min-h-[100px] text-sm resize-none leading-relaxed"
          placeholder="Describe the essence of this identity..."
          maxLength={3000}
        />
        {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-widest">{errors.description}</p>}
      </div>
    </div>
  );
};