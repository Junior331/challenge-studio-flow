/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { type Actor } from '../../../types/actor';
import { cn } from '../../../utils/cn';
import { STEPS } from '../../../utils/utils';
import { type ModalProps, type SceneDetails } from './@types';
import { BaseModal } from './BaseModal';

export function SceneModal({
  isOpen,
  onClose,
  scene,
  scenes,
  onUpdate,
  mode = 'edit',
}: ModalProps) {
  const [editedScene, setEditedScene] = useState<SceneDetails | undefined>(scene);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenActors, setIsOpenActors] = useState(false);

  useEffect(() => {
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

    fetchActors();
  }, []);

  useEffect(() => {
    if (mode === 'create') {
      setEditedScene({
        id: (scenes?.length ?? 0 + 1).toString(),
        title: '',
        description: '',
        step: 1,
        episode: '',
        recordDate: new Date().toISOString().split('T')[0],
        recordLocation: '',
        columnId: 'column-1',
        order: scenes?.length ?? 0,
        actors: [],
      });
      setSelectedActors([]);
    } else {
      setEditedScene(scene);
      setSelectedActors(scene?.actors || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, mode]);

  const nextStep = scene?.step ? scene.step + 1 : 1;
  const availableSteps = Object.entries(STEPS).filter(
    ([step]) => Number(step) === scene?.step || Number(step) === nextStep,
  );

  const handleChange = (field: keyof SceneDetails, value: string | number | string[]) => {
    if (!editedScene) return;
    setError(null);

    if (field === 'step' && mode === 'edit') {
      const currentStep = editedScene.step;
      const newStep = Number(value);

      if (newStep !== currentStep && newStep !== currentStep + 1) {
        setError('Só é possível avançar para o próximo status');
        return;
      }
    }

    if (field === 'actors') {
      setSelectedActors(value as string[]);
    }

    setEditedScene({ ...editedScene, [field]: value });
  };

  const validateScene = (scene: SceneDetails): string | null => {
    const date = new Date(scene.recordDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date.toString() === 'Invalid Date') {
      return 'Data inválida';
    }

    if (date < today) {
      return 'A data de gravação não pode ser anterior à data atual';
    }

    if (!scene.title.trim()) {
      return 'O título é obrigatório';
    }

    if (!scene.episode.trim()) {
      return 'O episódio é obrigatório';
    }

    return null;
  };

  const handleSave = async () => {
    if (!editedScene || !onUpdate) return;
    setError(null);

    const validationError = validateScene(editedScene);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      const updatedScene = {
        ...editedScene,
        actors: selectedActors,
      };
      await onUpdate(updatedScene);
      toast.success(
        mode === 'create' ? 'Cena criada com sucesso!' : 'Cena atualizada com sucesso!',
      );
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar a cena';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredActors = actors.filter(
    (actor) =>
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.bio.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedActorsData = actors.filter((actor) => selectedActors.includes(actor.id));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Criar Nova Cena' : 'Detalhes da Cena'}
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

      {editedScene ? (
        <div className='space-y-4'>
          <div>
            <h4 className='text-sm font-medium text-primary/70'>Título</h4>
            <input
              type='text'
              value={editedScene.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
            />
          </div>

          <div>
            <h4 className='text-sm font-medium text-primary/70'>Descrição</h4>
            <textarea
              value={editedScene.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
              rows={3}
            />
          </div>

          <div>
            <h4 className='text-sm font-medium text-primary/70'>Episódio</h4>
            <input
              type='text'
              value={editedScene.episode}
              onChange={(e) => handleChange('episode', e.target.value)}
              className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
            />
          </div>

          <div>
            <h4 className='text-sm font-medium text-primary/70'>Status</h4>
            <select
              value={editedScene.step}
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
              value={editedScene.recordDate}
              onChange={(e) => handleChange('recordDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
            />
          </div>

          <div>
            <h4 className='text-sm font-medium text-primary/70'>Local de Gravação</h4>
            <input
              type='text'
              value={editedScene.recordLocation}
              onChange={(e) => handleChange('recordLocation', e.target.value)}
              className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
            />
          </div>

          <div>
            <h4 className='text-sm font-medium text-primary/70'>Atores</h4>
            <div className='relative mt-1'>
              <div className='flex flex-wrap gap-2 p-2 border rounded-md bg-background'>
                {selectedActorsData.map((actor) => (
                  <div
                    key={actor.id}
                    className='flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm'
                  >
                    <span>{actor.name}</span>
                    <button
                      type='button'
                      onClick={() => {
                        const newSelected = selectedActors.filter((id) => id !== actor.id);
                        handleChange('actors', newSelected);
                      }}
                      className='hover:text-destructive'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() => setIsOpenActors(!isOpenActors)}
                  className='flex items-center gap-2 px-2 py-1 text-sm text-primary/70 hover:text-primary'
                >
                  <span>Adicionar ator</span>
                  <ChevronsUpDown className='h-4 w-4' />
                </button>
              </div>

              {isOpenActors && (
                <div className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg'>
                  <div className='p-2 border-b'>
                    <input
                      type='text'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder='Buscar atores...'
                      className='w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50'
                    />
                  </div>
                  <div className='max-h-48 overflow-y-auto'>
                    {filteredActors.map((actor) => (
                      <button
                        key={actor.id}
                        type='button'
                        onClick={() => {
                          const newSelected = selectedActors.includes(actor.id)
                            ? selectedActors.filter((id) => id !== actor.id)
                            : [...selectedActors, actor.id];
                          handleChange('actors', newSelected);
                        }}
                        className={cn(
                          'flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-primary/10',
                          selectedActors.includes(actor.id) && 'bg-primary/5',
                        )}
                      >
                        <Check
                          className={cn(
                            'h-4 w-4',
                            selectedActors.includes(actor.id) ? 'text-primary' : 'text-transparent',
                          )}
                        />
                        <div className='flex flex-col items-start'>
                          <span>{actor.name}</span>
                          <span className='text-xs text-primary/50'>{actor.bio}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-2 mt-6'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors'
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !!error}
              className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSaving ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
            </button>
          </div>
        </div>
      ) : null}
    </BaseModal>
  );
}
