import React from 'react';

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
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-3 block">Name</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => onUpdate({ ...data, name: e.target.value })}
              className={`input-tactile w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Character Identity"
              maxLength={100}
            />
            {errors.name && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-widest">{errors.name}</p>}
          </div>

          <div>
            <label className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-3 block">Role</label>
            <select
              value={data.role || 'supporting'}
              onChange={(e) => onUpdate({ ...data, role: e.target.value as any })}
              className="input-tactile w-full appearance-none cursor-pointer"
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
            <label className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-3 block">Portrait URL</label>
            <input
              type="text"
              value={data.image_url || ''}
              onChange={(e) => onUpdate({ ...data, image_url: e.target.value })}
              className="input-tactile w-full"
              placeholder="https://visual-manifest.jpg"
            />
          </div>
          
          {data.image_url && (
            <div className="w-full h-[120px] rounded-sm overflow-hidden border border-editor-border bg-surface-dark shadow-magenta-glow flex items-center justify-center">
              <img src={data.image_url} alt="Portrait Preview" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-3 block">Identity Brief</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className="input-tactile w-full min-h-[120px] resize-none"
          placeholder="Describe the essence of this identity..."
          maxLength={3000}
        />
        {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-widest">{errors.description}</p>}
      </div>
    </div>
  );
};