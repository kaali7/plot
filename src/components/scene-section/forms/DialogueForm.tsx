import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface DialogueEntry {
  characterId: string;
  content: string;
  order: number;
}

interface DialogueFormProps {
  onSubmit: (data: DialogueEntry) => void;
  onCancel: () => void;
  initialData?: DialogueEntry;
  characters: { id: string; name: string }[];
}

const dialogueSchema = z.object({
  characterId: z.string({ 
    message: 'Character is required' 
  }),
  content: z.string().min(1, { message: 'Dialogue content is required' }),
  order: z.number().int().nonnegative({ message: 'Order must be a non-negative integer' })
});

export const DialogueForm: React.FC<DialogueFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  characters
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DialogueEntry>({
    resolver: zodResolver(dialogueSchema),
    defaultValues: initialData || {
      characterId: '',
      content: '',
      order: 0
    }
  });

  const onSubmitHandler = (data: DialogueEntry) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-1">
          Character
        </label>
        <select
          {...register('characterId')}
          className="w-full px-3 py-2 bg-[#1a001f] border border-purple-600/30 rounded-lg text-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
        >
          <option value="">Select a character</option>
          {characters.map(char => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>
        {errors.characterId && (
          <p className="mt-1 text-xs text-red-400">{errors.characterId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-300 mb-1">
          Dialogue Content
        </label>
        <textarea
          {...register('content')}
          rows={3}
          className="w-full px-3 py-2 bg-[#1a001f] border border-purple-600/30 rounded-lg text-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-400">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-300 mb-1">
          Order
        </label>
        <input
          type="number"
          {...register('order')}
          min="0"
          className="w-full px-3 py-2 bg-[#1a001f] border border-purple-600/30 rounded-lg text-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
        />
        {errors.order && (
          <p className="mt-1 text-xs text-red-400">{errors.order.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-purple-800/50 hover:bg-purple-800 text-purple-300 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Save Dialogue
        </button>
      </div>
    </form>
  );
};