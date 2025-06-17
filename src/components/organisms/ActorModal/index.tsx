import { BaseModal } from '../../molecules';
import { type ActorModalProps } from './@types';
import { useActorForm } from './useActorForm';

export function ActorModal({ isOpen, onClose, onSave, mode = 'create', actor }: ActorModalProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useActorForm(actor);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(onSave);
    if (success) onClose();
  };

  const modalTitle = mode === 'create' ? 'Adicionar novos Atores' : 'Editar Atore';
  const submitButtonText = isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      aria-labelledby='actor-modal-title'
    >
      <form onSubmit={handleFormSubmit} className='space-y-4'>
        <div>
          <label htmlFor='actor-name' className='block text-sm font-medium mb-1'>
            Nome
          </label>
          <input
            id='actor-name'
            type='text'
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className='w-full p-2 border rounded'
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id='name-error' className='mt-1 text-sm text-destructive'>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='actor-bio' className='block text-sm font-medium mb-1'>
            Biografia
          </label>
          <textarea
            rows={3}
            id='actor-bio'
            value={formData.bio}
            aria-invalid={!!errors.bio}
            className='w-full p-2 border rounded'
            onChange={(e) => handleChange('bio', e.target.value)}
            aria-describedby={errors.bio ? 'bio-error' : undefined}
          />
          {errors.bio && (
            <p id='bio-error' className='mt-1 text-sm text-destructive'>
              {errors.bio}
            </p>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors'
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
