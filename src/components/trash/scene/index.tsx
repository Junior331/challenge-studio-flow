import { useMemo, useState } from 'react';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { type Scene as SceneType } from '../../../reducers/scenes';
import { Modal } from '../../molecules';

interface SceneProps {
  id: string;
  step: number;
  title: string;
  columnId: string;
  description: string;
  episode: string;
  recordDate: string;
  recordLocation: string;
  onUpdate?: (scene: SceneType) => void;
}

const heavyComputation = (text: string) => {
  return text.trim();
};

const Scene = ({
  id,
  title,
  description,
  columnId,
  step,
  episode,
  recordDate,
  recordLocation,
  onUpdate,
}: SceneProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const computedTitle = useMemo(() => {
    return heavyComputation(title);
  }, [title]);

  const computedDescription = useMemo(() => {
    return heavyComputation(description);
  }, [description]);

  const { attributes, listeners, setNodeRef, transform, active } = useDraggable({
    id,
    attributes: { role: 'button' },
    data: {
      columnId,
      step,
      title,
      description,
      episode,
      recordDate,
      recordLocation,
    },
  });

  const sceneDetails: SceneType = {
    id,
    title,
    description,
    step,
    episode,
    columnId,
    recordDate,
    recordLocation,
  };

  const handleUpdate = (updatedScene: SceneType) => {
    if (onUpdate) {
      onUpdate(updatedScene);
    }
  };

  if (active?.id === id) {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className='flex flex-col gap-2 p-2 cursor-pointer bg-primary opacity-50 text-accent rounded-lg border border-border'
      >
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-medium'>{computedTitle}</span>
          <span className='text-xs'>{computedDescription}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scene={sceneDetails}
        onUpdate={handleUpdate}
      />

      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Translate.toString(transform),
        }}
        {...listeners}
        {...attributes}
        onClick={() => setIsModalOpen(true)}
        className='flex flex-col gap-2 p-2 cursor-pointer bg-primary text-accent rounded-lg border border-border'
      >
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-medium'>{computedTitle}</span>
          <span className='text-xs'>{computedDescription}</span>
        </div>
      </div>
    </div>
  );
};

export { Scene, type SceneProps };
