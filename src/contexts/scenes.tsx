import { type ReactNode, createContext, useContext, useEffect, useReducer } from 'react';

import { initialSceneState, sceneReducer } from '../reducers/scenes';
import { api } from '../services/api';
import { type Scene, type SceneState } from '../types/scene';

interface ScenesContextType extends SceneState {
  fetchScenes: () => Promise<void>;
  updateScene: (scene: Scene) => Promise<void>;
  createScene: (scene: Scene, scenes: Scene[]) => Promise<void>;
  reorderScenes: (step: number, activeId: string, overId: string) => void;
}

const ScenesContext = createContext<ScenesContextType | undefined>(undefined);

export function ScenesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sceneReducer, initialSceneState);

  const fetchScenes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const scenes = await api.scenes.getAll();
      dispatch({ type: 'SET_SCENES', payload: scenes });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateScene = async (scene: Scene) => {
    try {
      const updatedScene = await api.scenes.update(scene);
      dispatch({ type: 'UPDATE_SCENE', payload: updatedScene });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update scene',
      });
      throw error;
    }
  };

  const createScene = async (scene: Scene, scenes: Scene[]) => {
    try {
      const body = {
        ...scene,
        order: scenes?.length ?? 0,
        id: (scenes.length + 1).toString(),
      };

      const newScene = await api.scenes.create(body);
      dispatch({ type: 'CREATE_SCENE', payload: newScene });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to create scene',
      });
      throw error;
    }
  };

  const reorderScenes = (step: number, activeId: string, overId: string) => {
    if (!activeId || !overId || activeId === overId) return;

    const scenesInStep = state.scenes.filter((s) => s.step === step);
    const activeExists = scenesInStep.some((s) => s.id === activeId);
    const overExists = scenesInStep.some((s) => s.id === overId);

    if (!activeExists || !overExists) return;

    dispatch({ type: 'REORDER_SCENES', payload: { step, activeId, overId } });
  };

  useEffect(() => {
    fetchScenes();
  }, []);

  return (
    <ScenesContext.Provider
      value={{
        ...state,
        fetchScenes,
        updateScene,
        createScene,
        reorderScenes,
      }}
    >
      {children}
    </ScenesContext.Provider>
  );
}

export function useScenes() {
  const context = useContext(ScenesContext);
  if (!context) {
    throw new Error('useScenes must be used within a ScenesProvider');
  }
  return context;
}
