/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';
import toast from 'react-hot-toast';

import { type Actor, type ActorFormData } from '../../../types/actor';
import { BaseModal } from './BaseModal';

interface ActorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (actor: ActorFormData) => Promise<void>;
  mode?: 'create' | 'edit';
  actor?: Actor;
}

export function ActorModal({ isOpen, onClose, onSave, mode = 'create', actor }: ActorModalProps) {
  const [formData, setFormData] = useState<ActorFormData>({
    name: actor?.name || '',
    bio: actor?.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('O nome é obrigatório');
      return;
    }

    setIsSaving(true);

    try {
      await onSave(formData);
      toast.success(
        mode === 'create' ? 'Ator criado com sucesso!' : 'Ator atualizado com sucesso!',
      );
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar o ator';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Adicionar Novo Ator' : 'Editar Ator'}
    >
      {error && (
        <div className='mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Nome</label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Biografia</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className='w-full p-2 border rounded'
            rows={3}
            required
          />
        </div>

        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={isSaving}
            className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSaving ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
