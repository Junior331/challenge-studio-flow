import { type Scene } from '../../../reducers/scenes';

interface ModalProps {
  scene?: Scene;
  scenes?: Scene[];
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  onUpdate: (scene: Scene) => Promise<void>;
}

export type { Scene as SceneDetails, ModalProps };
