import { type Scene as SceneType } from '../../../../reducers/scenes';

interface SceneProps {
  id: string;
  step: number;
  title: string;
  episode: string;
  columnId: string;
  recordDate: string;
  description: string;
  recordLocation: string;
  onUpdate?: (scene: SceneType) => void;
}

export type { SceneProps };
