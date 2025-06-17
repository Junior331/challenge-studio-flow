import { type Scene } from '../../../../reducers/scenes';

type SceneDetails = Scene;

interface BaseModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export type { SceneDetails, BaseModalProps };
