import React from 'react';

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
}

const resourceTypes = [
  { value: 'url', label: 'URL/Link' },
  { value: 'note', label: 'Text Note' },
  { value: 'image', label: 'Image' },
  { value: 'reference', label: 'Reference Material' },
  { value: 'inspiration', label: 'Inspiration' }
];

export const ResourceForm: React.FC<ResourceFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Resource Type</label>
        <select
          value={data.type || 'note'}
          onChange={(e) => onUpdate({ ...data, type: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
        >
          {resourceTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          placeholder="Enter resource title"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Content/Description</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onUpdate({ ...data, content: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="Describe the resource"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">URL (if applicable)</label>
        <input
          type="text"
          value={data.url || ''}
          onChange={(e) => onUpdate({ ...data, url: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          placeholder="Enter URL if this is a link resource"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">File Path (if applicable)</label>
        <input
          type="text"
          value={data.file_path || ''}
          onChange={(e) => onUpdate({ ...data, file_path: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          placeholder="Enter file path if this is a file resource"
        />
      </div>
    </div>
  );
};