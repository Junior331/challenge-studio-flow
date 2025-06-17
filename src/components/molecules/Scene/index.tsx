import { useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { type Scene as SceneType } from '../../../reducers/scenes';
import { type Actor } from '../../../types/actor';
import { cn } from '../../../utils/cn';
import { SceneModal } from '../../organisms';
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
  actors = [],
}: SceneProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sceneActors, setSceneActors] = useState<Actor[]>([]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch('http://localhost:3001/actors');
        if (!response.ok) throw new Error('Failed to fetch actors');
        const allActors = await response.json();
        const filteredActors = allActors.filter((actor: Actor) => actors.includes(actor.id));
        setSceneActors(filteredActors);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching actors:', error);
      }
    };

    if (actors.length > 0) {
      fetchActors();
    }
  }, [actors]);

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
      actors,
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
    actors,
  };

  const handleUpdate = async (updatedScene: SceneType) => {
    if (onUpdate) {
      await onUpdate(updatedScene);
    }
  };

  return (
    <div>
      <SceneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scene={sceneDetails}
        onUpdate={handleUpdate}
        mode='edit'
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
          {sceneActors.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {sceneActors.map((actor) => (
                <span key={actor.id} className='text-xs bg-accent/20 px-2 py-0.5 rounded-full'>
                  {actor.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
