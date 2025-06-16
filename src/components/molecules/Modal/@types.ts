interface SceneDetails {
  id: string;
  step: number;
  title: string;
  order: number;
  episode: string;
  columnId: string;
  recordDate: string;
  description: string;
  recordLocation: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene?: SceneDetails;
  scenes?: SceneDetails[];
  onUpdate: (scene: SceneDetails) => Promise<void>;
  mode?: 'create' | 'edit';
}

export type { SceneDetails, ModalProps };
