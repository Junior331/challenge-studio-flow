import { type Scene } from '../../../../reducers/scenes';

type SceneDetails = Scene;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene?: SceneDetails;
  onUpdate?: (scene: SceneDetails) => void;
}

export type { SceneDetails, ModalProps };
