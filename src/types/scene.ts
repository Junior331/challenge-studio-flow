/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';

const sceneSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  step: z.number().min(1),
  episode: z.string().min(1, 'Episode is required'),
  recordDate: z.string().refine((val) => !isNaN(new Date(val).getTime())),
  recordLocation: z.string().min(1, 'Location is required'),
  columnId: z.string(),
  order: z.number(),
  actors: z.array(z.string()),
});

type Scene = z.infer<typeof sceneSchema>;

interface SceneState {
  scenes: Scene[];
  loading: boolean;
  error: string | null;
}

type SceneAction =
  | { type: 'SET_SCENES'; payload: Scene[] }
  | { type: 'MOVE_SCENE'; payload: { id: string; toStep: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SCENE'; payload: Scene }
  | { type: 'REORDER_SCENES'; payload: { step: number; activeId: string; overId: string } }
  | { type: 'CREATE_SCENE'; payload: Scene };

export { sceneSchema };

export type { Scene, SceneState, SceneAction };
