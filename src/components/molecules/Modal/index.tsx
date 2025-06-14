import { Fragment, useState } from 'react';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XIcon } from 'lucide-react';

import { type ModalProps, type SceneDetails } from './@types';

export function Modal({ isOpen, onClose, scene, onUpdate }: ModalProps) {
  const [editedScene, setEditedScene] = useState<SceneDetails | undefined>(scene);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STEPS: Record<number, string> = {
    1: 'Roteirizado',
    2: 'Em pré-produção',
    3: 'Em gravação',
    4: 'Em pós-produção',
    5: 'Finalizado',
  };

  const nextStep = scene?.step ? scene.step + 1 : 1;
  const availableSteps = Object.entries(STEPS).filter(
    ([step]) => Number(step) === scene?.step || Number(step) === nextStep,
  );

  const handleChange = (field: keyof SceneDetails, value: string | number) => {
    if (!editedScene) return;
    setError(null);

    if (field === 'step') {
      const currentStep = editedScene.step;
      const newStep = Number(value);

      if (newStep !== currentStep && newStep !== currentStep + 1) {
        setError('Só é possível avançar para o próximo status');
        return;
      }
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes/${editedScene.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editedScene,
          updatedAt: new Date().toISOString(),
          version: Math.random(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar a cena');
      }

      onUpdate(editedScene);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar a cena');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all'>
                <div className='flex items-center justify-between mb-4'>
                  <DialogTitle as='h3' className='text-lg font-medium leading-6 text-primary'>
                    Detalhes da Cena
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className='rounded-full p-1 hover:bg-primary/10 transition-colors'
                  >
                    <XIcon className='h-5 w-5 text-primary' />
                  </button>
                </div>

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
                        className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
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
                        {isSaving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
