import { type Actor } from '../../../../types/actor';
import { type ActorFormData } from '../useActorForm';

export interface ActorModalProps {
  actor?: Actor;
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  onSave: (actor: ActorFormData) => Promise<void>;
}
