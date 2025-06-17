/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';

import { type Scene } from '../../../../reducers/scenes';

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

interface SceneModalProps {
  scene?: Scene;
  isOpen: boolean;
  scenes?: Scene[];
  onClose: () => void;
  mode?: 'create' | 'edit';
  onUpdate: (scene: Scene) => Promise<void>;
}

type SceneDetails = z.infer<typeof sceneSchema>;

export { sceneSchema };
export type { SceneDetails, SceneModalProps };
