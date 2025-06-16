import { useMemo, useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { type Scene as SceneType } from '../../../reducers/scenes';
import { cn } from '../../../utils/cn';
import { Modal } from '../Modal';
import { type SceneProps } from './@types';

const heavyComputation = (text: string) => {
  return text.trim();
};

export function Scene({
  id,
  step,
  order,
  title,
  episode,
  onUpdate,
  columnId,
  recordDate,
  description,
  recordLocation,
}: SceneProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const computedTitle = useMemo(() => {
    return heavyComputation(title);
  }, [title]);

  const computedDescription = useMemo(() => {
    return heavyComputation(description);
  }, [description]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: 'Scene',
      step,
      title,
      episode,
      columnId,
      recordDate,
      description,
      recordLocation,
      order,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const sceneDetails: SceneType = {
    id,
    title,
    description,
    step,
    episode,
    columnId,
    recordDate,
    recordLocation,
    order,
  };

  const handleUpdate = async (updatedScene: SceneType) => {
    if (onUpdate) {
      await onUpdate(updatedScene);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scene={sceneDetails}
        onUpdate={handleUpdate}
        mode="edit"
      />
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
        className={cn(
          'flex flex-col gap-2 p-2 cursor-pointer bg-primary text-accent rounded-lg border border-border',
          isDragging && 'opacity-50',
        )}
      >
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-medium'>{computedTitle}</span>
          <span className='text-xs'>{computedDescription}</span>
        </div>
      </div>
    </div>
  );
}
