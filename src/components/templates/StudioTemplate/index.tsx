import { useState } from 'react';

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ArrowLeftIcon } from 'lucide-react';

import { useScenes } from '../../../contexts/scenes';
import { type Scene as SceneDetails } from '../../../reducers/scenes';
import { Button } from '../../atoms/Button';
import { Column } from '../../molecules/Column';
import { Scene, type SceneProps } from '../../molecules/Scene';

const steps: Record<number, string> = {
  1: 'Roteirizado',
  2: 'Em pré-produção',
  3: 'Em gravação',
  4: 'Em pós-produção',
  5: 'Finalizado',
};

interface StudioTemplateProps {
  onBack: () => void;
}

export function StudioTemplate({ onBack }: StudioTemplateProps) {
  const { scenes, updateScene } = useScenes();
  const [activeScene, setActiveScene] = useState<SceneProps | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveScene({
      id: active.id as string,
      step: active.data.current?.step,
      columnId: active.data.current?.columnId,
      title: active.data.current?.title,
      description: active.data.current?.description,
      episode: active.data.current?.episode,
      recordDate: active.data.current?.recordDate,
      recordLocation: active.data.current?.recordLocation,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveScene(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromStep = active.data.current?.step;
    const toStep = over.data.current?.step;

    if (typeof toStep !== 'number' || fromStep === toStep) return;
    if (toStep !== fromStep + 1) return;

    const scene = scenes.find((s) => s.id === active.id);
    if (!scene) return;

    updateScene({ ...scene, step: toStep });
  };

  const handleSceneUpdate = (updatedScene: SceneDetails) => {
    updateScene(updatedScene);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  return (
    <div className='w-full bg-background p-4 flex flex-col gap-4 h-full'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={onBack}>
          <ArrowLeftIcon />
        </Button>
        <h1 className='text-xl font-semibold text-foreground'>StudioFlow</h1>
      </div>

      <div className='flex gap-4 overflow-x-auto w-full h-full'>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
          <DragOverlay>{activeScene ? <Scene {...activeScene} /> : null}</DragOverlay>
          {[1, 2, 3, 4, 5].map((step) => (
            <Column
              key={step}
              id={`column-${step}`}
              step={step}
              label={steps[step]}
              count={scenes.filter((s) => s.step === step).length}
            >
              {scenes
                .filter((scene) => scene.step === step)
                .map((scene) => (
                  <Scene key={scene.id} {...scene} onUpdate={handleSceneUpdate} />
                ))}
            </Column>
          ))}
        </DndContext>
      </div>
    </div>
  );
}
