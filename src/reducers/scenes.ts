/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
import { arrayMove } from '@dnd-kit/sortable';

import { type Scene, type SceneAction, type SceneState } from '../types/scene';

const initialSceneState: SceneState = {
  scenes: [],
  loading: false,
  error: null,
};

const sceneReducer = (state: SceneState, action: SceneAction): SceneState => {
  switch (action.type) {
  case 'SET_SCENES':
    return { ...state, scenes: action.payload, error: null };

  case 'MOVE_SCENE': {
    const { id, toStep } = action.payload;
    return {
      ...state,
      scenes: state.scenes.map((scene) => (scene.id === id ? { ...scene, step: toStep } : scene)),
    };
  }

  case 'UPDATE_SCENE': {
    const { id } = action.payload;
    return {
      ...state,
      scenes: state.scenes.map((scene) =>
        scene.id === id ? { ...scene, ...action.payload } : scene,
      ),
    };
  }

  case 'CREATE_SCENE': {
    return {
      ...state,
      scenes: [...state.scenes, action.payload],
    };
  }

  case 'REORDER_SCENES': {
    const { step, activeId, overId } = action.payload;

    const scenesInStep = state.scenes
      .filter((s) => s.step === step)
      .sort((a, b) => a.order - b.order);

    const activeIndex = scenesInStep.findIndex((s) => s.id === activeId);
    const overIndex = scenesInStep.findIndex((s) => s.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return state;
    }

    const reorderedScenesInStep = arrayMove(scenesInStep, activeIndex, overIndex);
    const updatedScenesInStep = reorderedScenesInStep.map((scene, index) => ({
      ...scene,
      order: index,
    }));

    const newScenes = state.scenes.map((scene) => {
      if (scene.step !== step) return scene;
      const updatedScene = updatedScenesInStep.find((s) => s.id === scene.id);
      return updatedScene || scene;
    });

    return { ...state, scenes: newScenes };
  }

  case 'SET_LOADING':
    return { ...state, loading: action.payload };

  case 'SET_ERROR':
    return { ...state, error: action.payload };

  default:
    return state;
  }
};

export { type Scene, sceneReducer, initialSceneState };
