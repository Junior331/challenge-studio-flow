// eslint-disable-next-line import/no-extraneous-dependencies
import { arrayMove } from '@dnd-kit/sortable';

/* eslint-disable indent */
type Scene = {
  id: string;
  step: number;
  order: number;
  title: string;
  episode: string;
  columnId: string;
  actors: string[];
  recordDate: string;
  description: string;
  recordLocation: string;
};

type State = {
  scenes: Scene[];
  loading: boolean;
  error: string | null;
};

const initialSceneState: State = {
  scenes: [],
  loading: false,
  error: null,
};

type Action =
  | { type: 'SET_SCENES'; payload: Scene[] }
  | { type: 'MOVE_SCENE'; payload: { id: string; toStep: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SCENE'; payload: Scene }
  | { type: 'REORDER_SCENES'; payload: { step: number; activeId: string; overId: string } };

const sceneReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SCENES':
      return { ...state, scenes: action.payload, error: null };

    case 'MOVE_SCENE':
      return {
        ...state,
        scenes: state.scenes.map((scene) =>
          scene.id === action.payload.id ? { ...scene, step: action.payload.toStep } : scene,
        ),
      };

    case 'UPDATE_SCENE':
      return {
        ...state,
        scenes: state.scenes.map((scene) =>
          scene.id === action.payload.id ? { ...scene, ...action.payload } : scene,
        ),
      };

    case 'REORDER_SCENES': {
      const { step, activeId, overId } = action.payload;

      const scenesInStep = state.scenes
        .filter((s) => s.step === step)
        .sort((a, b) => a.order - b.order);

      const activeIndex = scenesInStep.findIndex((s) => s.id === activeId);
      const overIndex = scenesInStep.findIndex((s) => s.id === overId);

      if (activeIndex === -1 || overIndex === -1) {
        return state;
      }

      if (activeIndex === overIndex) {
        return state;
      }

      const reorderedScenesInStep = arrayMove(scenesInStep, activeIndex, overIndex);

      const updatedScenesInStep = reorderedScenesInStep.map((scene, index) => ({
        ...scene,
        order: index,
      }));

      const newScenes = state.scenes.map((scene) => {
        if (scene.step !== step) {
          return scene;
        }

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

export { initialSceneState, sceneReducer, type Scene };
