/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { type Actor } from '../../../types/actor';
import { STEPS } from '../../../utils/utils';
import { Button } from '../../atoms';
import { BaseModal } from '../../molecules';
import { ActorSelector } from '../../molecules/ActorSelector';
import { type SceneModalProps } from './@types';
import { useSceneForm } from './useSceneForm';

export function SceneModal({ isOpen, onClose, scene, onUpdate, mode = 'edit' }: SceneModalProps) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formData, validate, handleChange } = useSceneForm(scene);

  const fetchActors = async () => {
    try {
      const response = await fetch('http://localhost:3001/actors');
      if (!response.ok) throw new Error('Failed to fetch actors');
      const data = await response.json();
      setActors(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching actors:', error);
    }
  };

  useEffect(() => {
    const loadActors = async () => {
      setIsLoading(true);
      try {
        await fetchActors();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading actors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) loadActors();
  }, [isOpen]);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      toast.success(
        mode === 'create' ? 'Cena criada com sucesso!' : 'Cena atualizada com sucesso!',
      );
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save scene';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = scene?.step ? scene.step + 1 : 1;
  const availableSteps = Object.entries(STEPS).filter(
    ([step]) => Number(step) === scene?.step || Number(step) === nextStep,
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Criar nova cena' : 'Detalhes da cena'}
      aria-labelledby='scene-modal-title'
    >
      {mode === 'create' && (
        <div className='mb-4 p-3 rounded-md bg-yellow-500 text-black text-sm'>
          📢 Aviso: Todas as novas cenas criadas serão iniciadas automaticamente na coluna "
          {STEPS[1]}".
        </div>
      )}

      {error && (
        <div className='mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm'>
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div>
          <h4 className='text-sm font-medium text-primary/70'>Título</h4>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
          />
        </div>

        <div>
          <h4 className='text-sm font-medium text-primary/70'>Descrição</h4>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
            rows={3}
          />
        </div>

        <div>
          <h4 className='text-sm font-medium text-primary/70'>Episódio</h4>
          <input
            type='text'
            value={formData.episode}
            onChange={(e) => handleChange('episode', e.target.value)}
            className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
          />
        </div>

        <div>
          <h4 className='text-sm font-medium text-primary/70'>Status</h4>
          <select
            value={formData.step}
            onChange={(e) => handleChange('step', Number(e.target.value))}
            disabled={mode === 'create'}
            className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {availableSteps.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className='text-sm font-medium text-primary/70'>Data de Gravação</h4>
          <input
            type='date'
            value={formData.recordDate}
            onChange={(e) => handleChange('recordDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
          />
        </div>

        <div>
          <h4 className='text-sm font-medium text-primary/70'>Local de Gravação</h4>
          <input
            type='text'
            value={formData.recordLocation}
            onChange={(e) => handleChange('recordLocation', e.target.value)}
            className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
          />
        </div>

        <div>
          <label className='text-sm font-medium text-primary/70'>Atores</label>
          {isLoading ? (
            <div>Carregando Atores...</div>
          ) : (
            <ActorSelector
              actors={actors}
              selectedActors={formData.actors}
              onSelect={(actors) => handleChange('actors', actors)}
            />
          )}
        </div>

        <div className='flex justify-end gap-2 mt-6'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors'
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={isSubmitting}
            className='h-9 px-4 md:px-6'
          >
            {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
