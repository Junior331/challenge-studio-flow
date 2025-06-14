import { Fragment, useState } from 'react';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XIcon } from 'lucide-react';

import { type Scene as SceneDetails } from '../../reducers/scenes';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene?: SceneDetails;
  onUpdate?: (scene: SceneDetails) => void;
}

const Modal = ({ isOpen, onClose, scene, onUpdate }: ModalProps) => {
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

                    <div className='mt-6 flex justify-end gap-3'>
                      <button
                        onClick={onClose}
                        className='rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10'
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-accent hover:bg-primary/90 disabled:opacity-50'
                      >
                        {isSaving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className='text-primary'>Nenhuma cena selecionada</p>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { Modal, type SceneDetails };
