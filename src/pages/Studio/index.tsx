import { useEffect, useMemo, useState } from 'react';

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
import { ArrowLeftIcon, PlayIcon, Plus } from 'lucide-react';

import { Button, Title } from '../../components/atoms';
import { Card, Column, Modal, Scene } from '../../components/molecules';
import { type SceneProps } from '../../components/molecules/Scene/@types';
import { useScenes } from '../../contexts/scenes';
import { useProduction } from '../../hooks/useProduction';
import { type Scene as SceneDetails } from '../../reducers/scenes';
import { STEPS } from '../../utils/utils';

const Studio = () => {
  const { selectedProduction, productions, selectProduction, deselectProduction } = useProduction();
  const { loading, scenes, updateScene, reorderScenes, createScene } = useScenes();
  const [activeScene, setActiveScene] = useState<SceneProps | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Scenes updated:', scenes);
  }, [scenes]);

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

    if (activeStep !== overStep) return;

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

    if (fromStep === toStep) return;

    if (typeof toStep !== 'number') return;
    if (toStep !== fromStep + 1) return;

    const scene = scenes.find((s) => s.id === active.id);
    if (!scene) return;

    const targetStepScenes = scenes.filter((s) => s.step === toStep);
    const newOrder = targetStepScenes.length;

    updateScene({ ...scene, step: toStep, order: newOrder });
  };

  const handleSceneUpdate = (updatedScene: SceneDetails) => {
    updateScene(updatedScene);
  };

  const handleCreateScene = async (newScene: SceneDetails) => {
    if (!selectedProduction) return;
    await createScene(newScene);
    setIsCreateModalOpen(false);
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

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='w-full bg-background p-2 flex flex-col gap-4 h-full'>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' onClick={() => deselectProduction()}>
            <ArrowLeftIcon />
          </Button>
          <Title />
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedProduction}
          className='h-9 px-4 md:px-6'
        >
          <Plus className='h-4 w-4 md:mr-2' />
          <span className='hidden md:inline'>Criar</span>
        </Button>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUpdate={handleCreateScene}
        mode='create'
        scenes={scenes}
      />

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
                scenes={stepScenes}
                id={`column-${step}`}
                step={step}
                label={STEPS[step]}
                count={stepScenes.length}
              >
                {stepScenes
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
