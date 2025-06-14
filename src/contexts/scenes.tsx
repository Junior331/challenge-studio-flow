import { createContext, useContext, useEffect, useReducer } from 'react';
import { type ReactNode } from 'react';

import { type Scene, initialSceneState, sceneReducer } from '../reducers/scenes';

interface ScenesContextType {
  scenes: Scene[];
  loading: boolean;
  error: string | null;
  fetchScenes: () => Promise<void>;
  createScene: (scene: Scene) => Promise<void>;
  updateScene: (scene: Scene) => void;
}

const ScenesContext = createContext<ScenesContextType | undefined>(undefined);

function ScenesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sceneReducer, initialSceneState);

  const fetchScenes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes`);
      if (!response.ok) throw new Error('Failed to fetch scenes');

      const data = await response.json();
      dispatch({ type: 'SET_SCENES', payload: data });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createScene = async (scene: Scene) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scene),
      });

      if (!response.ok) throw new Error('Falha ao criar cena');

      dispatch({ type: 'UPDATE_SCENE', payload: scene });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Erro desconhecido',
      });
    }
  };

  const updateScene = (scene: Scene) => {
    dispatch({ type: 'UPDATE_SCENE', payload: scene });
  };

  useEffect(() => {
    fetchScenes();
  }, []);

  return (
    <ScenesContext.Provider
      value={{
        scenes: state.scenes,
        loading: state.loading,
        error: state.error,
        fetchScenes,
        createScene,
        updateScene,
      }}
    >
      {children}
    </ScenesContext.Provider>
  );
}

function useScenes() {
  const context = useContext(ScenesContext);
  if (context === undefined) {
    throw new Error('useScenes must be used within a ScenesProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useScenes, ScenesProvider };
