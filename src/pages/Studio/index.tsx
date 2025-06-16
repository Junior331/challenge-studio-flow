import { useMemo, useState } from 'react';

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ArrowLeftIcon, PlayIcon } from 'lucide-react';

import { Button, Title } from '../../components/atoms';
import { Card, Column, Scene } from '../../components/molecules';
import { type SceneProps } from '../../components/molecules/Scene/@types';
import { useScenes } from '../../contexts/scenes';
import { useProduction } from '../../hooks/useProduction';
import { type Scene as SceneDetails } from '../../reducers/scenes';

const steps: Record<number, string> = {
  1: 'Roteirizado',
  2: 'Em pré-produção',
  3: 'Em gravação',
  4: 'Em pós-produção',
  5: 'Finalizado',
};

const Studio = () => {
  const { selectedProduction, productions, selectProduction, deselectProduction } = useProduction();
  const { scenes, updateScene, reorderScenes } = useScenes();
  const [activeScene, setActiveScene] = useState<SceneProps | null>(null);

  const scenesByStep = useMemo(() => {
    return scenes.reduce(
      (acc, scene) => {
        if (!acc[scene.step]) {
          acc[scene.step] = [];
        }
        acc[scene.step].push(scene);
        return acc;
      },
      {} as Record<number, SceneDetails[]>,
    );
  }, [scenes]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveScene({
      id: active.id as string,
      step: active.data.current?.step,
      order: active.data.current?.order,
      title: active.data.current?.title,
      episode: active.data.current?.episode,
      columnId: active.data.current?.columnId,
      recordDate: active.data.current?.recordDate,
      description: active.data.current?.description,
      recordLocation: active.data.current?.recordLocation,
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeStep = active.data.current?.step;
    const overStep = over.data.current?.step;

    // Se estiver movendo entre colunas
    if (activeStep !== overStep) {
      return;
    }

    // Se estiver na mesma coluna, trata como reordenação
    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId !== overId) {
      reorderScenes(activeStep, activeId, overId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveScene(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromStep = active.data.current?.step;
    const toStep = over.data.current?.step;

    // Se estiver na mesma coluna, a reordenação já foi tratada no dragOver
    if (fromStep === toStep) return;

    if (typeof toStep !== 'number') return;
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

  if (!selectedProduction) {
    return (
      <div className='w-screen bg-background p-4 flex flex-col gap-4'>
        <div className='flex flex-wrap gap-4'>
          {productions.map((production) => (
            <Card
              key={production.id}
              icon={<PlayIcon />}
              title={production.name}
              subtitle={production.description}
              quickLinks={[
                {
                  label: 'Ir para produção',
                  onClick: () => {
                    selectProduction(production);
                  },
                },
              ]}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-background p-2 flex flex-col gap-4 h-full'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={() => deselectProduction()}>
          <ArrowLeftIcon />
        </Button>
        <Title />
      </div>
      <div className='flex gap-4 overflow-x-auto w-full h-full pr-2'>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          collisionDetection={closestCorners}
        >
          <DragOverlay>{activeScene ? <Scene {...activeScene} /> : null}</DragOverlay>
          {[1, 2, 3, 4, 5].map((step) => {
            const stepScenes = scenesByStep[step] || [];

            return (
              <Column
                key={step}
                scenes={scenes}
                id={`column-${step}`}
                step={step}
                label={steps[step]}
                count={scenes.filter((s) => s.step === step).length}
              >
                {stepScenes
                  .filter((scene) => scene.step === step)
                  .sort((a, b) => a.order - b.order)
                  .map((scene) => (
                    <Scene key={scene.id} {...scene} onUpdate={handleSceneUpdate} />
                  ))}
              </Column>
            );
          })}
        </DndContext>
      </div>
    </div>
  );
};

export default Studio;
