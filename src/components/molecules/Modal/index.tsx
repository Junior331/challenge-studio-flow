import { Fragment, useState } from 'react';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

import { type ModalProps, type SceneDetails } from './@types';

export function Modal({ isOpen, onClose, scene, onUpdate }: ModalProps) {
  const [editedScene, setEditedScene] = useState<SceneDetails | undefined>(scene);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof SceneDetails, value: string | number) => {
    if (!editedScene) return;

    if (field === 'recordDate') {
      const date = new Date(value as string);
      if (date.toString() === 'Invalid Date') {
        setEditedScene({ ...editedScene, [field as string]: value });
        return;
      }
    }

    setEditedScene({ ...editedScene, [field]: value });
  };

  const handleSave = async () => {
    if (!editedScene || !onUpdate) return;

    setIsSaving(true);

    await fetch(`${import.meta.env.VITE_API_URL}/scenes/${editedScene.id}`, {
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

    onUpdate(editedScene);
    onClose();
    setIsSaving(false);
  };

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
                <DialogTitle as='h3' className='text-lg font-medium leading-6 text-foreground'>
                  {scene ? 'Editar Cena' : 'Nova Cena'}
                </DialogTitle>

                <div className='mt-4 flex flex-col gap-4'>
                  <div>
                    <h4 className='text-sm font-medium text-primary/70'>Título</h4>
                    <input
                      type='text'
                      value={editedScene?.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
                    />
                  </div>

                  <div>
                    <h4 className='text-sm font-medium text-primary/70'>Descrição</h4>
                    <textarea
                      value={editedScene?.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
                      rows={3}
                    />
                  </div>

                  <div>
                    <h4 className='text-sm font-medium text-primary/70'>Episódio</h4>
                    <input
                      type='text'
                      value={editedScene?.episode}
                      onChange={(e) => handleChange('episode', e.target.value)}
                      className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
                    />
                  </div>

                  <div>
                    <h4 className='text-sm font-medium text-primary/70'>Status</h4>
                    <select
                      value={editedScene?.step}
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
                      value={editedScene?.recordDate}
                      onChange={(e) => handleChange('recordDate', e.target.value)}
                      className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
                    />
                  </div>

                  <div>
                    <h4 className='text-sm font-medium text-primary/70'>Local de Gravação</h4>
                    <input
                      type='text'
                      value={editedScene?.recordLocation}
                      onChange={(e) => handleChange('recordLocation', e.target.value)}
                      className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
                    />
                  </div>
                </div>

                <div className='mt-6 flex justify-end gap-2'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
